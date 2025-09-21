import { stripe } from "./stripe";

export async function paymentIntent(amount: number, intentId?: string) {
    if (intentId) {
        return await stripe.paymentIntents.update(intentId, {
            amount,
            metadata: {
                updatedAt: new Date().toISOString()
            }
        });
    } else {
        return await stripe.paymentIntents.create({
            currency: "usd",
            automatic_payment_methods: { enabled: true },
            amount,
        });
    }
}