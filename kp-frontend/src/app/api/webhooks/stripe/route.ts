import { stripe } from "@/lib/pay/stripe";
import { api } from "@/utils/api";
import { NextResponse } from "next/server";
import { Client } from "pg";
import Stripe from "stripe";

export const POST = async (req: Request) => {
    const body = await req.text();
    const sig = req.headers.get("stripe-signature") as string;

    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
    } catch (err: any) {
        return new NextResponse(null, { status: 400 });
    }

    try {
        switch (event.type) {
            case "payment_intent.succeeded": {
                const intent = event.data.object
                const { success: existingOrderSuccess, data: existingOrder } = await api.get<any>(`/orders?filters[intent][$eq]=${intent.id}&filters[orderStatus][$eq]=pending&populate=items`);
                if (!existingOrderSuccess || !existingOrder || !Array.isArray(existingOrder.data) || existingOrder.data.length === 0) {
                    return new NextResponse('No Order Found')
                }
                let order = existingOrder.data[0]

                const ids = order.items.map((i: { sizeId: any; }) => Number(i.sizeId));
                const quantities = order.items.map((i: { quantity: any; }) => i.quantity);

                const db = new Client({
                    user: process.env.DATABASE_USERNAME,
                    host: process.env.DATABASE_HOST,
                    database: process.env.DATABASE_NAME,
                    password: process.env.DATABASE_PASSWORD,
                    port: Number(process.env.DATABASE_PORT) || 5432,
                });

                try {
                    await db.connect();

                    await db.query("BEGIN");

                    const q1 = await db.query(`
                        UPDATE components_kp_product_sizes p
                        SET stock = GREATEST(p.stock - q, 0)
                        FROM unnest($1::int[], $2::int[]) AS u(id, q)
                        WHERE p.id = u.id;`,
                        [ids, quantities]
                    );

                    const q2 = await db.query(
                        `UPDATE orders
                        SET order_status = 'received'
                        WHERE id = $1;`,
                        [order.id]
                    );

                    await db.query("COMMIT");
                } catch (err) {
                    await db.query("ROLLBACK");
                    throw err;
                } finally {
                    await db.end();
                }
                return new NextResponse('Success')
            }
            case "payment_intent.payment_failed": {
                const intent = event.data.object

                const { success: existingOrderSuccess, data: existingOrder } = await api.get<any>(`/orders?filters[intent][$eq]=${intent.id}&filters[orderStatus][$eq]=pending`);
                if (!existingOrderSuccess || !existingOrder || !Array.isArray(existingOrder.data) || existingOrder.data.length === 0) {
                    return new NextResponse('No Order Found')
                }

                const order = existingOrder.data[0]

                const { success: deleteOrderSuccess } = await api.delete(`/orders/${order.documentId}`, {}, process.env.API_WRITE_TOKEN)
                if (!deleteOrderSuccess) {
                    return new NextResponse('Error while deleting order', { status: 500 })
                }
                return new NextResponse('Success')
            }
            default:
                return new NextResponse("Unhandled event type", { status: 200 });

        }
    } catch (err) {
        return new NextResponse('Something went wrong', { status: 500 })
    }

}