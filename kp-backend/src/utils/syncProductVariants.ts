import type { Core } from "@strapi/strapi";

function isNumberArraysEqual(a: number[], b: number[]) {
  if (a.length !== b.length) return false;
  return a.every((val, i) => val === b[i]);
}

export async function syncProductVariants(
  strapi: Core.Strapi,
  result: any,
  oldProduct: any | null = null,
  syncedProducts: Set<number>,
) {
  const product = await strapi.db.query("api::product.product").findOne({
    where: { id: result.id },
    populate: { variants: true },
  });

  const variantIds = Array.isArray(product.variants)
    ? product.variants.map((v: any) => v.id)
    : [];

  if (oldProduct && Array.isArray(oldProduct.variants)) {
    const oldVariantIds = oldProduct.variants.map((v: any) => v.id);

    if (isNumberArraysEqual(variantIds, oldVariantIds)) {
      return;
    }
  }

  const ids = [result.id, ...variantIds] as number[];

  // --- Sync Variants ---
  for (const id of ids) {
    if (syncedProducts.has(id)) continue;
    syncedProducts.add(id);

    const variants = ids.filter((x) => x !== id);

    await strapi.db.query("api::product.product").update({
      where: { id },
      data: { variants: { set: variants } },
    });
  }

  // --- Remove variants that are no longer linked ---
  const linked = await strapi.db.query("api::product.product").findMany({
    where: { variants: { id: result.id } },
    populate: { variants: true },
  });

  for (const link of linked) {
    if (ids.includes(link.id)) continue;

    const newVariants = link.variants
      .map((v: any) => v.id)
      .filter((id: number) => !ids.includes(id));

    await strapi.db.query("api::product.product").update({
      where: { id: link.id },
      data: {
        variants: [...new Set(newVariants)],
      },
    });
  }
}
