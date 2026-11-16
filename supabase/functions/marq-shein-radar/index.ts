import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const URL = Deno.env.get("SUPABASE_URL")!;
const ANON = Deno.env.get("SUPABASE_ANON_KEY")!;
const SERVICE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const ADMIN_ID = "89fdb1b1-c59d-4928-8b7d-8e604046d456";
const db = createClient(URL, SERVICE, { auth: { persistSession: false } });
const headers = { "Content-Type":"application/json", "Access-Control-Allow-Origin":"https://marqofertas.github.io", "Access-Control-Allow-Headers":"authorization, x-client-info, apikey, content-type", "Access-Control-Allow-Methods":"POST, OPTIONS" };
const json = (data: unknown, status=200) => new Response(JSON.stringify(data), {status,headers});
const sources = [
 "https://br.shein.com/trends/best-sellers-sc-006118818.html",
 "https://br.shein.com/shein-picks.html",
 "https://br.shein.com/pdsearch/produtos/"
];
const clean = (s:string) => s.replace(/<script\b[\s\S]*?<\/script>/gi," ").replace(/<style\b[\s\S]*?<\/style>/gi," ").replace(/<[^>]*>/g," ").replace(/&amp;/g,"&").replace(/&quot;/g,'"').replace(/&#39;|&apos;/g,"'").replace(/&lt;/g,"<").replace(/&gt;/g,">").replace(/&#(\d+);/g,(_,n)=>String.fromCharCode(Number(n))).replace(/\s+/g," ").trim();
function decodeEntities(s:string) {
 return s.replace(/&amp;/g,"&").replace(/&quot;/g,'"').replace(/&#39;|&apos;/g,"'").replace(/&lt;/g,"<").replace(/&gt;/g,">").replace(/&#(\d+);/g,(_,n)=>String.fromCharCode(Number(n)));
}
function extract(html:string, source:string) {
 const out = new Map<string, any>();
 const re = /<a\b[^>]*href\s*=\s*(["'])(.*?)\1[^>]*>([\s\S]*?)<\/a>/gi;
 let m:RegExpExecArray|null;
 while ((m=re.exec(html)) && out.size<180) {
  const rawHref=decodeEntities(m[2]||""); const idMatch=rawHref.match(/-p-(\d+)\.html(?:[?#]|$)/i); if(!idMatch) continue;
  const id=idMatch[1]; let href=rawHref; if(href.startsWith("//")) href="https:"+href; if(href.startsWith("/")) href="https://br.shein.com"+href;
  try { const u=new URL(href); if(!["br.shein.com","www.shein.com"].includes(u.hostname.toLowerCase())) continue; href=u.toString(); } catch { continue; }
  const anchorTitle=clean(m[3]||""); const chunk=html.slice(Math.max(0,m.index-2600),Math.min(html.length,re.lastIndex+5200));
  const attrTitle=chunk.match(/(?:data-(?:goods-name|title)|aria-label|title)\s*=\s*["']([^"']{8,260})["']/i);
  const title=clean(attrTitle?.[1]||anchorTitle||"Produto SHEIN "+id).slice(0,220);
  const imageCandidates=[...chunk.matchAll(/(?:src|data-src|data-original|data-lazy-src)\s*=\s*["'](https?:\/\/[^"'\s<>]+)["']/gi)].map(x=>decodeEntities(x[1]));
  let image:string|null=null; for(const candidate of imageCandidates){try{const iu=new URL(candidate);if(iu.protocol==="https:"&&(iu.hostname.endsWith("ltwebstatic.com")||iu.hostname.endsWith("shein.com"))){image=iu.toString();break;}}catch{}}
  const priceMatch=chunk.match(/R\$\s*([0-9][0-9.,]*)/i); let price:number|null=null;
  if(priceMatch){const raw=priceMatch[1].replace(/\s/g,"");const normalized=raw.includes(",")?raw.replace(/\./g,"").replace(",","."):raw;const n=Number(normalized);if(Number.isFinite(n)&&n>0&&n<100000)price=n;}
  const salesMatch=chunk.match(/([0-9][0-9.,]*\s*[kK]?\+?)\s*(?:vendidos?|vendido)/i);
  if(!out.has(id)) out.set(id,{shein_product_id:id,title,product_url:href,image_url:image,price,sales_text:salesMatch?.[1]?.trim()||null,source_url:source});
 } return [...out.values()];
}
Deno.serve(async(req:Request)=>{
 if(req.method==="OPTIONS") return new Response("ok",{headers});
 if(req.method!=="POST") return json({error:"Método não permitido"},405);
 try {
  const auth=req.headers.get("Authorization")||"";
  if(!auth.startsWith("Bearer ")) return json({error:"Sessão ausente"},401);
  const client=createClient(URL,ANON,{global:{headers:{Authorization:auth}},auth:{persistSession:false}});
  const {data:{user}}=await client.auth.getUser();
  if(!user || user.id!==ADMIN_ID) return json({error:"Acesso não autorizado"},403);
  const body=await req.json(); const action=String(body.action||"list");
  if(action==="scan"){
   const found:any[]=[]; const errors:string[]=[]; const diagnostics:any[]=[];
   for(const source of sources){
    try{
     const res=await fetch(source,{headers:{"User-Agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/131.0.0.0 Safari/537.36","Accept":"text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8","Accept-Language":"pt-BR,pt;q=0.9,en-US;q=0.8"},signal:AbortSignal.timeout(20000),redirect:"follow"});
     if(!res.ok) throw new Error("HTTP "+res.status);
     const html=(await res.text()).slice(0,8_000_000);
     const items=extract(html,source); found.push(...items);
     if(!items.length) errors.push(source+": a SHEIN não entregou links de produtos para leitura automática (possível proteção anti-robô).");
     diagnostics.push({source,status:res.status,html_bytes:html.length,products:items.length,content_type:res.headers.get("content-type")});
    }catch(e){errors.push(source+": "+(e instanceof Error?e.message:"falha"));diagnostics.push({source,error:e instanceof Error?e.message:"falha"});}
   }
   const unique=[...new Map(found.map(x=>[x.shein_product_id,x])).values()];
   if(unique.length){
    const ids=unique.map(x=>x.shein_product_id);
    const {data:existing,error:existingError}=await db.from("marq_shein_candidates").select("shein_product_id,status").in("shein_product_id",ids);
    if(existingError) throw existingError;
    const statusById=new Map((existing||[]).map(x=>[x.shein_product_id,x.status]));
    const fresh=unique.filter(x=>!statusById.has(x.shein_product_id));
    const refresh=unique.filter(x=>statusById.get(x.shein_product_id)==="found");
    if(fresh.length){const {error}=await db.from("marq_shein_candidates").insert(fresh.map(x=>({...x,status:"found"})));if(error) throw error;}
    for(const item of refresh){const {shein_product_id,...fields}=item;const {error}=await db.from("marq_shein_candidates").update({...fields,status:"found",updated_at:new Date().toISOString()}).eq("shein_product_id",shein_product_id);if(error) throw error;}
   }
   return json({ok:true,scanned_sources:sources.length,found:unique.length,errors,diagnostics,items:unique});
  }
  if(action==="list"){
   const {data,error}=await db.from("marq_shein_candidates").select("*").order("discovered_at",{ascending:false}).limit(100);
   if(error) throw error; return json({ok:true,items:data||[]});
  }
  if(action==="save_link"){
   const id=String(body.shein_product_id||""); const raw=String(body.affiliate_url||""); let u:URL;
   try{u=new URL(raw)}catch{return json({error:"Link inválido"},400)}
   if(u.protocol!=="https:" || !["onelink.shein.com","shein.onelink.me"].includes(u.hostname)) return json({error:"Use o link oficial individual gerado no Centro de Afiliados SHEIN"},400);
   const {data,error}=await db.from("marq_shein_candidates").update({affiliate_url:u.toString(),status:"ready",updated_at:new Date().toISOString()}).eq("shein_product_id",id).select().single();
   if(error) throw error; return json({ok:true,item:data});
  }
  if(action==="publish"){
   const id=String(body.shein_product_id||"");
   const {data:c,error:ce}=await db.from("marq_shein_candidates").select("*").eq("shein_product_id",id).single();
   if(ce) throw ce;
   if(!c.affiliate_url) return json({error:"Cadastre primeiro o link oficial de afiliado deste produto."},400);
   if(!c.price || c.price<=0) return json({error:"Preço não identificado. Atualize o preço antes de publicar."},400);
   const {data:p,error:pe}=await db.from("produtos").insert({nome:c.title,preco:c.price,categoria:"SHEIN",link_afiliado:c.affiliate_url,Imagem:c.image_url,image_url:c.image_url,ativo:true}).select("id").single();
   if(pe) throw pe;
   const {error:ue}=await db.from("marq_shein_candidates").update({status:"published",product_id:p.id,published_at:new Date().toISOString(),updated_at:new Date().toISOString()}).eq("shein_product_id",id);
   if(ue) throw ue;
   return json({ok:true,product_id:p.id});
  }
  return json({error:"Ação desconhecida"},400);
 }catch(e){console.error("marq-shein-radar",e);return json({error:e instanceof Error?e.message:"Falha interna"},500)}
});