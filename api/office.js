import { getOfficeCatalog } from '../server/office.js';
import { json, noStore } from '../server/http.js';
export default async function handler(req,res) {
  noStore(res);
  if(req.method !== 'GET') {res.setHeader('Allow','GET');return json(res,405,{message:'Método não permitido.'});}
  try {return json(res,200,await getOfficeCatalog());}
  catch {return json(res,503,{message:'Não foi possível carregar as opções Office. Tente novamente.'});}
}
