// Liga "Mostrar no site" nas peças importadas com revisão ok (sem preço: aparecem como "Sob consulta").
// O dono pode desligar qualquer uma no painel. Uso: SANITY_TOKEN=... node import/ciapc/ativar.mjs
const T = process.env.SANITY_TOKEN;
if (!T) throw new Error("Defina SANITY_TOKEN");
const API = "https://9in9aaz1.api.sanity.io/v2025-02-19";
const q = encodeURIComponent('*[_type=="peca" && _id match "ciapc-*" && revisao=="ok" && active==false]._id');
const ids = (await (await fetch(`${API}/data/query/production?query=${q}`, { headers: { authorization: `Bearer ${T}` } })).json()).result;
for (let i = 0; i < ids.length; i += 100) {
  const r = await fetch(`${API}/data/mutate/production`, { method: "POST", headers: { "content-type": "application/json", authorization: `Bearer ${T}` }, body: JSON.stringify({ mutations: ids.slice(i, i + 100).map((id) => ({ patch: { id, set: { active: true } } })) }) });
  if (!r.ok) throw new Error(await r.text());
}
console.log("peças ativadas:", ids.length);
