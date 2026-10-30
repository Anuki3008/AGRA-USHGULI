(() => {
  const icons=['','salad','egg','plate','cake','glass','wine','cup','bottle','beer','tumbler'];
  function photoPath(value) {
    return typeof value==='string' && (value==='' || /^\.\/(?:photos\/)?[a-zA-Z0-9_-]+\.(?:jpg|jpeg|png|webp)$/i.test(value));
  }
  function validate(data) {
    if(data?.version!==1 || !Array.isArray(data.categories) || data.categories.length!==6 || !data.categories.every(c=>Array.isArray(c)&&c.length===2&&c.every(s=>typeof s==='string'&&s.trim()))) throw Error('კატეგორიების მონაცემები არასწორია.');
    if(!Array.isArray(data.items)||data.items.length>500)throw Error('მენიუს მონაცემები არასწორია.');
    const ids=new Set();
    for(const x of data.items){
      if(!x || typeof x.id!=='string'||!/^[-a-zA-Z0-9]+$/.test(x.id)||ids.has(x.id))throw Error('კერძის ID არასწორია ან მეორდება.');
      ids.add(x.id);
      for(const key of ['nameKa','nameEn','price','descriptionKa','descriptionEn'])if(typeof x[key]!=='string'||x[key].length>3000)throw Error('ტექსტური ველები არასწორია.');
      if(!x.nameKa.trim()||!x.nameEn.trim()||!/^\d+(?:\.\d{1,2})?(?:\s*\/\s*\d+(?:\.\d{1,2})?)*$/.test(x.price.trim()))throw Error('შეავსეთ ორივე სახელი და ფასი (მაგ. 20 ან 8 / 40).');
      if(!Number.isInteger(x.category)||x.category<0||x.category>=6||typeof x.vegetarian!=='boolean'||!photoPath(x.photo)||!icons.includes(x.icon))throw Error('კატეგორია, ფოტო ან აიქონი არასწორია.');
    }
    return data;
  }
  globalThis.AgraData={validate,photoPath,icons};
})();
