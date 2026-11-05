(() => {
  'use strict';
  const OWNER='Anuki3008', REPO='AGRA-USHGULI', BRANCH='main';

  const $=id=>document.getElementById(id);
  const fields=['nameKa','nameEn','price','descriptionKa','descriptionEn','category','vegetarian','icon'];
  let data=null, sha='', selected='', dirty=false, busy=false;
  const pending=new Map();
  function status(message,error=false){$('status').textContent=message;$('status').classList.toggle('error',error);}
  function markDirty(){dirty=true;$('state').textContent='არის გამოუქვეყნებელი ცვლილებები';}
  function lock(value){busy=value;document.querySelectorAll('button,input,select,textarea,fieldset').forEach(el=>el.disabled=value);if(!value&&data&&!data.items.length)$('fields').disabled=true;}
  function encode(text){let s='';for(const b of new TextEncoder().encode(text))s+=String.fromCharCode(b);return btoa(s);}
  function decode(content){return new TextDecoder().decode(Uint8Array.from(atob(content.replace(/\s/g,'')),c=>c.charCodeAt(0)));}
  async function request(payload) {
    const response = await fetch('./api/admin', {
      method: 'POST', credentials: 'same-origin', cache: 'no-store',
      headers: {'Content-Type': 'application/json'}, body: JSON.stringify(payload),
      signal: AbortSignal.timeout(60000)
    });
    let result;
    try { result = await response.json(); } catch { throw Error('სერვერი ჯერ არ არის გამართული. მიმართეთ მფლობელს.'); }
    if (!response.ok) {
      if (response.status === 401 && data) $('reauth').hidden = false;
      throw Error(result.error || 'მოთხოვნა ვერ შესრულდა.');
    }
    return result;
  }
  function api(path, method='GET', body) { return request({action:'github',path,method,body}); }
  $('reauth').addEventListener('click', () => {
    $('login').hidden=false; $('workspace').hidden=true; $('reauth').hidden=true;
    $('email').focus(); status('შედით ხელახლა. თქვენი მონახაზი შენარჩუნებულია.');
  });
  let recoveryToken='';
  const recoveryParams=new URLSearchParams(window.location.hash.slice(1));
  if(recoveryParams.has('access_token')||recoveryParams.has('error')){
    if(recoveryParams.get('type')==='recovery')recoveryToken=recoveryParams.get('access_token')||'';
    const failed=recoveryParams.has('error');
    window.history.replaceState(null,'',window.location.pathname+window.location.search);
    if(recoveryToken){$('login').hidden=true;$('recovery').hidden=false;}
    else if(failed)status('აღდგენის ბმული არასწორია ან ვადა გაუვიდა. მოითხოვეთ ახალი წერილი.',true);
  }
  for(const key of [...recoveryParams.keys()])recoveryParams.delete(key);
  $('recovery-form').addEventListener('submit',async event=>{
    event.preventDefault();let password=$('new-password').value;
    if(password!==$('confirm-password').value){status('პაროლები არ ემთხვევა.',true);return;}
    lock(true);status('პაროლი იცვლება…');
    try{
      await request({action:'reset-password',token:recoveryToken,password});
      recoveryToken='';$('recovery-form').reset();$('recovery').hidden=true;$('login').hidden=false;
      status('პაროლი შეიცვალა. ახლა შედით ელფოსტითა და ახალი პაროლით.');
    }catch(error){status(error.message,true);}finally{password='';$('new-password').value='';$('confirm-password').value='';lock(false);}
  });
  const item=()=>data?.items.find(x=>x.id===selected);
  function list(){
    $('list').replaceChildren();const query=$('filter').value.trim().toLocaleLowerCase();
    for(const x of data.items){if(!`${x.nameKa} ${x.nameEn}`.toLocaleLowerCase().includes(query))continue;
      const b=document.createElement('button');b.type='button';b.textContent=x.nameKa||'ახალი კერძი';b.setAttribute('aria-current',String(x.id===selected));b.addEventListener('click',()=>{selected=x.id;show();list();});$('list').append(b);
    }
  }
  function preview(){
    const x=item();const img=$('preview');img.hidden=true;img.removeAttribute('src');
    if(!x?.photo)return;
    img.src=pending.has(x.photo)?pending.get(x.photo).preview:`https://raw.githubusercontent.com/${OWNER}/${REPO}/${BRANCH}/${x.photo.slice(2)}`;
    img.hidden=false;
  }
  $('preview').addEventListener('error',()=>{$('preview').hidden=true;status('ფოტოს წინასწარი ნახვა ვერ ჩაიტვირთა.',true);});
  function show(){const x=item();$('fields').disabled=!x;if(!x)return;for(const key of fields){if(key==='vegetarian')$(key).checked=x[key];else $(key).value=x[key];}preview();$('upload').value='';}
  function dropPending(path){if(pending.has(path)){URL.revokeObjectURL(pending.get(path).preview);pending.delete(path);}}
  $('login-form').addEventListener('submit',async event=>{
    event.preventDefault();const email=$('email').value.trim();let password=$('password').value;$('password').value='';lock(true);status('მიმდინარეობს შესვლა…');
    try{
      await request({action:'login',email,password});password='';
      if(data){$('login').hidden=true;$('workspace').hidden=false;$('reauth').hidden=true;status('ხელახლა შესული ხართ. მონახაზი შენარჩუნებულია.');return;}
      const repo=await api('');
      if(repo.permissions?.push===false)throw Error('ამ ანგარიშს რეპოზიტორიაში ჩაწერის უფლება არ აქვს.');
      const file=await api(`/contents/menu-data.json?ref=${encodeURIComponent(BRANCH)}`);
      data=AgraData.validate(JSON.parse(decode(file.content)));sha=file.sha;selected=data.items[0]?.id||'';
      $('category').replaceChildren();data.categories.forEach((c,i)=>$('category').add(new Option(c[0],i)));
      const labels=['ავტომატური','ხემსი','საუზმე','ძირითადი კერძი','დესერტი','ჭიქა','ღვინო','ფინჯანი','ბოთლი','ლუდი','სპირტიანი სასმელი'];
      $('icon').replaceChildren();AgraData.icons.forEach((name,i)=>$('icon').add(new Option(labels[i],name)));
      $('login').hidden=true;$('workspace').hidden=false;$('logout').hidden=false;dirty=false;list();show();status('მენიუ ჩაიტვირთა. ცვლილებები საიტზე მხოლოდ გამოქვეყნების შემდეგ გამოჩნდება.');
    }catch(error){status(error.message,true);}finally{password='';lock(false);}
  });
  $('editor').addEventListener('submit',event=>event.preventDefault());
  fields.forEach(key=>$(key).addEventListener('input',()=>{const x=item();if(!x)return;x[key]=key==='vegetarian'?$(key).checked:key==='category'?Number($(key).value):$(key).value;markDirty();if(key==='nameKa')list();}));
  $('filter').addEventListener('input',list);
  $('add').addEventListener('click',()=>{const x={id:'dish-'+crypto.randomUUID(),category:0,nameKa:'ახალი კერძი',nameEn:'New dish',price:'0',descriptionKa:'',descriptionEn:'',vegetarian:false,photo:'',icon:''};data.items.push(x);selected=x.id;markDirty();list();show();});
  $('delete').addEventListener('click',()=>{const x=item();if(!x||!confirm(`წაიშალოს „${x.nameKa}“ მენიუდან?`))return;dropPending(x.photo);data.items=data.items.filter(d=>d.id!==x.id);selected=data.items[0]?.id||'';markDirty();list();show();});
  $('remove-photo').addEventListener('click',()=>{const x=item();if(!x)return;dropPending(x.photo);x.photo='';markDirty();preview();});
  async function prepareImage(file){
    if(!['image/jpeg','image/png','image/webp'].includes(file.type)||file.size>8*1024*1024)throw Error('აირჩიეთ JPG, PNG ან WebP ფოტო, მაქსიმუმ 8 MB.');
    const bitmap=await createImageBitmap(file);
    try{
      if(bitmap.width*bitmap.height>40000000)throw Error('ფოტოს ზომა ძალიან დიდია. აირჩიეთ შემცირებული ვერსია.');
      const scale=Math.min(1,1600/Math.max(bitmap.width,bitmap.height));
      const canvas=document.createElement('canvas');canvas.width=Math.max(1,Math.round(bitmap.width*scale));canvas.height=Math.max(1,Math.round(bitmap.height*scale));
      const ctx=canvas.getContext('2d');ctx.fillStyle='#ffffff';ctx.fillRect(0,0,canvas.width,canvas.height);ctx.drawImage(bitmap,0,0,canvas.width,canvas.height);
      const blob=await new Promise(resolve=>canvas.toBlob(resolve,'image/jpeg',0.85));if(!blob)throw Error('ფოტოს დამუშავება ვერ მოხერხდა.');if(blob.size>2000000)throw Error('აირჩიეთ უფრო მცირე ფოტო.');return blob;
    }finally{bitmap.close();}
  }
  $('upload').addEventListener('change',async()=>{
    const x=item(),file=$('upload').files[0];if(!x||!file)return;lock(true);status('ფოტო მუშავდება…');
    try{const blob=await prepareImage(file);dropPending(x.photo);const path=`./photos/${crypto.randomUUID()}.jpg`;pending.set(path,{blob,preview:URL.createObjectURL(blob)});x.photo=path;markDirty();preview();status('ფოტო მზადაა. ატვირთვისთვის დააჭირეთ „ცვლილებების გამოქვეყნებას“.');}
    catch(error){status(error.message,true);}finally{$('upload').value='';lock(false);}
  });
  $('download').addEventListener('click',()=>{
    const url=URL.createObjectURL(new Blob([JSON.stringify(data,null,2)+'\n'],{type:'application/json'}));const a=document.createElement('a');a.href=url;a.download='menu-data-draft.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
    status(pending.size?'მენიუს ასლი ჩამოიტვირთა. არჩეული, ჯერ აუტვირთავი ფოტოები მასში არ შედის — ისინი შეინახეთ ცალკე.':'მენიუს ასლი ჩამოიტვირთა.');
  });
  $('publish').addEventListener('click',async()=>{
    if(!dirty){status('გამოსაქვეყნებელი ცვლილებები არ არის.');return;}
    try{AgraData.validate(data);}catch(error){status(error.message,true);return;}
    if(!confirm('გამოქვეყნდეს ყველა ცვლილება AGRA-USHGULI საიტზე?'))return;
    lock(true);status('მიმდინარეობს შენახვა…');
    try{
      const current=await api(`/contents/menu-data.json?ref=${encodeURIComponent(BRANCH)}`);
      if(current.sha!==sha)throw Error('მენიუ სხვამ შეცვალა. თქვენი მონახაზი შენარჩუნებულია. ჩამოტვირთეთ ასლი, ხელახლა შედით და შეადარეთ ცვლილებები.');
      for(const [path,photo] of pending){
        // A retry reuses a successfully uploaded photo instead of creating a duplicate.
        if(photo.uploaded)continue;
        const content=await new Promise((resolve,reject)=>{const reader=new FileReader();reader.onload=()=>resolve(reader.result.split(',')[1]);reader.onerror=()=>reject(Error('ფოტოს წაკითხვა ვერ მოხერხდა.'));reader.readAsDataURL(photo.blob);});
        try{await api('/contents/'+path.slice(2),'PUT',{message:'Add menu photo',branch:BRANCH,content});}
        catch(error){
          // If the write succeeded but its response was lost, confirm the same bytes.
          let existing;try{existing=await api('/contents/'+path.slice(2)+'?ref='+encodeURIComponent(BRANCH));}catch{throw error;}
          if(existing.content?.replace(/\s/g,'')!==content)throw error;
        }
        photo.uploaded=true;
      }
      const content=encode(JSON.stringify(data,null,2)+'\n');let result;
      try{result=await api('/contents/menu-data.json','PUT',{message:'Update restaurant menu from admin',branch:BRANCH,sha,content});}
      catch(error){let check;try{check=await api('/contents/menu-data.json?ref='+encodeURIComponent(BRANCH));}catch{throw error;}if(check.content?.replace(/\s/g,'')!==content)throw error;result={content:{sha:check.sha}};}
      sha=result.content.sha;dirty=false;$('state').textContent='ცვლილებები შენახულია GitHub-ში';
      for(const path of [...pending.keys()])dropPending(path);preview();
      status('შენახულია. საიტზე ცვლილება Vercel-ის განახლების დასრულების შემდეგ გამოჩნდება.');
    }catch(error){status(error.message+'\nმონახაზი არ დაკარგულა. არ დახუროთ პანელი.',true);}finally{lock(false);}
  });
  $('logout').addEventListener('click',async()=>{if(dirty&&!confirm('არის გამოუქვეყნებელი ცვლილებები. მაინც გახვიდეთ?'))return;lock(true);try{await request({action:'logout'});}catch(error){status(error.message,true);lock(false);return;}lock(false);data=null;sha='';dirty=false;for(const path of [...pending.keys()])dropPending(path);$('editor').reset();$('list').replaceChildren();$('preview').removeAttribute('src');$('workspace').hidden=true;$('logout').hidden=true;$('login').hidden=false;$('reauth').hidden=true;status('გამოსული ხართ.');});
  window.addEventListener('beforeunload',event=>{if(dirty||busy){event.preventDefault();event.returnValue='';}});
})();
