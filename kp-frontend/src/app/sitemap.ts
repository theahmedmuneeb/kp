import { Main } from '@/types/strapi'
import { api } from '@/utils/api'
import type { MetadataRoute } from 'next'

async function getProducts(): Promise<{ slug: string, updatedAt: string }[]> {
    const { success, data: productsData } = await api.get<Main & { data: { slug: string, updatedAt: string }[] }>('/products?pagination[pageSize]=100000&fields=slug&fields=updatedAt')

    if (!success || !productsData) {
        return []
    }

    return productsData.data.map(({ slug, updatedAt }) => ({ slug, updatedAt }))
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const base = process.env.NEXT_PUBLIC_SITE_URL || ''

    return [
        {
            url: base,
            lastModified: new Date()
        },
        {
            url: base + '/services',
            lastModified: new Date()
        },
        {
            url: base + '/policy',
            lastModified: new Date()
        },
        {
            url: base + '/wholesale',
            lastModified: new Date()
        },
        {
            url: base + '/get-quote',
            lastModified: new Date()
        },
        {
            url: base + '/about',
            lastModified: new Date()
        },
        ...(await getProducts()).map((p) => ({
            url: `${base}/product/${p.slug}`,
            lastModified: new Date(p.updatedAt)
        }))

    ]
}