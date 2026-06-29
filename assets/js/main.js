document.addEventListener("DOMContentLoaded", () => {
  const products = [
    { id: "anavar-50", name: "Anavar 50", meta: "Oxandrolone", price: 59.99, image: "assets/images/product-bottle.png" },
    { id: "cardarine", name: "Cardarine", meta: "GW-501516", price: 69.99, image: "assets/images/product-bottle.png" },
    { id: "nolvadex-20", name: "Nolvadex 20", meta: "Tamoxifen", price: 49.99, image: "assets/images/product-bottle.png" },
    { id: "hgh-191aa", name: "HGH 191AA", meta: "10 IU", price: 149.99, image: "assets/images/product-bottle.png" },
    { id: "bpc-157", name: "BPC-157", meta: "5mg", price: 59.99, image: "assets/images/product-bottle.png" },
  ];

  const cart = new Map([
    ["anavar-50", 1],
    ["cardarine", 1],
  ]);

  const navLinks = document.querySelectorAll(".navbar .nav-link");
  const siteHeader = document.querySelector(".site-header");
  const navbarCollapse = document.querySelector("#mainNav");
  const toastElement = document.querySelector("#cartToast");
  const toast = bootstrap.Toast.getOrCreateInstance(toastElement, { delay: 1800 });
  const toastBody = toastElement.querySelector(".toast-body");

  const searchPanel = document.querySelector(".search-panel");
  const searchInput = document.querySelector("#siteSearch");
  const searchResults = document.querySelector(".search-results");
  const searchForm = document.querySelector(".search-form");
  const cartOverlay = document.querySelector(".cart-overlay");
  const cartDrawer = document.querySelector(".cart-drawer");
  const cartItems = document.querySelector(".cart-items");
  const cartEmpty = document.querySelector(".cart-empty");
  const cartCount = document.querySelector(".cart-count");
  const cartSubtotal = document.querySelector(".cart-subtotal");
  const productTrack = document.querySelector(".product-track");

  const money = (value) => `$${value.toFixed(2)}`;
  const findProduct = (id) => products.find((product) => product.id === id);
  const cartQty = () => [...cart.values()].reduce((total, qty) => total + qty, 0);

  function updateHeaderState() {
    siteHeader.classList.toggle("is-scrolled", window.scrollY > 20);
  }

  function showToast(message) {
    toastBody.textContent = message;
    toast.show();
  }

  function syncBodyLock() {
    const hasOpenPanel = searchPanel.classList.contains("is-open") || cartDrawer.classList.contains("is-open");
    document.body.classList.toggle("panel-open", hasOpenPanel);
  }

  function setPanelState(panel, open) {
    panel.classList.toggle("is-open", open);
    panel.setAttribute("aria-hidden", String(!open));
    syncBodyLock();
  }

  function openSearch() {
    setPanelState(searchPanel, true);
    renderSearchResults("");
    setTimeout(() => searchInput.focus(), 120);
  }

  function closeSearch() {
    setPanelState(searchPanel, false);
  }

  function openCart() {
    renderCart();
    cartOverlay.classList.add("is-open");
    cartOverlay.setAttribute("aria-hidden", "false");
    setPanelState(cartDrawer, true);
  }

  function closeCart() {
    cartOverlay.classList.remove("is-open");
    cartOverlay.setAttribute("aria-hidden", "true");
    setPanelState(cartDrawer, false);
  }

  function addToCart(id) {
    cart.set(id, (cart.get(id) || 0) + 1);
    renderCart();
    showToast(`${findProduct(id).name} added to your cart.`);
  }

  function updateQty(id, direction) {
    const nextQty = (cart.get(id) || 0) + direction;
    if (nextQty <= 0) {
      cart.delete(id);
    } else {
      cart.set(id, nextQty);
    }
    renderCart();
  }

  function renderCart() {
    const entries = [...cart.entries()];
    const subtotal = entries.reduce((total, [id, qty]) => total + findProduct(id).price * qty, 0);

    cartItems.innerHTML = entries.map(([id, qty]) => {
      const product = findProduct(id);
      return `
        <article class="cart-item">
          <img src="${product.image}" alt="${product.name}">
          <div>
            <h3>${product.name}</h3>
            <small>${product.meta} - ${money(product.price)}</small>
            <div class="qty-control" aria-label="Quantity controls">
              <button type="button" data-cart-dec="${product.id}" aria-label="Decrease ${product.name}">-</button>
              <span>${qty}</span>
              <button type="button" data-cart-inc="${product.id}" aria-label="Increase ${product.name}">+</button>
            </div>
          </div>
          <button class="remove-item" type="button" data-cart-remove="${product.id}" aria-label="Remove ${product.name}"><i class="fa-solid fa-trash-can"></i></button>
        </article>`;
    }).join("");

    cartCount.textContent = cartQty();
    cartSubtotal.textContent = money(subtotal);
    cartEmpty.classList.toggle("is-visible", entries.length === 0);
  }

  function renderSearchResults(query) {
    const normalized = query.trim().toLowerCase();
    const matches = products.filter((product) => `${product.name} ${product.meta}`.toLowerCase().includes(normalized));

    searchResults.innerHTML = matches.length ? matches.map((product) => `
      <article class="search-result">
        <img src="${product.image}" alt="${product.name}">
        <div class="me-auto">
          <strong>${product.name}</strong>
          <small>${product.meta} - ${money(product.price)}</small>
        </div>
        <button type="button" data-search-add="${product.id}" aria-label="Add ${product.name}"><i class="fa-solid fa-cart-plus"></i></button>
      </article>`).join("") : '<p class="no-results">No products found. Try searching "Peptides" or "HGH".</p>';
  }

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.forEach((item) => item.classList.remove("active"));
      link.classList.add("active");

      if (navbarCollapse.classList.contains("show")) {
        bootstrap.Collapse.getOrCreateInstance(navbarCollapse).hide();
      }
    });
  });

  navbarCollapse.addEventListener("show.bs.collapse", () => siteHeader.classList.add("menu-open"));
  navbarCollapse.addEventListener("hidden.bs.collapse", () => siteHeader.classList.remove("menu-open"));
  window.addEventListener("scroll", updateHeaderState, { passive: true });

  document.querySelector(".search-toggle").addEventListener("click", openSearch);
  document.querySelector(".search-close").addEventListener("click", closeSearch);
  searchPanel.addEventListener("click", (event) => {
    if (event.target === searchPanel) closeSearch();
  });
  searchInput.addEventListener("input", (event) => renderSearchResults(event.target.value));
  searchForm.addEventListener("submit", (event) => event.preventDefault());

  document.querySelector(".cart-btn").addEventListener("click", openCart);
  document.querySelector(".cart-close").addEventListener("click", closeCart);
  cartOverlay.addEventListener("click", closeCart);
  document.querySelector(".slider-prev")?.addEventListener("click", () => productTrack.scrollBy({ left: -260, behavior: "smooth" }));
  document.querySelector(".slider-next")?.addEventListener("click", () => productTrack.scrollBy({ left: 260, behavior: "smooth" }));

  document.addEventListener("click", (event) => {
    const productCard = event.target.closest(".product-card");
    const addFromSearch = event.target.closest("[data-search-add]");
    const inc = event.target.closest("[data-cart-inc]");
    const dec = event.target.closest("[data-cart-dec]");
    const remove = event.target.closest("[data-cart-remove]");

    if (productCard && event.target.closest("button")) {
      const index = [...document.querySelectorAll(".product-card")].indexOf(productCard);
      addToCart(products[index].id);
    }

    if (addFromSearch) addToCart(addFromSearch.dataset.searchAdd);
    if (inc) updateQty(inc.dataset.cartInc, 1);
    if (dec) updateQty(dec.dataset.cartDec, -1);
    if (remove) updateQty(remove.dataset.cartRemove, -999);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeSearch();
      closeCart();
    }
  });

  document.querySelector(".newsletter").addEventListener("submit", (event) => {
    event.preventDefault();
    showToast("Thanks for joining our newsletter.");
    event.currentTarget.reset();
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.14 });

  document.querySelectorAll(".reveal-on-scroll, .reveal-group > *").forEach((item, index) => {
    item.style.transitionDelay = `${Math.min(index % 6, 5) * 70}ms`;
    observer.observe(item);
  });

  renderCart();
  updateHeaderState();
});
