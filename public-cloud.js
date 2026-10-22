import {configured,db,toProfile} from './cloud.js';
window.DRIVERS=[];
if(configured){
 try {
  const client=await db();
  const {data,error}=await client.from('choferes').select('slug,nombre,whatsapp,foto_url,vehiculo,descripcion,servicios').eq('activo',true).order('nombre');
  if(error)throw error;
  window.DRIVERS=(data||[]).map(toProfile);
 } catch(e) {console.error(e);window.TURISMO_LOAD_ERROR=true;}
}
await import('./app.js');
