const cfg = window.TURISMO_CLOUD || {};
export const configured = Boolean(cfg.url && cfg.anonKey && cfg.anonKey !== 'PEGA_AQUI_TU_PUBLISHABLE_KEY');
let client;
export async function db() {
  if (!configured) throw new Error('Primero coloca tu Publishable key en cloud-config.js');
  if (!client) {
    const {createClient} = await import('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm');
    client = createClient(cfg.url, cfg.anonKey);
  }
  return client;
}
export function toProfile(r) {
  return {id:r.slug,name:r.nombre,role:'Profesional turístico',company:r.vehiculo||'Turismo QR',location:'Punta Cana',whatsapp:r.whatsapp||'',phone:r.whatsapp||'',photo:r.foto_url||'',cover:'',description:{es:r.descripcion||'',en:r.descripcion||''},services:Array.isArray(r.servicios)?r.servicios:[]};
}
export function toRow(d) {
  return {slug:d.id,nombre:d.name,whatsapp:d.whatsapp,foto_url:d.photo||null,vehiculo:d.company||null,descripcion:d.description.es||'',servicios:d.services,activo:true};
}
