import { sanityQuery } from '../server/sanity.js';
import { gamerCatalogQuery } from '../shared/gamer-catalog.js';
import { json, noStore } from '../server/http.js';

// Same-origin catalog avoids browser CORS, CDN or extension failures on Sanity.
// Read only published data. Never replace a failed query with an empty success.
export default async function handler(req, res) {
  noStore(res);
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return json(res, 405, { message: 'Método não permitido.' });
  }
  try {
    const result = await sanityQuery(gamerCatalogQuery);
    if (!Array.isArray(result)) throw new Error('Catálogo inválido');
    return json(res, 200, { result });
  } catch {
    return json(res, 503, { message: 'Não foi possível atualizar o catálogo. Tente novamente.' });
  }
}
