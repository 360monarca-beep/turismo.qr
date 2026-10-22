import {configured,db,toProfile,toRow} from './cloud.js';
const $=id=>document.getElementById(id), form=$('profile-form');
let client,records=[],selected=null,originalSlug=null;
const fields=['id','name','role','company','location','whatsapp','phone','photo','cover'];
const feedback=msg=>{$('feedback').textContent=msg};
if(!configured){$('setup').hidden=false;$('login-area').hidden=true}
else{try{client=await db();const {data:{session}}=await client.auth.getSession();if(session)await openAdmin()}catch(e){feedback('Error de conexión: '+e.message)}}
async function openAdmin(){
 const {data:{user},error:userError}=await client.auth.getUser();
 if(userError||!user)return;
 const {data,error}=await client.rpc('es_administrador');
 if(error||data!==true){await client.auth.signOut();feedback('Tu cuenta no tiene permiso de administrador.');return}
 $('login-area').hidden=true;$('admin-area').hidden=false;await refresh();
}
async function refresh(){const {data,error}=await client.from('choferes').select('*').order('nombre');if(error){feedback(error.message);return}records=(data||[]).map(toProfile);if(!records.some(d=>d.id===selected)){selected=records[0]?.id??null}render()}
function render(){
 const box=$('profiles');box.replaceChildren();
 for(const d of records){const b=document.createElement('button');b.type='button';b.className='profile-option'+(selected===d.id?' active':'');b.textContent=d.name+' ('+d.id+')';b.onclick=()=>{selected=d.id;originalSlug=d.id;render()};box.append(b)}
 const d=records.find(x=>x.id===selected);form.hidden=!d;
 if(!d){$('editor-title').textContent='Nuevo perfil';return}
 originalSlug=d.id;$('editor-title').textContent='Editar: '+d.name;
 for(const k of fields)form.elements.namedItem(k).value=d[k]||'';
 form.elements.namedItem('descriptionEs').value=d.description?.es||'';
 form.elements.namedItem('descriptionEn').value=d.description?.en||'';
 form.elements.namedItem('services').value=(d.services||[]).map(s=>[s.es,s.en,s.icon].join(' | ')).join('\n');
}
$('login-form').onsubmit=async e=>{e.preventDefault();feedback('Iniciando sesión...');const f=new FormData(e.currentTarget);const {error}=await client.auth.signInWithPassword({email:f.get('email'),password:f.get('password')});if(error){feedback(error.message);return}feedback('');await openAdmin()};
$('logout').onclick=async()=>{await client.auth.signOut();$('admin-area').hidden=true;$('login-area').hidden=false;feedback('Sesión cerrada.')};
$('new').onclick=()=>{let n=1;while(records.some(x=>x.id==='nuevo-'+n))n++;const d={id:'nuevo-'+n,name:'Nuevo profesional',role:'Chofer turístico',company:'',location:'Punta Cana',whatsapp:'',phone:'',photo:'',cover:'',description:{es:'',en:''},services:[]};records.push(d);selected=d.id;originalSlug=null;render();originalSlug=null;feedback('Completa los datos y guarda para publicar.')};
form.onsubmit=async e=>{
 e.preventDefault();if(!form.reportValidity())return;
 const d={};for(const k of fields)d[k]=form.elements.namedItem(k).value.trim();d.id=d.id.toLowerCase();
 if(!/^[a-z0-9-]+$/.test(d.id)){feedback('ID inválido.');return}
 d.description={es:form.elements.namedItem('descriptionEs').value.trim(),en:form.elements.namedItem('descriptionEn').value.trim()};
 d.services=form.elements.namedItem('services').value.split('\n').map(x=>x.trim()).filter(Boolean).map(x=>{const [es='',en='',icon='🚐']=x.split('|').map(v=>v.trim());return {es,en:en||es,icon:icon||'🚐'}});
 if(originalSlug&&originalSlug!==d.id){feedback('Para conservar el QR, no cambies el ID de un perfil publicado.');return}
 const row=toRow(d);feedback('Guardando...');
 const result=originalSlug?await client.from('choferes').update(row).eq('slug',originalSlug).select('slug'):await client.from('choferes').insert(row).select('slug');
 if(result.error){feedback('No se pudo guardar: '+result.error.message);return}
 if(!result.data?.length){feedback('No se guardó ningún perfil. Comprueba permisos.');return}
 selected=d.id;originalSlug=d.id;await refresh();feedback('Perfil publicado. Abre la web principal para verlo.');
};
$('delete').onclick=async()=>{
 if(!originalSlug){records=records.filter(d=>d.id!==selected);selected=records[0]?.id??null;render();return}
 if(!confirm('¿Eliminar este perfil publicado? Su QR dejará de funcionar.'))return;
 const {error}=await client.from('choferes').delete().eq('slug',originalSlug);
 if(error){feedback(error.message);return}
 selected=null;originalSlug=null;await refresh();feedback('Perfil eliminado.');
};
