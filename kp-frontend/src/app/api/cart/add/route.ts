import { api, ApiResponse } from "@/utils/api";
import { NextResponse } from "next/server";
import z from "zod";

type ThisResponse = {
  data: {
    id: number;
    sizes: { id: number; stock: number }[];
  }[];
};

const schema = z.object({
  id: z.number().int().gt(0),
  size: z.number().int().gt(0),
  quantity: z.number().int().gt(0).lt(10000),
});

export const POST = async (req: Request) => {
  const body = await req.json();
  schema.parse(body);

  const { success, data: res } = (await api.get(
    `/products?filters[id][$in]=${body.id}&filters[sizes][id][$eq]=${body.size}&populate=sizes`
  )) as ApiResponse<ThisResponse>;

  if (!success || !res) throw new Error("Failed to fetch product");
  if (res.data.length === 0) return new NextResponse(null, { status: 404 });

  const product = res.data[0];

  const stock = product.sizes.find((s) => s.id === body.size)?.stock ?? 0;

  return NextResponse.json(stock);
};
