'use strict';
const { validate } = require('../lib/menu-validation.js');
const COOKIE='__Host-agra-session';
const ROOT='https://api.github.com/repos/Anuki3008/AGRA-USHGULI';
const BRANCH='main';
function reply(res,status,message){return res.status(status).json({error:message});}
function setCookie(res,token,age=0){res.setHeader('Set-Cookie',`${COOKIE}=${encodeURIComponent(token)}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${age}`);}
function cookie(req){const value=(req.headers.cookie||'').split(';').map(s=>s.trim()).find(s=>s.startsWith(COOKIE+'='));try{return value?decodeURIComponent(value.slice(COOKIE.length+1)):'';}catch{return '';}}
function allowed(email){return (process.env.ADMIN_EMAILS||'').split(',').map(x=>x.trim().toLowerCase()).filter(Boolean).includes(String(email||'').toLowerCase());}
function config(){const url=process.env.SUPABASE_URL||'';if(!/^https:\/\/[a-z0-9-]+\.supabase\.co\/?$/.test(url)||!process.env.SUPABASE_ANON_KEY||!process.env.GITHUB_TOKEN||!process.env.ADMIN_EMAILS)throw Error('CONFIG');return url.replace(/\/$/,'');}
async function auth(base,path,token,body){return fetch(base+'/auth/v1/'+path,{method:body?'POST':'GET',headers:{apikey:process.env.SUPABASE_ANON_KEY,...(token?{Authorization:'Bearer '+token}:{}),...(body?{'Content-Type':'application/json'}:{})},body:body?JSON.stringify(body):undefined,signal:AbortSignal.timeout(15000)});}
function parseBase64(value,max){if(typeof value!=='string'||value.length>Math.ceil(max*4/3)+4||! /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(value))throw Error('CONTENT');const bytes=Buffer.from(value,'base64');if(bytes.length>max)throw Error('CONTENT');return bytes;}
module.exports=async function handler(req,res){
  res.setHeader('Cache-Control','no-store');res.setHeader('X-Content-Type-Options','nosniff');
  if(req.method!=='POST')return reply(res,405,'მეთოდი დაუშვებელია.');
  // Browser writes must originate on the same deployment; no cross-origin API access.
  let origin;try{origin=new URL(req.headers.origin);}catch{return reply(res,403,'მოთხოვნის წყარო დაუშვებელია.');}
  if(origin.protocol!=='https:'||origin.host!==req.headers.host)return reply(res,403,'მოთხოვნის წყარო დაუშვებელია.');
  try{
    const base=config();
    let input=req.body;
    if(typeof input==='string'){if(Buffer.byteLength(input)>3000000)return reply(res,413,'ფაილი ძალიან დიდია.');try{input=JSON.parse(input);}catch{return reply(res,400,'მონაცემები არასწორია.');}}
    if(!input||typeof input!=='object'||Array.isArray(input))return reply(res,400,'მონაცემები არასწორია.');
    if(input.action==='login'){
      if(typeof input.email!=='string'||typeof input.password!=='string'||input.email.length>254||input.password.length>1024)return reply(res,400,'შეიყვანეთ ელფოსტა და პაროლი.');
      const upstream=await auth(base,'token?grant_type=password',null,{email:input.email.trim(),password:input.password});
      if(upstream.status===429)return reply(res,429,'ძალიან ბევრი მცდელობაა. ცოტა ხანში სცადეთ.');
      if(!upstream.ok)return reply(res,401,'ელფოსტა ან პაროლი არასწორია, ან შესვლა არ არის დაშვებული.');
      const session=await upstream.json();
      if(!session.user?.email_confirmed_at||!allowed(session.user.email)||!session.access_token)return reply(res,403,'ამ ანგარიშს ადმინპანელზე წვდომა არ აქვს.');
      const age=Math.max(1,Math.min(Number(session.expires_in)||3600,3600));
      setCookie(res,session.access_token,age);
      return res.status(200).json({ok:true});
    }
    if(input.action==='logout'){setCookie(res,'',0);return res.status(200).json({ok:true});}
    const token=cookie(req);if(!token)return reply(res,401,'შესვლის სესია დასრულდა. ხელახლა შედით — მონახაზი შენარჩუნებულია.');
    const checked=await auth(base,'user',token);if(!checked.ok)return reply(res,401,'შესვლის სესია დასრულდა. ხელახლა შედით — მონახაზი შენარჩუნებულია.');
    const user=await checked.json();if(!user.email_confirmed_at||!allowed(user.email))return reply(res,403,'ამ ანგარიშს მართვის უფლება არ აქვს.');
    if(input.action!=='github')return reply(res,400,'უცნობი მოქმედება.');
    const method=input.method||'GET';if(!['GET','PUT'].includes(method))return reply(res,405,'მოქმედება დაუშვებელია.');
    const path=input.path;
    if(path===''&&method==='GET')return res.status(200).json({permissions:{push:true}});
    if(typeof path!=='string'||!/^\/contents\/(menu-data\.json|photos\/[a-zA-Z0-9_-]+\.jpg)(\?ref=main)?$/.test(path))return reply(res,403,'ამ ფაილის შეცვლა დაუშვებელია.');
    const cleanPath=path.split('?')[0];let body;
    if(method==='PUT'){
      const supplied=input.body||{};
      if(cleanPath==='/contents/menu-data.json'){
        if(typeof supplied.sha!=='string'||!/^[a-f0-9]{40}$/.test(supplied.sha))return reply(res,400,'ფაილის ვერსია არასწორია.');
        let menu;try{menu=JSON.parse(parseBase64(supplied.content,700000).toString('utf8'));validate(menu);}catch{return reply(res,400,'მენიუს მონაცემები არასწორია.');}
        body={message:'Update menu from email admin',branch:BRANCH,sha:supplied.sha,content:Buffer.from(JSON.stringify(menu,null,2)+'\n').toString('base64')};
      }else{
        let image;try{image=parseBase64(supplied.content,2000000);}catch{return reply(res,413,'ფოტო ძალიან დიდია ან არასწორია.');}
        if(image.length<4||image[0]!==255||image[1]!==216||image[2]!==255)return reply(res,400,'მხოლოდ JPEG ფოტო მიიღება.');
        body={message:'Add photo from email admin',branch:BRANCH,content:supplied.content};
      }
    }
    const upstream=await fetch(ROOT+cleanPath+(method==='GET'?'?ref='+BRANCH:''),{method,headers:{Accept:'application/vnd.github+json',Authorization:'Bearer '+process.env.GITHUB_TOKEN,'X-GitHub-Api-Version':'2022-11-28',...(body?{'Content-Type':'application/json'}:{})},body:body?JSON.stringify(body):undefined,signal:AbortSignal.timeout(25000)});
    if(!upstream.ok){const messages={401:'საიტის GitHub გასაღებს ვადა გაუვიდა. მიმართეთ მფლობელს.',403:'GitHub-ში შენახვის უფლება არ არის ან მოთხოვნების ლიმიტი ამოიწურა.',404:'მენიუს ფაილი ვერ მოიძებნა.',409:'მენიუ სხვამ შეცვალა. თქვენი მონახაზი შენარჩუნებულია.',422:'GitHub-მა ცვლილება ვერ მიიღო. მიმართეთ მფლობელს.'};return reply(res,upstream.status===401?502:upstream.status,messages[upstream.status]||'შენახვა ვერ შესრულდა.');}
    const result=await upstream.json();
    // Return only the fields used by the editor, never upstream headers or credentials.
    return res.status(200).json(method==='GET'?{sha:result.sha,content:result.content,encoding:result.encoding}:{content:{sha:result.content?.sha}});
  }catch(error){return reply(res,error.message==='CONFIG'?503:502,error.message==='CONFIG'?'ელფოსტით შესვლა ჯერ არ არის გამართული. მიმართეთ საიტის მფლობელს.':'სერვერთან კავშირი ვერ შესრულდა. სცადეთ ხელახლა.');}
};
