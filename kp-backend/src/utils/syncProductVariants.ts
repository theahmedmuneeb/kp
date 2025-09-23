// Enhanced with ChatGPT

import type { Core } from "@strapi/strapi";

export async function syncProductVariants(strapi: Core.Strapi, result: any) {
  // Fetch product with variants
  const product = await strapi.db.query("api::product.product").findOne({
    where: { id: result.id },
    populate: { variants: true },
  });

  const variantIds = Array.isArray(product.variants)
    ? product.variants.map((v: any) => v.id)
    : [];

  // Full group = product + its variants
  const ids = [product.id, ...variantIds];

  // --- Sync all products in group ---
  for (const id of ids) {
    const others = ids.filter((x) => x !== id);

    // Fetch existing variants for this product
    const existing = await strapi.db.query("api::product.product").findOne({
      where: { id },
      populate: { variants: true },
    });

    const existingIds = existing.variants.map((v: any) => v.id);

    // Only update if there’s a difference
    const same =
      existingIds.length === others.length &&
      existingIds.every((val: number) => others.includes(val));

    if (!same) {
      await strapi.db.query("api::product.product").update({
        where: { id },
        data: { variants: { set: others } },
      });
    }
  }

  // --- Remove stale links ---
  const linked = await strapi.db.query("api::product.product").findMany({
    where: { variants: { id: product.id } },
    populate: { variants: true },
  });

  for (const link of linked) {
    if (ids.includes(link.id)) continue;

    const newVariants = link.variants
      .map((v: any) => v.id)
      .filter((id: number) => !ids.includes(id));

    const existingIds = link.variants.map((v: any) => v.id);

    // Only update if something really changed
    const same =
      existingIds.length === newVariants.length &&
      existingIds.every((val: number) => newVariants.includes(val));

    if (!same) {
      await strapi.db.query("api::product.product").update({
        where: { id: link.id },
        data: { variants: { set: newVariants } },
      });
    }
  }
}
