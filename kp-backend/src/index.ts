import type { Core } from "@strapi/strapi";
import { syncProductVariants } from "./utils/syncProductVariants";

const productCache = new Map<number, any>();

export default {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register(/* { strapi }: { strapi: Core.Strapi } */) { },

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  bootstrap({ strapi }: { strapi: Core.Strapi }) {
    // Keep track of synced products
    const syncedProducts = new Set<number>();

    strapi.db.lifecycles.subscribe({
      // Lifecycle events for the 'product' model
      models: ["api::product.product"],
      async beforeCreate(event) {
        // Trimming title before creating
        if (event.params.data.title)
          event.params.data.title = event.params.data.title.trim();
      },
      async beforeUpdate(event) {
        // Trimming title before updating
        if (event.params.data.title)
          event.params.data.title = event.params.data.title.trim();

        const product = await strapi.db.query("api::product.product").findOne({
          where: { id: event.params.where.id },
          populate: { variants: true },
        });

        productCache.set(event.params.where.id, product);
      },
      async afterCreate(event) {
        // Sync variants after create
        await syncProductVariants(strapi, event.result, productCache.get(event.params.where.id), syncedProducts);
      },
      async afterUpdate(event) {
        // Sync variants after update
        await syncProductVariants(strapi, event.result, productCache.get(event.params.where.id), syncedProducts);
        productCache.delete(event.params.where.id);
      },
    });
  },
};
