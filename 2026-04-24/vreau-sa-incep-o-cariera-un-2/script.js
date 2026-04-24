const storageKeys = {
  products: "tiktokKebabProducts",
  news: "tiktokKebabNews",
  users: "tiktokKebabUsers",
  session: "tiktokKebabSession",
};

const defaultProducts = [
  {
    id: "p1",
    badge: "Popular",
    name: "Kebab Wrap Clasic",
    description: "Carne la rotisor, salata, rosii, castraveti, cartofi si sos la alegere.",
    price: 28,
    active: true,
  },
  {
    id: "p2",
    badge: "Semnatura",
    name: "TikTok Kebab XL",
    description: "Portie generoasa cu extra carne, mix de legume, cartofi si doua sosuri.",
    price: 36,
    active: true,
  },
  {
    id: "p3",
    badge: "Crispy",
    name: "Crispy Chicken Wrap",
    description: "Pui crispy, cheddar, salata iceberg, cartofi si sos usor picant.",
    price: 31,
    active: true,
  },
  {
    id: "p4",
    badge: "Farfurie",
    name: "Kebab la Farfurie",
    description: "Carne, cartofi, salata, muraturi si lipie calda servita separat.",
    price: 34,
    active: true,
  },
  {
    id: "p5",
    badge: "Vegetarian",
    name: "Falafel Fresh",
    description: "Falafel crocant, hummus, legume proaspete, patrunjel si sos tahini.",
    price: 27,
    active: true,
  },
  {
    id: "p6",
    badge: "Meniu",
    name: "Meniu Kebab + Bautura",
    description: "Wrap clasic, cartofi extra si bautura rece la alegere.",
    price: 39,
    active: true,
  },
];

const defaultNews = [
  {
    id: "n1",
    title: "Oferta de lansare TikTok Kebab",
    body: "La orice meniu kebab primesti cartofi extra in limita stocului disponibil.",
    date: new Date().toISOString().slice(0, 10),
    image: "",
    active: true,
  },
];

const defaultUsers = [
  {
    id: "u1",
    username: "Megaadmin",
    password: "Megaadmin!",
    role: "superadmin",
  },
];

const readStore = (key, fallback) => {
  const value = localStorage.getItem(key);
  if (!value) {
    localStorage.setItem(key, JSON.stringify(fallback));
    return fallback;
  }

  try {
    return JSON.parse(value);
  } catch {
    localStorage.setItem(key, JSON.stringify(fallback));
    return fallback;
  }
};

const writeStore = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};

const ensureDefaultAdmin = () => {
  const users = readStore(storageKeys.users, defaultUsers);
  const adminUser = users.find((user) => user.username === "Megaadmin");

  if (!adminUser) {
    writeStore(storageKeys.users, [...defaultUsers, ...users]);
    return;
  }

  if (adminUser.role !== "superadmin") {
    adminUser.role = "superadmin";
    writeStore(storageKeys.users, users);
  }
};

