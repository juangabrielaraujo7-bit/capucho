export async function sanityQuery(query, params = {}, fetcher = fetch) {
  const project = process.env.SANITY_PROJECT_ID || "9in9aaz1";
  const dataset = process.env.SANITY_DATASET || "production";
  const url = new URL(`https://${project}.api.sanity.io/v2025-02-19/data/query/${dataset}`);
  url.searchParams.set("perspective", "published");
  url.searchParams.set("query", query);
  for (const [key, value] of Object.entries(params)) url.searchParams.set(`$${key}`, JSON.stringify(value));
  const response = await fetcher(url, {
    cache: "no-store", signal: AbortSignal.timeout(8000),
    headers: process.env.SANITY_READ_TOKEN ? { Authorization: `Bearer ${process.env.SANITY_READ_TOKEN}` } : {},
  });
  if (!response.ok) throw new Error("Consulta ao Sanity indisponível");
  const data = await response.json();
  if (!("result" in data)) throw new Error("Resposta do Sanity inválida");
  return data.result;
}
export const couponProjection = '*[_id == "cupom-desconto" && _type == "cupomDesconto"][0]{active,code,discountType,value,_rev}';
