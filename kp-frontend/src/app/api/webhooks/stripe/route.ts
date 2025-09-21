import { stripe } from "@/lib/pay/stripe";
import { api } from "@/utils/api";
import { NextResponse } from "next/server";
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
                const { success: existingOrderSuccess, data: existingOrder } = await api.get<any>(`/orders?filters[intent][$eq]=${intent.id}&filters[orderStatus][$eq]=pending`);
                if (!existingOrderSuccess || !existingOrder || !Array.isArray(existingOrder.data) || existingOrder.data.length === 0) {
                    return new NextResponse('No Order Found', { status: 404 })
                }
                const order = existingOrder.data[0]
                const { success: updatedOrderSuccess } = await api.put<any>(`/orders/${order.documentId}`, {
                    data: {
                        orderStatus: 'processing'
                    }
                }, {}, process.env.API_WRITE_TOKEN)
                if (!updatedOrderSuccess) {
                    return new NextResponse('Error while making order', { status: 500 })
                }
                return new NextResponse('Success')
            }
            case "payment_intent.payment_failed": {
                const intent = event.data.object

                const { success: existingOrderSuccess, data: existingOrder } = await api.get<any>(`/orders?filters[intent][$eq]=${intent.id}&filters[orderStatus][$eq]=pending`);
                if (!existingOrderSuccess || !existingOrder || !Array.isArray(existingOrder.data) || existingOrder.data.length === 0) {
                    return new NextResponse('No Order Found', { status: 200 })
                }

                const order = existingOrder.data[0]

                const { success: deleteOrderSuccess } = await api.delete(`/orders/${order.documentId}`, {}, process.env.API_WRITE_TOKEN)
                if (!deleteOrderSuccess) {
                    return new NextResponse('Error while deleting order', { status: 500 })
                }
                return new NextResponse('Success')
            }

        }
    } catch (err) {
        return new NextResponse('Something went wrong', { status: 500 })
    }

}