(async () => {
  const response = await fetch("./menu-data.json", { cache: "no-cache" });
  if (!response.ok) throw new Error("Menu unavailable");
  const data = await response.json();
  window.AgraData.validate(data);
  const categories = data.categories;
  const rows = data.items.map(x => [x.category,x.nameKa,x.nameEn,x.price,x.id]);
  const descriptions = Object.fromEntries(data.items.map(x => [x.id,[x.descriptionKa,x.descriptionEn]]));
  const categoryIcons = ['salad', 'egg', 'plate', 'cake', 'glass', 'wine'];
  const drinkIcons = {
    Coffee: 'cup', 'Forest tea': 'cup', 'Fresh juice': 'glass',
    'Matsoni smoothie': 'glass', Compot: 'glass', 'Coca-Cola': 'glass',
    Juice: 'glass', Borjomi: 'bottle', Lemonade: 'glass', Beer: 'beer',
    Chacha: 'tumbler', 'Homemade brandy': 'tumbler', Whiskey: 'tumbler',
    Rum: 'tumbler', Tequila: 'tumbler', 'Jägermeister': 'tumbler', Baileys: 'tumbler'
  };
  const iconPaths = {
    leaf: ['M20 4C10 3 3 7 5 15c1 4 7 5 11 1 3-3 4-8 4-12Z', 'M4 21 15 10'],
    salad: ['M3 12h18c-1 6-4 9-9 9s-8-3-9-9Z', 'M7 12C2 6 8 2 11 7', 'M11 12c-2-7 5-11 7-6', 'M16 12c0-4 4-5 5-2'],
    egg: ['M19 14c0 5-3 7-7 7s-7-2-7-7S9 3 12 3s7 6 7 11Z', 'M9 16c0 2 1 3 3 3'],
    plate: ['M16 5a7 7 0 1 1-6 0', 'M2 3v6c0 2 4 2 4 0V3', 'M4 3v18', 'M21 3v18', 'M21 3c-3 2-3 7 0 8'],
    cake: ['M4 12h16v9H4Z', 'M4 16c2-3 4 3 6 0s4 3 6 0 3 0 4 0', 'M8 12V8h8v4', 'M12 8V5', 'M12 2v1'],
    glass: ['M5 5h14l-2 16H7Z', 'M6 10h12', 'M13 14 16 2h4'],
    wine: ['M8 3h8l1 6c1 7-11 7-10 0Z', 'M7 8h10', 'M12 14v7', 'M8 21h8'],
    cup: ['M4 8h13v8a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4Z', 'M17 9h2a3 3 0 0 1 0 6h-2', 'M7 3v2', 'M11 2v3', 'M15 3v2'],
    bottle: ['M10 2h4v5l3 4v10H7V11l3-4Z', 'M10 5h4', 'M7 13h10', 'M7 17h10'],
    beer: ['M5 8h12v13H5Z', 'M17 10h3v7h-3', 'M8 12v5', 'M13 12v5', 'M5 8C1 5 6 1 9 4c2-3 6-2 6 1 4-1 5 3 2 3'],
    tumbler: ['M5 4h14l-1 17H6Z', 'M6 13c4-2 8 2 12 0', 'M9 8h5v4H9Z']
  };
  // Confirm vegetarian recipes before setting vegetarian: true.
  // Example after confirmation:
  // 'Georgian salad': { vegetarian: true, photo: './photos/salad.jpg' }
  const details = Object.fromEntries(data.items.map(x => [x.id,x]));
  function icon(name) {
    const ns = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(ns, 'svg');
    svg.setAttribute('class', 'menu-icon');
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.setAttribute('width', '20');
    svg.setAttribute('height', '20');
    svg.setAttribute('fill', 'none');
    svg.setAttribute('stroke', 'currentColor');
    svg.setAttribute('stroke-width', '1.6');
    svg.setAttribute('stroke-linecap', 'round');
    svg.setAttribute('stroke-linejoin', 'round');
    svg.setAttribute('aria-hidden', 'true');
    svg.setAttribute('focusable', 'false');
    for (const d of iconPaths[name] || iconPaths.plate) {
      const path = document.createElementNS(ns, 'path');
      path.setAttribute('d', d);
      svg.append(path);
    }
    return svg;
  }
  const $ = selector => document.querySelector(selector);
  let lang = 'ka';
  let active = 0;
  try { if (localStorage.getItem('agra-language') === 'en') lang = 'en'; } catch {}
  const tabs = $('#tabs');
  const search = $('#search');
  const items = $('#items');

  function renderItems() {
    const n = lang === 'ka' ? 0 : 1;
    const query = search.value.trim().toLocaleLowerCase();
    const selected = rows.filter(row => row[0] === active &&
      `${row[1]} ${row[2]}`.toLocaleLowerCase().includes(query));
    $('#category').textContent = categories[active][n];
    $('#count').textContent = String(selected.length).padStart(2, '0');
    items.replaceChildren();
    items.setAttribute('aria-labelledby', `category-${active}`);
    for (const row of selected) {
      const dish = document.createElement('div');
      dish.className = 'dish';
      const copy = document.createElement('div');
      const heading = document.createElement('h3');
      heading.append(icon(details[row[4]].icon || drinkIcons[row[2]] || categoryIcons[row[0]]),
        document.createTextNode(' ' + row[n + 1]));
      copy.append(heading);
      const detail = details[row[4]] || {};
      if (detail.vegetarian === true) {
        const badge = document.createElement('span');
        badge.className = 'vegetarian-badge';
        badge.append(icon('leaf'), document.createTextNode(n ? ' Vegetarian' : ' ვეგეტარიანული'));
        copy.append(badge);
      }
      if (typeof detail.photo === 'string' && detail.photo.trim()) {
        try {
          const url = new URL(detail.photo, document.baseURI);
          if (['http:', 'https:', 'file:'].includes(url.protocol)) {
            const photo = document.createElement('img');
            photo.className = 'dish-photo';
            photo.src = url.href;
            photo.alt = row[n + 1];
            photo.loading = 'lazy';
            photo.addEventListener('error', () => photo.remove(), { once: true });
            copy.append(photo);
          }
        } catch {}
      }
      if (descriptions[row[4]]?.[n]) {
        const description = document.createElement('p');
        description.textContent = descriptions[row[4]][n];
        copy.append(description);
      }
      const price = document.createElement('strong');
      price.textContent = row[3] + ' ';
      const currency = document.createElement('small');
      currency.textContent = '₾';
      price.append(currency);
      dish.append(copy, price);
      items.append(dish);
    }
    if (!selected.length) {
      const empty = document.createElement('p');
      empty.textContent = n ? 'No dishes found.' : 'კერძი ვერ მოიძებნა.';
      items.append(empty);
    }
  }

  function selectCategory(index, focus = false) {
    active = index;
    search.value = '';
    [...tabs.children].forEach((button, i) => {
      button.classList.toggle('selected', i === active);
      button.setAttribute('aria-selected', String(i === active));
      button.tabIndex = i === active ? 0 : -1;
    });
    renderItems();
    if (focus) tabs.children[active].focus();
  }

  function renderLanguage() {
    const n = lang === 'ka' ? 0 : 1;
    document.documentElement.lang = lang;
    document.querySelectorAll('[data-ka][data-en]').forEach(el => {
      el.textContent = el.dataset[lang];
    });
    document.querySelectorAll('[data-alt-ka][data-alt-en]').forEach(el => {
      el.alt = el.getAttribute('data-alt-' + lang);
    });
    tabs.replaceChildren();
    categories.forEach((category, index) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.id = `category-${index}`;
      button.setAttribute('role', 'tab');
      button.setAttribute('aria-controls', 'items');
      button.append(icon(categoryIcons[index]), document.createTextNode(' ' + category[n]));
      button.addEventListener('click', () => selectCategory(index));
      tabs.append(button);
    });
    tabs.setAttribute('aria-label', n ? 'Menu categories' : 'მენიუს კატეგორიები');
    search.placeholder = n ? 'Search this category' : 'მოძებნეთ კატეგორიაში';
    search.setAttribute('aria-label', search.placeholder);
    $('#original').setAttribute('href', `./menu-${lang}.jpeg`);
    $('#language').textContent = n ? 'ქარ' : 'ENG';
    $('#language').lang = n ? 'ka' : 'en';
    $('#language').setAttribute('aria-label', n ? 'ქართულზე გადართვა' : 'Switch to English');
    $('#back-to-top').setAttribute('aria-label', n ? 'Back to top' : 'ზემოთ დაბრუნება');
    document.title = n ? 'Agra Ushguli • აგრა უშგული' : 'აგრა უშგული • Agra Ushguli';
    const query = search.value;
    selectCategory(active);
    search.value = query;
    renderItems();
  }

  tabs.addEventListener('keydown', event => {
    if (!event.target.matches('[role="tab"]')) return;
    const actions = {
      ArrowRight: (active + 1) % categories.length,
      ArrowLeft: (active + categories.length - 1) % categories.length,
      Home: 0,
      End: categories.length - 1
    };
    if (event.key in actions) {
      event.preventDefault();
      selectCategory(actions[event.key], true);
    }
  });
  search.addEventListener('input', renderItems);
  $('#language').addEventListener('click', () => {
    lang = lang === 'ka' ? 'en' : 'ka';
    renderLanguage();
    try { localStorage.setItem('agra-language', lang); } catch {}
  });
  renderLanguage();
})().catch(() => {
  const items = document.getElementById('items');
  items.textContent = 'მენიუ ვერ ჩაიტვირთა. გახსენით ორიგინალი მენიუს ბმული. / Please open the original menu link.';
});
