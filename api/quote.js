import { createQuote } from "../server/quote.js";
import { createOfficeQuote } from "../server/office.js";
import { json, noStore, readBody } from "../server/http.js";
export default async function handler(req, res) {
  noStore(res);
  if (req.method !== "POST") { res.setHeader("Allow", "POST"); return json(res, 405, { message: "Método não permitido." }); }
  let body;
  try { body = await readBody(req); }
  catch { return json(res, 400, { message: "Pedido inválido. Revise a montagem." }); }
  try {
    const result = await (body?.kind === 'office' || body?.kind === 'mini' ? createOfficeQuote(body) : createQuote(body));
    return json(res, 200, result);
  } catch (error) {
    return json(res, error.status === 400 ? 400 : 503, { message: error.status === 400 ? error.message : "Não foi possível validar o orçamento e o cupom. Tente novamente." });
  }
}
