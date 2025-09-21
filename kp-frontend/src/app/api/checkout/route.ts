import { NextResponse } from "next/server"
import { cartSchema } from "../cart/route";
import z, { safeParse } from "zod";
import axios from "axios";
import { checkoutFormSchema } from "@/components/app/checkout-form";
import { CartContent } from "@/types/strapi";
import { Intent } from "@/lib/fetch";

const schema = z.object({
    ...cartSchema.shape,
    intentId: z.string(),
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
    })
})

export const POST = async (req: Request) => {
    try {
        const body = (await req.json().catch(() => ({}))) as z.infer<typeof schema>;

        const parseResult = safeParse(schema, body);
        if (!parseResult.success) {
            return new NextResponse(null, { status: 400 });
        }

        const { data: cart } = await axios.post<{ cart: CartContent | null, intent: Intent }>(`${process.env.NEXT_PUBLIC_SITE_URL}/api/cart`, {
            cart: body.cart,
            intentId: body.intentId
        });

        return NextResponse.json(cart)
    } catch (err) {
        console.log(err)
        return new NextResponse(null, { status: 500 });
    }
}