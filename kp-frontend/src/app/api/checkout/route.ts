import { NextResponse } from "next/server"
import { cartSchema } from "../cart/route";
import z, { json, safeParse } from "zod";
import axios from "axios";
import { checkoutFormSchema } from "@/components/app/checkout-form";
import { CartContent } from "@/types/strapi";
import { Intent } from "@/lib/fetch";
import isObjectsEqual from "fast-deep-equal";
import { api } from "@/utils/api";
import { stripe } from "@/lib/pay/stripe";

const schema = z.object({
    ...cartSchema.shape,
    intentId: z.string().min(1),
    method: z.string().min(1),
    meta: z.object({
        name: z.string().min(3, "Name must be at least 3 characters"),
        email: z.email({
            error: (issue) =>
                issue.input ? "Invalid email address" : "Email is required",
        }),
        country: z.string("Country is required").min(1, "Country is required"),
        state: z.string("State is required").min(1, "State is required"),
        city: z
            .string()
            .min(3, "City must be at least 3 characters")
            .max(50, "City must be at most 50 characters"),
        zip: z
            .string()
            .regex(/^[0-9]+$/, "Zip Code can only contain numbers")
            .min(3, "Zip Code must be at least 3 digits")
            .max(10, "Zip Code must be at most 10 digits"),

        address: z.string().min(10, "Address must be at least 10 characters"),
    }),
})

export const POST = async (req: Request) => {
    try {
        const body = (await req.json().catch(() => ({}))) as z.infer<typeof schema>;

        const parseResult = safeParse(schema, body);
        if (!parseResult.success) {
            return new NextResponse(null, { status: 400 });
        }

        const { data: newCartData } = await axios.post<{ cart: CartContent | null, intent: Intent }>(`${process.env.NEXT_PUBLIC_SITE_URL}/api/cart`, {
            cart: body.cart,
            intentId: body.intentId
        });

        if (!newCartData.cart) {
            return new NextResponse(null, { status: 400 });
        }

        const newCart = newCartData.cart.map((item) => ({
            id: item.id,
            size: item.size.id,
            quantity: item.quantity,
        }));

        if (!isObjectsEqual(body.cart, newCart)) {
            return NextResponse.json({ cart: newCart, intent: newCartData.intent }, { status: 409 });
        }

        const orderData = {
            name: body.meta.name,
            email: body.meta.email,
            country: body.meta.country,
            state: body.meta.state,
            city: body.meta.city,
            zip: body.meta.zip,
            address: body.meta.address,
            amount: newCartData.cart.reduce((acc, item) => acc + item.total, 0),
            deliveryCharges: 10,
            amountPaid: 69,
            info: `Order By ${body.meta.name} - (${body.meta.email})\nAddress: ${body.meta.address}, ${body.meta.city}, ${body.meta.state}, ${body.meta.country} - ${body.meta.zip}\nProducts:\n${newCartData.cart.map((item) => `- ${item.title} (${item.size.title}) x ${item.quantity}`).join("\n")}\nTotal: $${newCartData.cart.reduce((acc, item) => acc + item.total, 0)}\nDelivery Charges: $10\nAmount Paid: $${69}\n`,
            intent: body.intentId,
            json: JSON.stringify(newCartData.cart),
            items: newCartData.cart.map((item) => ({
                product: item.id,
                size: item.size.title,
                quantity: item.quantity,
            }))
        }

        let order;
        const { success: existingOrderSuccess, data: existingOrder } = await api.get<any>(`/orders?filters[intent][$eq]=${body.intentId}&filters[orderStatus][$eq]=pending`);
        if (!existingOrderSuccess || !existingOrder || !Array.isArray(existingOrder.data)) {
            return new NextResponse(null, { status: 500 });
        }

        if (existingOrder.data.length > 0) {
            order = existingOrder.data[0];
            const { success: updatedExistingOrderSuccess, data: updatedExistingOrder } = await api.put<any>(`/orders/${order.documentId}`, {
                data: orderData
            }, {}, process.env.API_WRITE_TOKEN);

            if (!updatedExistingOrderSuccess || !updatedExistingOrder || !updatedExistingOrder.data) {
                return new NextResponse(null, { status: 500 });
            }
            order = updatedExistingOrder.data;
        }

        if (existingOrder.data.length === 0) {
            const { success: newOrderSuccess, data: newOrder } = await api.post<any>('/orders', {
                data: orderData
            }, {}, process.env.API_WRITE_TOKEN)

            if (!newOrderSuccess || !newOrder || !newOrder.data) {
                return new NextResponse(null, { status: 500 });
            }
            order = newOrder.data;
        }

        const intent = await stripe.paymentIntents.confirm(body.intentId, {
            payment_method: body.method,
            return_url: `${process.env.NEXT_PUBLIC_SITE_URL}/checkout/status`
        })

        return NextResponse.json({ intent });
    } catch (err) {
        console.log(err)
        return new NextResponse(null, { status: 500 });
    }
}