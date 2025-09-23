import type { Core } from "@strapi/strapi";

export default {
    deleteOldPendingProducts: {
        task: async ({ strapi }: { strapi: Core.Strapi }) => {
            const cutoff = new Date(Date.now() - 10 * 24 * 60 * 60 * 1000);
            const deleted = await strapi.db.query("api::order.order").deleteMany({
                where: {
                    createdAt: { $lt: cutoff },
                    orderStatus: "pending",
                },
            });

            strapi.log.info(`🗑 Deleted ${deleted.count} old products`);
        },
        options: {
            rule: "0 0 * * *",
            tz: "UTC",
        },
    },
};