const createId = (prefix) => `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;

const formatDate = (dateValue) => {
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return dateValue;
  return new Intl.DateTimeFormat("ro-RO", { day: "2-digit", month: "long", year: "numeric" }).format(date);
};

const escapeText = (value) => {
  const div = document.createElement("div");
  div.textContent = value ?? "";
  return div.innerHTML;
};

const header = document.querySelector("[data-header]");
const nav = document.querySelector("[data-nav]");
const navToggle = document.querySelector("[data-nav-toggle]");
const orderForm = document.querySelector("[data-order-form]");
const formNote = document.querySelector("[data-form-note]");

const updateHeader = () => {
  header?.classList.toggle("is-scrolled", window.scrollY > 24);
};

updateHeader();
window.addEventListener("scroll", updateHeader, { passive: true });

navToggle?.addEventListener("click", () => {
  nav?.classList.toggle("is-open");
});

nav?.addEventListener("click", (event) => {
  if (event.target instanceof HTMLAnchorElement) {
    nav.classList.remove("is-open");
  }
});

const renderPublicProducts = () => {
  const target = document.querySelector("[data-public-products]");
  const productSelect = document.querySelector('[data-order-form] select[name="product"]');
  if (!target) return;

  const products = readStore(storageKeys.products, defaultProducts).filter((product) => product.active);
  target.innerHTML = products
    .map(
      (product, index) => `
        <article class="menu-item ${index === 1 ? "featured-item" : ""}">
          <span class="item-badge">${escapeText(product.badge || "Produs")}</span>
          <h3>${escapeText(product.name)}</h3>
          <p>${escapeText(product.description)}</p>
          <div class="item-footer">
            <strong>${Number(product.price)} lei</strong>
            <a href="#comanda" aria-label="Comanda ${escapeText(product.name)}">Comanda</a>
          </div>
        </article>
      `,
    )
    .join("");

  if (productSelect) {
    productSelect.innerHTML = '<option value="">Alege produsul</option>';
    products.forEach((product) => {
      const option = document.createElement("option");
      option.textContent = product.name;
      productSelect.append(option);
    });
  }
};

const renderPublicNews = () => {
  const target = document.querySelector("[data-public-news]");
  if (!target) return;

  const news = readStore(storageKeys.news, defaultNews).filter((item) => item.active);
  target.innerHTML = news
    .map(
      (item) => `
        <article class="news-card">
          ${
            item.image
              ? `<img class="news-image" src="${item.image}" alt="${escapeText(item.title)}">`
              : `<div class="news-image news-image-fallback">TK</div>`
          }
          <div>
            <span>${escapeText(formatDate(item.date))}</span>
            <h3>${escapeText(item.title)}</h3>
            <p>${escapeText(item.body)}</p>
          </div>
        </article>
      `,
    )
    .join("");
};

orderForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(orderForm);
  const name = data.get("name") || "Client";
  const product = data.get("product") || "produsul ales";

  formNote.textContent = `${name}, comanda pentru ${product} a fost pregatita ca demo. Urmatorul pas este conectarea la WhatsApp sau baza de date.`;
  orderForm.reset();
});

renderPublicProducts();
renderPublicNews();

const loginScreen = document.querySelector("[data-login-screen]");
const adminShell = document.querySelector("[data-admin-shell]");

const getSession = () => {
  const rawSession = localStorage.getItem(storageKeys.session);
  if (!rawSession) return null;

  try {
    return JSON.parse(rawSession);
  } catch {
    return null;
  }
};

const getCurrentUser = () => {
  const session = getSession();
  if (!session) return null;
  return readStore(storageKeys.users, defaultUsers).find((user) => user.id === session.userId) || null;
};

const setAdminVisibility = () => {
  if (!loginScreen || !adminShell) return;

  const currentUser = getCurrentUser();
  const isLoggedIn = Boolean(currentUser);
  loginScreen.classList.toggle("is-hidden", isLoggedIn);
  adminShell.classList.toggle("is-hidden", !isLoggedIn);

  if (!currentUser) return;

  document.querySelector("[data-current-role]").textContent =
    currentUser.role === "superadmin" ? "super admin" : "admin";

  document.querySelectorAll("[data-superadmin-only]").forEach((element) => {
    element.classList.toggle("is-hidden", currentUser.role !== "superadmin");
  });
};

const renderAdminProducts = () => {
  const target = document.querySelector("[data-products-list]");
  if (!target) return;

  const products = readStore(storageKeys.products, defaultProducts);
  target.innerHTML = products
    .map(
      (product) => `
        <article class="admin-list-item">
          <div>
            <strong>${escapeText(product.name)}</strong>
            <p>${escapeText(product.description)}</p>
            <span>${Number(product.price)} lei · ${product.active ? "vizibil" : "ascuns"}</span>
          </div>
          <div class="row-actions">
            <button type="button" data-edit-product="${product.id}">Editeaza</button>
            <button type="button" data-delete-product="${product.id}">Sterge</button>
          </div>
        </article>
      `,
    )
    .join("");
};

const renderAdminNews = () => {
  const target = document.querySelector("[data-news-list]");
  if (!target) return;

  const news = readStore(storageKeys.news, defaultNews);
  target.innerHTML = news
    .map(
      (item) => `
        <article class="admin-list-item">
          <div>
            <strong>${escapeText(item.title)}</strong>
            <p>${escapeText(item.body)}</p>
            <span>${escapeText(formatDate(item.date))} · ${item.active ? "publicat" : "ascuns"}</span>
          </div>
          <div class="row-actions">
            <button type="button" data-edit-news="${item.id}">Editeaza</button>
            <button type="button" data-delete-news="${item.id}">Sterge</button>
          </div>
        </article>
      `,
    )
    .join("");
};

const renderUsers = () => {
  const target = document.querySelector("[data-users-list]");
  if (!target) return;

  const users = readStore(storageKeys.users, defaultUsers);
  target.innerHTML = users
    .map(
      (user) => `
        <article class="admin-list-item">
          <div>
            <strong>${escapeText(user.username)}</strong>
            <p>${user.role === "superadmin" ? "Poate gestiona utilizatori, produse si noutati." : "Poate gestiona produse si noutati."}</p>
            <span>${escapeText(user.role)}</span>
          </div>
          <div class="row-actions">
            <button type="button" data-delete-user="${user.id}" ${user.username === "Megaadmin" ? "disabled" : ""}>Sterge</button>
          </div>
        </article>
      `,
    )
    .join("");
};

document.querySelector("[data-login-form]")?.addEventListener("submit", (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  const data = new FormData(form);
  const users = readStore(storageKeys.users, defaultUsers);
  const user = users.find(
    (item) => item.username === data.get("username") && item.password === data.get("password"),
  );

  if (!user) {
    document.querySelector("[data-login-note]").textContent = "Utilizator sau parola gresita.";
    return;
  }

  localStorage.setItem(storageKeys.session, JSON.stringify({ userId: user.id, loginAt: Date.now() }));
  form.reset();
  setAdminVisibility();
  renderAdminProducts();
  renderAdminNews();
  renderUsers();
});

document.querySelector("[data-logout]")?.addEventListener("click", () => {
  localStorage.removeItem(storageKeys.session);
  setAdminVisibility();
});

document.querySelector("[data-product-form]")?.addEventListener("submit", (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  const data = new FormData(form);
  const products = readStore(storageKeys.products, defaultProducts);
  const product = {
    id: data.get("id") || createId("p"),
    name: data.get("name").trim(),
    badge: data.get("badge").trim(),
    description: data.get("description").trim(),
    price: Number(data.get("price")),
    active: data.get("active") === "true",
  };

  const nextProducts = products.some((item) => item.id === product.id)
    ? products.map((item) => (item.id === product.id ? product : item))
    : [product, ...products];

  writeStore(storageKeys.products, nextProducts);
  form.reset();
  renderAdminProducts();
  renderPublicProducts();
});

document.querySelector("[data-news-form]")?.addEventListener("submit", async (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  const data = new FormData(form);
  const news = readStore(storageKeys.news, defaultNews);
  const existing = news.find((item) => item.id === data.get("id"));
  const file = data.get("image");
  let image = existing?.image || "";

  if (file && file.size > 0) {
    image = await new Promise((resolve) => {
      const reader = new FileReader();
      reader.addEventListener("load", () => resolve(reader.result));
      reader.readAsDataURL(file);
    });
  }

  const item = {
    id: data.get("id") || createId("n"),
    title: data.get("title").trim(),
    body: data.get("body").trim(),
    date: data.get("date"),
    image,
    active: data.get("active") === "true",
  };

  const nextNews = news.some((newsItem) => newsItem.id === item.id)
    ? news.map((newsItem) => (newsItem.id === item.id ? item : newsItem))
    : [item, ...news];

  writeStore(storageKeys.news, nextNews);
  form.reset();
  renderAdminNews();
  renderPublicNews();
});

document.querySelector("[data-user-form]")?.addEventListener("submit", (event) => {
  event.preventDefault();
  const currentUser = getCurrentUser();
  const note = document.querySelector("[data-user-note]");
  if (currentUser?.role !== "superadmin") {
    note.textContent = "Doar super adminul poate crea utilizatori.";
    return;
  }

  const form = event.currentTarget;
  const data = new FormData(form);
  const users = readStore(storageKeys.users, defaultUsers);
  const username = data.get("username").trim();

  if (users.some((user) => user.username === username)) {
    note.textContent = "Acest utilizator exista deja. Alege alt nume.";
    return;
  }

  users.push({
    id: createId("u"),
    username,
    password: data.get("password").trim(),
    role: data.get("role"),
  });

  writeStore(storageKeys.users, users);
  form.reset();
  note.textContent = `Utilizatorul ${username} a fost creat.`;
  renderUsers();
});

document.addEventListener("click", (event) => {
  const target = event.target;
  if (!(target instanceof HTMLButtonElement)) return;

  const products = readStore(storageKeys.products, defaultProducts);
  const news = readStore(storageKeys.news, defaultNews);
  const users = readStore(storageKeys.users, defaultUsers);

  if (target.dataset.editProduct) {
    const product = products.find((item) => item.id === target.dataset.editProduct);
    const form = document.querySelector("[data-product-form]");
    if (!product || !form) return;
    form.elements.id.value = product.id;
    form.elements.name.value = product.name;
    form.elements.badge.value = product.badge;
    form.elements.price.value = product.price;
    form.elements.description.value = product.description;
    form.elements.active.value = String(product.active);
    form.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  if (target.dataset.deleteProduct) {
    writeStore(
      storageKeys.products,
      products.filter((item) => item.id !== target.dataset.deleteProduct),
    );
    renderAdminProducts();
    renderPublicProducts();
  }

  if (target.dataset.editNews) {
    const item = news.find((newsItem) => newsItem.id === target.dataset.editNews);
    const form = document.querySelector("[data-news-form]");
    if (!item || !form) return;
    form.elements.id.value = item.id;
    form.elements.title.value = item.title;
    form.elements.body.value = item.body;
    form.elements.date.value = item.date;
    form.elements.active.value = String(item.active);
    form.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  if (target.dataset.deleteNews) {
    writeStore(
      storageKeys.news,
      news.filter((item) => item.id !== target.dataset.deleteNews),
    );
    renderAdminNews();
    renderPublicNews();
  }

  if (target.dataset.deleteUser) {
    const currentUser = getCurrentUser();
    if (currentUser?.role !== "superadmin") return;
    writeStore(
      storageKeys.users,
      users.filter((user) => user.id !== target.dataset.deleteUser),
    );
    renderUsers();
  }
});

ensureDefaultAdmin();
setAdminVisibility();
renderAdminProducts();
renderAdminNews();
renderUsers();
