(() => {
  "use strict";

  const categories = [
    ["ხემსი", "Appetizers"],
    ["საუზმე", "Breakfast"],
    ["ძირითადი მენიუ", "Main menu"],
    ["დესერტი", "Dessert"],
    ["სასმელი", "Drinks"],
    ["ღვინო", "Wine"]
  ];

  const rows = [
    [0, "პესტოს სენდვიჩი", "Pesto sandwich", "20"],
    [0, "ავოკადოს ტოსტი", "Avocado toast", "20"],
    [0, "კუბდარი ულდინი", "Mini kubdari", "20"],
    [0, "სალათი ქართულად", "Georgian salad", "21"],
    [0, "პომიდვრის სალათი", "Tomato salad", "21"],
    [0, "მსხლის სალათი", "Pear salad", "22"],
    [0, "ქათმის სალათი", "Chicken salad", "25"],
    [0, "ჭვიშდვარის ბურთები", "Chishdvari balls", "15"],
    [0, "ხემსის დაფა", "Appetizer board", "50"],

    [1, "კლასიკური", "Classic", "30"],
    [1, "კრეპის თეფში", "Crepe plate", "30"],
    [1, "ავოკადოს თეფში", "Avocado plate", "35"],
    [1, "გრანოლას თეფში", "Granola plate", "35"],

    [2, "თაშმჯაბი", "Tashmjabi", "25"],
    [2, "მერწვი", "Mertsvi", "18"],
    [2, "მერწვი ქათმით", "Mertsvi with chicken", "25"],
    [2, "აჯაფსანდალი", "Ragu", "18"],
    [2, "აჯაფსანდალი ხორცით", "Ragu with beef", "25"],
    [2, "ღორის უმგბერი", "Pork belly", "25"],
    [2, "მობრაწული კარტოფილი", "Fried potato", "10"],
    [2, "ჭვიშდვარი ფხალით", "Chishdvari with pkhali", "24"],
    [2, "მაწვნის წვნიანი ნარჩევით", "Matsoni soup with narchvi", "18"],
    [2, "დათვების ჩიხირთმა", "Bear chikhirtma", "23"],
    [2, "ხორცის წვნიანი", "Meat soup", "23"],
    [2, "ლობიო", "Lobio", "18"],
    [2, "კუბდარი", "Kubdari", "20"],
    [2, "ხაჭაპური", "Khachapuri", "19"],
    [2, "ფეტვიანი ხაჭაპური", "Millet khachapuri", "20"],
    [2, "ჭახრაკი ხაჭაპური", "Green khachapuri", "20"],
    [2, "ფლიჭვიანი ხაჭაპური", "Adjarian khachapuri", "20"],
    [2, "ლობიანი", "Lobiani", "18"],

    [3, "ფელამუში", "Pelamushi", "15"],
    [3, "ნიუ-იორკ ჩიზქეიქი", "New York cheesecake", "16"],
    [3, "ტირამისუ", "Tiramisu", "16"],
    [3, "ბრაუნი", "Brownie", "14"],
    [3, "ფენქეიქი", "Pancake", "15"],
    [3, "კრეპი", "Crepe", "13"],
    [3, "ნაყინი", "Ice cream", "12"],

    [4, "ყავა", "Coffee", "7 / 8 / 10"],
    [4, "ტყის ჩაი", "Forest tea", "7"],
    [4, "ცოცხალი წვენი", "Fresh juice", "12"],
    [4, "მაწვნის სმუზი", "Matsoni smoothie", "12"],
    [4, "კომპოტი", "Compot", "7 / 20"],
    [4, "კოკა-კოლა", "Coca-Cola", "5"],
    [4, "წვენი", "Juice", "6"],
    [4, "ბორჯომი", "Borjomi", "6"],
    [4, "ლიმონათი", "Lemonade", "6"],
    [4, "ლუდი", "Beer", "9"],
    [4, "ჭაჭა", "Chacha", "5 / 20"],
    [4, "სახლური ბრენდი", "Homemade brandy", "5 / 20"],
    [4, "ვისკი", "Whiskey", "14 / 20"],
    [4, "რომი", "Rum", "12"],
    [4, "ტეკილა", "Tequila", "12"],
    [4, "იეგერმაისტერი", "Jägermeister", "12"],
    [4, "ბეილისი", "Baileys", "12"],

    [5, "ციცქა", "Tsitska", "50"],
    [5, "ოცხანური საფერე", "Otskhanuri saphere", "50"],
    [5, "ცოლიკოური", "Tsolikouri", "50"],
    [5, "ოჯალეში", "Ojaleshi", "60"],
    [5, "პეტნატი ვაგოდა", "Petnat Vagoda", "70"],
    [5, "რქაწითელი-ქისი", "Rkatsiteli-Kisi", "50"],
    [5, "თემო საფერავი", "Temo Saperavi", "50"],
    [5, "ცხოვრება კარნავალია", "La vida es un carnaval", "50"],
    [5, "ანფენტი", "Anfent", "50"],
    [5, "ბოვი", "Bovi", "50"],
    [5, "რაჭული თეთრა ჭ/1ლ", "Rachuli tetra glass / 1L", "8 / 40"],
    [5, "ხაშმის საფერავი ჭ/1ლ", "Khashmi’s Saperavi glass / 1L", "8 / 40"]
  ];

  const descriptions = {
    "Pesto sandwich": [
      "ქათამი / ლორი და ყველი, პომიდორი, სალათის ფოთოლი.",
      "Chicken / ham & cheese, tomatoes, green salad."
    ],
    "Avocado toast": [
      "ავოკადო, კრემ-ყველი, პოშირებული კვერცხი.",
      "Avocado, cream cheese, poached egg."
    ],
    "Mini kubdari": [
      "თავღია მინი კუბდარი, პომიდვრის სალსა.",
      "Open-top mini kubdari, tomato salsa."
    ],
    "Georgian salad": [
      "კიტრი, პომიდორი, ხახვი, ნიგვზის საწებელი.",
      "Cucumber, tomatoes, onion, walnut sauce."
    ],
    "Tomato salad": [
      "პომიდორი, სულგუნის ბურთი, რეჰანი, ზეითუნის ზეთი, სვანური მარილი.",
      "Tomatoes, sulguni cheese ball, red basil, olive oil, Svan salt."
    ],
    "Pear salad": [
      "მწვანე სალათი, მსხალი, ლურჯი ყველი, ნიგოზი.",
      "Green salad, pear, blue cheese, walnuts."
    ],
    "Chicken salad": [
      "მწვანე სალათი, ქათმის სტეიკი, პომიდორი, პარმეზანი, სოუსი.",
      "Green salad, chicken steak, tomato, Parmesan cheese, sauce."
    ],
    "Chishdvari balls": [
      "ჭვიშდვარი, მაწონი და პიტნის სოუსი.",
      "Chishdvari, matsoni & mint sauce."
    ],
    "Appetizer board": [
      "ჩვენი ყველის ნაირსახეობა, მინი ტოსტები, თხილეული, თაფლი.",
      "Our cheese mix, mini toasts, nuts, honey."
    ],
    "Classic": [
      "ლორი, მოხარშული კვერცხი, მაწონი, სულგუნი, კარაქი, ჯემი, პური, ახალი ბოსტნეული და ხილი.",
      "Ham, boiled egg, matsoni, sulguni, butter, jam, bread, fresh vegetables & fruits."
    ],
    "Crepe plate": [
      "კრეპი, ლორი, ყველი, არაჟანი, ომლეტი, კიტრის სალათი.",
      "Crepe, ham, cheese, sour cream, omelette, cucumber salad."
    ],
    "Avocado plate": [
      "ავოკადოს ტოსტი, შემწვარი კვერცხი, პომიდვრის სალათი.",
      "Avocado toast, fried egg, tomato salad."
    ],
    "Granola plate": [
      "გრანოლა მაწვნით, ხილის სალათი, ფენქეიქი.",
      "Granola with matsoni, fruit salad, pancake."
    ],
    "Tashmjabi": [
      "გახეხილი სვანური ყველი — ნარჩევი, გამომცხვარი პომიდორი, პური.",
      "Grated Svan cheese — narchvi, roasted tomatoes, bread."
    ],
    "Mertsvi": [
      "კარტოფილის პიურე ყველით.",
      "Mashed potatoes with cheese."
    ],
    "Mertsvi with chicken": [
      "კარტოფილის პიურე ყველით, ქათამი ნიგვზის საწებლით.",
      "Mashed potatoes with cheese, chicken with walnut sauce."
    ],
    "Ragu": [
      "სეზონური ბოსტნეულის რაგუ პომიდვრის სოუსით.",
      "Seasonal vegetable ragu with tomato sauce."
    ],
    "Ragu with beef": [
      "სეზონური ბოსტნეულის რაგუ, მოხარშული საქონლის ხორცი.",
      "Seasonal vegetable ragu, boiled beef."
    ],
    "Pork belly": [
      "შემწვარი ღორის მუცელი, შემწვარი კარტოფილი, მწნილი, ტყემალი.",
      "Fried pork belly, fried potato, pickles, tkemali sauce."
    ],
    "Fried potato": [
      "კარტოფილი სვანური მარილით.",
      "Potato with Svan salt."
    ],
    "Chishdvari with pkhali": [
      "სიმინდის პური ყველით, სეზონური ფხალი ნიგვზით.",
      "Corn bread with cheese, seasonal pkhali with walnuts."
    ],
    "Matsoni soup with narchvi": [
      "მაწონი, კვერცხი, სვანური ყველი — ნარჩევი, პიტნა.",
      "Matsoni, egg, Svan cheese — narchvi, mint."
    ],
    "Bear chikhirtma": [
      "ქათმის ბულიონი, ღანძილის პასტა, კვერცხი.",
      "Broth with chicken, wild garlic paste, egg."
    ],
    "Meat soup": [
      "საქონლის ხორცის ბულიონი, ბრინჯი, პომიდვრის სოუსი.",
      "Broth with beef, rice, tomato sauce."
    ],
    "Lobio": [
      "ლობიო ტრადიციული ქართული რეცეპტით.",
      "Lobio — traditional Georgian bean recipe."
    ],
    "Kubdari": [
      "ხორცი, პური, სანელებლები.",
      "Meat, bread, spices."
    ],
    "Khachapuri": [
      "ყველი, პური.",
      "Cheese, bread."
    ],
    "Millet khachapuri": [
      "ფეტვი, ყველი, პური.",
      "Millet, cheese, bread."
    ],
    "Green khachapuri": [
      "სეზონური მწვანილი, ყველი, პური.",
      "Seasonal greenery, cheese, bread."
    ],
    "Adjarian khachapuri": [
      "ყველი, კვერცხი, კარაქი, პური.",
      "Cheese, egg, butter, bread."
    ],
    "Lobiani": [
      "ლობიო, პური.",
      "Beans, bread."
    ],
    "Pelamushi": [
      "ცხელი ფელამუში, ფქვილის ჟელე, ნიგოზი.",
      "Hot grape juice / wine & flour jelly, walnuts."
    ],
    "New York cheesecake": [
      "კენკრის სოუსით / კარამელით.",
      "With berry sauce / caramel."
    ],
    "Tiramisu": [
      "კლასიკური / ფსტის.",
      "Classic / pistachio."
    ],
    "Pancake": [
      "არაჟნით და კენკრის სოუსით.",
      "Sour cream & berry sauce."
    ],
    "Crepe": [
      "ბანანი და ნუტელა.",
      "Banana & Nutella."
    ],
    "Ice cream": [
      "ვანილი / კარამელი / კენკრა.",
      "Vanilla / caramel / berry."
    ],
    "Coffee": [
      "ესპრესო / ამერიკანო / თურქული / კაპუჩინო / ლატე.",
      "Espresso / Americano / Turkish / cappuccino / latte."
    ],
    "Fresh juice": [
      "ფორთოხალი, ვაშლი, სტაფილო, ჭარხალი, პომიდორი.",
      "Orange, apple, carrot, beetroot, tomatoes."
    ],
    "Matsoni smoothie": [
      "ბანანი, კენკრა, ისპანახი.",
      "Banana, berries, spinach."
    ],
    "Borjomi": [
      "გაზიანი მინერალური წყალი.",
      "Sparkling water."
    ],
    "Tsitska": [
      "თეთრი მშრალი · მეღვინეობა ნანუა (იმერეთი).",
      "White dry · Winery Nanua (Imereti)."
    ],
    "Otskhanuri saphere": [
      "წითელი მშრალი · მეღვინეობა ნანუა (იმერეთი).",
      "Red dry · Winery Nanua (Imereti)."
    ],
    "Tsolikouri": [
      "თეთრი მშრალი · მარტვილის მარანი (სამეგრელო).",
      "White dry · Martvilis Marani (Samegrelo)."
    ],
    "Ojaleshi": [
      "წითელი მშრალი · მარტვილის მარანი (სამეგრელო).",
      "Red dry · Martvilis Marani (Samegrelo)."
    ],
    "Petnat Vagoda": [
      "წითელი / თეთრი მშრალი · მარტვილის მარანი (სამეგრელო).",
      "Red / white dry · Martvilis Marani (Samegrelo)."
    ],
    "Rkatsiteli-Kisi": [
      "თეთრი მშრალი · თამუნას ღვინო (კახეთი).",
      "White dry · Tamuna’s Wine (Kakheti)."
    ],
    "Temo Saperavi": [
      "წითელი მშრალი · როტკავეების მარანი (კახეთი).",
      "Red dry · Rotkavebis Marani (Kakheti)."
    ],
    "La vida es un carnaval": [
      "წითელი მშრალი · გოგოს ღვინო (კახეთი).",
      "Red dry · Gogo Wine (Kakheti)."
    ],
    "Anfent": [
      "თეთრი მშრალი · ძმების მარანი (ქართლი).",
      "White dry · Dzmebis Marani (Kartli)."
    ],
    "Bovi": [
      "წითელი მშრალი · ძმების მარანი (ქართლი).",
      "Red dry · Dzmebis Marani (Kartli)."
    ],
    "Rachuli tetra glass / 1L": [
      "თეთრი მშრალი · მეღვინეობა ბარაკონი (რაჭა).",
      "White dry · Winery Barakoni (Racha)."
    ],
    "Khashmi’s Saperavi glass / 1L": [
      "წითელი მშრალი · სულიკოს ღვინო (კახეთი).",
      "Red dry · Suliko’s Wine (Kakheti)."
    ]
  };

  /*
   * ვეგეტარიანული კერძების დადასტურებული სია.
   * ჩაწერე ინგლისური სახელები ზუსტად ისე, როგორც rows-შია.
   *
   * მაგალითად, რეცეპტების დადასტურების შემდეგ:
   * "Georgian salad",
   * "Avocado toast"
   */
  const vegetarianDishes = new Set([
  ]);

  /*
   * კერძების ფოტოები.
   * ფოტოს გარეშე კერძს ცარიელი ჩარჩო არ გამოუჩნდება.
   *
   * ფოტოს დამატების მაგალითი:
   * "Kubdari": "./photos/kubdari.jpg"
   */
  const dishPhotos = {
  };

  const categoryIcons = [
    "salad",
    "egg",
    "plate",
    "cake",
    "glass",
    "wine"
  ];

  const drinkIcons = {
    "Coffee": "cup",
    "Forest tea": "tea",
    "Fresh juice": "glass",
    "Matsoni smoothie": "glass",
    "Compot": "glass",
    "Coca-Cola": "glass",
    "Juice": "glass",
    "Borjomi": "bottle",
    "Lemonade": "glass",
    "Beer": "beer",
    "Chacha": "tumbler",
    "Homemade brandy": "tumbler",
    "Whiskey": "tumbler",
    "Rum": "tumbler",
    "Tequila": "tumbler",
    "Jägermeister": "tumbler",
    "Baileys": "tumbler"
  };

  const iconPaths = {
    leaf: [
      "M20 4C10 3 3 7 5 15c1 4 7 5 11 1 3-3 4-8 4-12Z",
      "M4 21 15 10"
    ],
    salad: [
      "M3 12h18c-1 6-4 9-9 9s-8-3-9-9Z",
      "M7 12C2 6 8 2 11 7",
      "M11 12c-2-7 5-11 7-6",
      "M16 12c0-4 4-5 5-2"
    ],
    egg: [
      "M19 14c0 5-3 7-7 7s-7-2-7-7S9 3 12 3s7 6 7 11Z",
      "M9 16c0 2 1 3 3 3"
    ],
    plate: [
      "M16 5a7 7 0 1 1-6 0",
      "M2 3v6c0 2 4 2 4 0V3",
      "M4 3v18",
      "M21 3v18",
      "M21 3c-3 2-3 7 0 8"
    ],
    cake: [
      "M4 12h16v9H4Z",
      "M4 16c2-3 4 3 6 0s4 3 6 0 3 0 4 0",
      "M8 12V8h8v4",
      "M12 8V5",
      "M12 2v1"
    ],
    glass: [
      "M5 5h14l-2 16H7Z",
      "M6 10h12",
      "M13 14 16 2h4"
    ],
    wine: [
      "M8 3h8l1 6c1 7-11 7-10 0Z",
      "M7 8h10",
      "M12 14v7",
      "M8 21h8"
    ],
    cup: [
      "M4 8h13v8a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4Z",
      "M17 9h2a3 3 0 0 1 0 6h-2",
      "M7 3v2",
      "M11 2v3",
      "M15 3v2"
    ],
    tea: [
      "M4 9h13v6a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5Z",
      "M17 10h2a3 3 0 0 1 0 6h-2",
      "M12 9v5",
      "M10 14h4v4h-4Z",
      "M7 3v3",
      "M11 2v3"
    ],
    bottle: [
      "M10 2h4v5l3 4v10H7V11l3-4Z",
      "M10 5h4",
      "M7 13h10",
      "M7 17h10"
    ],
    beer: [
      "M5 8h12v13H5Z",
      "M17 10h3v7h-3",
      "M8 12v5",
      "M13 12v5",
      "M5 8C1 5 6 1 9 4c2-3 6-2 6 1 4-1 5 3 2 3"
    ],
    tumbler: [
      "M5 4h14l-1 17H6Z",
      "M6 13c4-2 8 2 12 0",
      "M9 8h5v4H9Z"
    ]
  };

  function createIcon(name) {
    const namespace = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(namespace, "svg");

    const attributes = {
      class: "menu-icon",
      viewBox: "0 0 24 24",
      width: "20",
      height: "20",
      fill: "none",
      stroke: "currentColor",
      "stroke-width": "1.6",
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
      "aria-hidden": "true",
      focusable: "false"
    };

    Object.entries(attributes).forEach(([name, value]) => {
      svg.setAttribute(name, value);
    });

    for (const d of iconPaths[name] || iconPaths.plate) {
      const path = document.createElementNS(namespace, "path");
      path.setAttribute("d", d);
      svg.append(path);
    }

    return svg;
  }

  const $ = selector => document.querySelector(selector);
  const tabs = $("#tabs");
  const search = $("#search");
  const items = $("#items");
  const languageButton = $("#language");

  let lang = "ka";
  let active = 0;

  try {
    if (localStorage.getItem("agra-language") === "en") {
      lang = "en";
    }
  } catch {
    // The menu also works when browser storage is unavailable.
  }

  function addPhoto(container, row, languageIndex) {
    const source = dishPhotos[row[2]];

    if (typeof source !== "string" || !source.trim()) {
      return;
    }

    let url;

    try {
      url = new URL(source, document.baseURI);
    } catch {
      return;
    }

    if (!["http:", "https:", "file:"].includes(url.protocol)) {
      return;
    }

    const link = document.createElement("a");
    link.className = "dish-photo-link";
    link.href = url.href;
    link.target = "_blank";
    link.rel = "noopener";

    const photo = document.createElement("img");
    photo.className = "dish-photo";
    photo.src = url.href;
    photo.alt = row[languageIndex + 1];
    photo.loading = "lazy";
    photo.decoding = "async";

    photo.addEventListener("error", () => {
      link.remove();
    }, { once: true });

    link.append(photo);
    container.append(link);
  }

  function renderItems() {
    const n = lang === "ka" ? 0 : 1;
    const query = search.value.trim().toLocaleLowerCase();

    const selected = rows.filter(row => {
      const names = `${row[1]} ${row[2]}`.toLocaleLowerCase();
      return row[0] === active && names.includes(query);
    });

    $("#category").textContent = categories[active][n];
    $("#count").textContent = String(selected.length).padStart(2, "0");

    items.replaceChildren();
    items.setAttribute("aria-labelledby", `category-${active}`);

    for (const row of selected) {
      const dish = document.createElement("article");
      dish.className = "dish";

      const copy = document.createElement("div");
      copy.className = "dish-copy";

      const heading = document.createElement("h3");
      const title = document.createElement("span");
      title.textContent = row[n + 1];

      heading.append(
        createIcon(drinkIcons[row[2]] || categoryIcons[row[0]]),
        title
      );

      copy.append(heading);

      if (vegetarianDishes.has(row[2])) {
        const badge = document.createElement("span");
        badge.className = "vegetarian-badge";

        badge.append(
          createIcon("leaf"),
          document.createTextNode(
            n ? "Vegetarian" : "ვეგეტარიანული"
          )
        );

        copy.append(badge);
      }

      if (descriptions[row[2]]?.[n]) {
        const description = document.createElement("p");
        description.textContent = descriptions[row[2]][n];
        copy.append(description);
      }

      addPhoto(copy, row, n);

      const price = document.createElement("strong");
      price.textContent = row[3] + " ";

      const currency = document.createElement("small");
      currency.textContent = "₾";
      price.append(currency);

      dish.append(copy, price);
      items.append(dish);
    }

    if (!selected.length) {
      const empty = document.createElement("p");
      empty.textContent = n
        ? "No dishes found."
        : "კერძი ვერ მოიძებნა.";

      items.append(empty);
    }
  }

  function updateTabSelection() {
    [...tabs.children].forEach((button, index) => {
      const selected = index === active;

      button.classList.toggle("selected", selected);
      button.setAttribute("aria-selected", String(selected));
      button.tabIndex = selected ? 0 : -1;
    });
  }

  function selectCategory(index, moveFocus = false) {
    active = index;
    search.value = "";

    updateTabSelection();
    renderItems();

    if (moveFocus) {
      tabs.children[active].focus();
    }
  }

  function renderLanguage() {
    const n = lang === "ka" ? 0 : 1;

    document.documentElement.lang = lang;

    document.querySelectorAll("[data-ka][data-en]").forEach(element => {
      element.textContent = element.dataset[lang];
    });

    document.querySelectorAll("[data-alt-ka][data-alt-en]").forEach(image => {
      image.alt = image.getAttribute("data-alt-" + lang);
    });

    tabs.replaceChildren();

    categories.forEach((category, index) => {
      const button = document.createElement("button");

      button.type = "button";
      button.id = `category-${index}`;
      button.setAttribute("role", "tab");
      button.setAttribute("aria-controls", "items");

      const label = document.createElement("span");
      label.textContent = category[n];

      button.append(createIcon(categoryIcons[index]), label);

      button.addEventListener("click", () => {
        selectCategory(index);
      });

      tabs.append(button);
    });

    tabs.setAttribute(
      "aria-label",
      n ? "Menu categories" : "მენიუს კატეგორიები"
    );

    search.placeholder = n
      ? "Search this category"
      : "მოძებნეთ კატეგორიაში";

    search.setAttribute("aria-label", search.placeholder);

    $("#original").setAttribute("href", `./menu-${lang}.jpeg`);

    languageButton.textContent = n ? "ქარ" : "ENG";
    languageButton.lang = n ? "ka" : "en";

    languageButton.setAttribute(
      "aria-label",
      n ? "ქართულზე გადართვა" : "Switch to English"
    );

    $("#back-to-top").setAttribute(
      "aria-label",
      n ? "Back to top" : "ზემოთ დაბრუნება"
    );

    document.title = n
      ? "Agra Ushguli • აგრა უშგული"
      : "აგრა უშგული • Agra Ushguli";

    const description = document.querySelector('meta[name="description"]');

    if (description) {
      description.content = n
        ? "Agra Ushguli — Svan flavours, Georgian wine and a gathering place in the heart of Ushguli. Menu in Georgian and English."
        : "აგრა უშგული — სვანური გემოები, ქართული ღვინო და შეხვედრის ადგილი უშგულის გულში. მენიუ ქართულად და ინგლისურად.";
    }

    updateTabSelection();
    renderItems();
  }

  tabs.addEventListener("keydown", event => {
    if (!event.target.closest('[role="tab"]')) {
      return;
    }

    let next;

    switch (event.key) {
      case "ArrowRight":
        next = (active + 1) % categories.length;
        break;

      case "ArrowLeft":
        next = (active + categories.length - 1) % categories.length;
        break;

      case "Home":
        next = 0;
        break;

      case "End":
        next = categories.length - 1;
        break;

      default:
        return;
    }

    event.preventDefault();
    selectCategory(next, true);
  });

  search.addEventListener("input", renderItems);

  languageButton.addEventListener("click", () => {
    lang = lang === "ka" ? "en" : "ka";
    renderLanguage();

    try {
      localStorage.setItem("agra-language", lang);
    } catch {
      // Language switching does not require browser storage.
    }
  });

  renderLanguage();
})();
