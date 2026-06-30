document.addEventListener("DOMContentLoaded", () => {
  const products = [
    { id: "anavar-50", name: "Anavar 50", meta: "Oxandrolone", price: 59.99, image: "assets/images/product-bottle.png" },
    { id: "cardarine", name: "Cardarine", meta: "GW-501516", price: 69.99, image: "assets/images/product-bottle.png" },
    { id: "nolvadex-20", name: "Nolvadex 20", meta: "Tamoxifen", price: 49.99, image: "assets/images/categories-imgs/post-cycle-therapy.png" },
    { id: "hgh-191aa", name: "HGH 191AA", meta: "10 IU", price: 149.99, image: "assets/images/product-bottle.png" },
    { id: "bpc-157", name: "BPC-157 5mg", meta: "Peptides", price: 59.99, image: "assets/images/categories-imgs/peptides.png" },
    { id: "pct-complete-stack", name: "PCT Complete Stack", meta: "Post Cycle Therapy", price: 89.99, image: "assets/images/category-boxes.svg" },
    { id: "testosterone-enanthate", name: "Testosterone Enanthate", meta: "Hormones", price: 49.99, image: "assets/images/product-bottle.png" },
    { id: "male-enhancement-stack", name: "Male Enhancement Stack", meta: "Sexual Health", price: 79.99, image: "assets/images/categories-imgs/sexual-health.png" },
    { id: "clenbuterol", name: "Clenbuterol 40mcg", meta: "Fat Burners", price: 49.99, image: "assets/images/categories-imgs/fat-burrners.png" },
    { id: "insulin-syringes", name: "Insulin Syringes 1ml", meta: "Syringes & Needles", price: 9.99, image: "assets/images/categories-imgs/injection.png" },
    { id: "winstrol", name: "Winstrol 10mg", meta: "Orals", price: 54.99, image: "assets/images/categories-imgs/orals.png" },
    { id: "cjc-1295", name: "CJC-1295 2mg", meta: "Peptides", price: 74.99, image: "assets/images/categories-imgs/peptides.png" },
    { id: "trenbolone-acetate", name: "Trenbolone Acetate", meta: "Hormones", price: 64.99, image: "assets/images/product-bottle.png" },
    { id: "whey-protein-isolate", name: "Whey Protein Isolate", meta: "Protein", price: 59.99, image: "assets/images/product-bottle.png" },
    { id: "whey-protein-concentrate", name: "Whey Protein Concentrate", meta: "Protein", price: 49.99, image: "assets/images/categories-imgs/peptides.png" },
    { id: "whey-hydrolysate", name: "Whey Hydrolysate", meta: "Protein", price: 64.99, image: "assets/images/product-bottle.png" },
    { id: "whey-protein-blend", name: "Whey Protein Blend", meta: "Protein", price: 54.99, image: "assets/images/categories-imgs/orals.png" },
    { id: "whey-isolate-unflavored", name: "Whey Isolate (Unflavored)", meta: "Protein", price: 59.99, image: "assets/images/product-bottle.png" },
    { id: "whey-protein-shaker", name: "Whey Protein + Shaker", meta: "Protein", price: 69.99, image: "assets/images/category-boxes.svg" },
    { id: "whey-isolate-chocolate", name: "Whey Isolate (Chocolate)", meta: "Protein", price: 59.99, image: "assets/images/product-bottle.png" },
    { id: "whey-concentrate", name: "Whey Concentrate", meta: "Protein", price: 44.99, image: "assets/images/categories-imgs/sexual-health.png" },
    { id: "whey-isolate-vanilla", name: "Whey Isolate (Vanilla)", meta: "Protein", price: 59.99, image: "assets/images/product-bottle.png" },
    { id: "whey-mass-gainer", name: "Whey Mass Gainer", meta: "Protein", price: 69.99, image: "assets/images/product-bottle.png" },
    { id: "whey-protein-strawberry", name: "Whey Protein (Strawberry)", meta: "Protein", price: 54.99, image: "assets/images/categories-imgs/orals.png" },
    { id: "whey-blend-cookies", name: "Whey Blend (Cookies & Cream)", meta: "Protein", price: 54.99, image: "assets/images/product-bottle.png" },
    { id: "ostarine", name: "Ostarine MK-2866", meta: "Enobosarm", price: 49.99, image: "assets/images/product-bottle.png" },
    { id: "masteron-enanthate", name: "Masteron Enanthate", meta: "Performance", price: 49.99, image: "assets/images/categories-imgs/peptides.png" },
  ];

  const cart = new Map([
    ["cardarine", 1],
    ["anavar-50", 1],
    ["pct-complete-stack", 1],
  ]);

  if (document.body.classList.contains("order-success-page")) {
    cart.clear();
  }

  const navLinks = document.querySelectorAll(".navbar .nav-link");
  const siteHeader = document.querySelector(".site-header");
  const navbarCollapse = document.querySelector("#mainNav");
  const toastElement = document.querySelector("#cartToast");
  const toast = window.bootstrap && toastElement ? bootstrap.Toast.getOrCreateInstance(toastElement, { delay: 1800 }) : null;
  const toastBody = toastElement?.querySelector(".toast-body");

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

  function prepareAnimatedHeadings() {
    document.querySelectorAll(".section-heading h2, .why-intro h2").forEach((heading) => {
      if (heading.dataset.animatedHeading === "true") return;
      const text = heading.textContent.trim();
      if (!text) return;

      let charIndex = 0;
      heading.innerHTML = text.split(" ").map((word) => {
        const letters = [...word].map((letter) => {
          const span = `<span class="heading-char" style="--char-index:${charIndex}">${letter}</span>`;
          charIndex += 1;
          return span;
        }).join("");
        return `<span class="heading-word">${letters}</span>`;
      }).join('<span class="heading-space" aria-hidden="true"></span>');

      heading.classList.add("animated-heading");
      heading.dataset.animatedHeading = "true";
      heading.setAttribute("aria-label", text);
    });
  }

  function preparePageAnimations() {
    const revealSelectors = [
      ".category-card",
      ".benefit",
      ".product-card",
      ".quote-card",
      ".testimonial-stats > div",
      ".footer-main > *",
      ".footer-feature-strip > div",
      ".footer-bottom",
      ".shop-sidebar",
      ".shop-toolbar",
      ".bundle-banner",
      ".shop-trust-grid > div",
      ".shop-newsletter-inner > *",
      ".cart-items-panel",
      ".order-summary",
      ".checkout-step",
      ".checkout-summary",
      ".success-card",
      ".recommended-products",
      ".product-gallery",
      ".product-purchase",
      ".product-benefit-strip > div",
      ".tab-content-card",
      ".related-card",
      ".reviews-panel",
      ".usage-panel"
    ];

    const cards = document.querySelectorAll([
      ".category-card",
      ".product-card",
      ".shop-product-card",
      ".quote-card",
      ".success-card",
      ".cart-items-panel",
      ".order-summary",
      ".checkout-summary",
      ".product-info-card",
      ".related-card"
    ].join(","));

    document.querySelectorAll(revealSelectors.join(",")).forEach((item, index) => {
      if (!item.classList.contains("reveal-up") && !item.classList.contains("reveal-on-scroll")) {
        item.classList.add("reveal-on-scroll");
      }
      if (!item.dataset.anim) {
        item.dataset.anim = index % 5 === 0 ? "scale" : index % 3 === 0 ? "left" : index % 3 === 1 ? "right" : "soft";
      }
    });

    cards.forEach((card) => card.classList.add("motion-card"));

    document.querySelectorAll(".hero-bottle, .product-main-image > img, .benefits-product-shot img, .bundle-products img").forEach((asset, index) => {
      asset.classList.add("float-asset");
      asset.style.animationDelay = `${(index % 4) * 160}ms`;
    });

    document.querySelectorAll(".btn-gold, .success-check, .product-category-pill").forEach((item) => {
      item.classList.add("pulse-glow");
    });
  }

  function updateHeaderState() {
    siteHeader.classList.toggle("is-scrolled", window.scrollY > 20);
  }

  function showToast(message) {
    if (!toast || !toastBody) return;
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
    const product = findProduct(id);
    if (!product) return;
    cart.set(id, (cart.get(id) || 0) + 1);
    renderCart();
    showToast(`${product.name} added to your cart.`);
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

      if (window.bootstrap && navbarCollapse.classList.contains("show")) {
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

  document.querySelectorAll("[data-testimonial-slider]").forEach((slider) => {
    const track = slider.querySelector(".testimonial-track");
    const slides = [...slider.querySelectorAll(".testimonial-slide")];
    const pagination = slider.querySelector(".testimonial-pagination");
    const prev = slider.querySelector(".testimonial-prev");
    const next = slider.querySelector(".testimonial-next");
    let activeIndex = 0;

    function visibleCount() {
      if (!slides.length) return 1;
      return Math.max(1, Math.round(track.clientWidth / slides[0].getBoundingClientRect().width));
    }

    function maxIndex() {
      return Math.max(0, slides.length - visibleCount());
    }

    function setActiveDot(index) {
      pagination.querySelectorAll("button").forEach((dot, dotIndex) => {
        const isActive = dotIndex === index;
        dot.classList.toggle("is-active", isActive);
        dot.setAttribute("aria-current", isActive ? "true" : "false");
      });
    }

    function goTo(index) {
      activeIndex = Math.max(0, Math.min(index, maxIndex()));
      const target = slides[activeIndex];
      if (target) track.scrollTo({ left: target.offsetLeft - track.offsetLeft, behavior: "smooth" });
      setActiveDot(activeIndex);
    }

    function buildPagination() {
      const dots = maxIndex() + 1;
      pagination.innerHTML = Array.from({ length: dots }, (_, index) => (
        `<button type="button" aria-label="Show testimonial ${index + 1}"></button>`
      )).join("");
      pagination.querySelectorAll("button").forEach((dot, index) => {
        dot.addEventListener("click", () => goTo(index));
      });
      goTo(Math.min(activeIndex, maxIndex()));
    }

    function syncActiveFromScroll() {
      const width = slides[0]?.getBoundingClientRect().width || 1;
      const gap = parseFloat(getComputedStyle(track).columnGap || getComputedStyle(track).gap) || 0;
      activeIndex = Math.max(0, Math.min(maxIndex(), Math.round(track.scrollLeft / (width + gap))));
      setActiveDot(activeIndex);
    }

    prev?.addEventListener("click", () => goTo(activeIndex - 1));
    next?.addEventListener("click", () => goTo(activeIndex + 1));
    track.addEventListener("scroll", syncActiveFromScroll, { passive: true });
    window.addEventListener("resize", buildPagination);
    buildPagination();
  });

  document.querySelectorAll(".quote-card p").forEach((text) => {
    text.setAttribute("tabindex", "0");
    text.setAttribute("role", "button");
    text.setAttribute("aria-expanded", "false");
    text.title = "Click to read full testimonial";

    function toggleTestimonial() {
      const card = text.closest(".quote-card");
      const isExpanded = card.classList.toggle("is-expanded");
      text.setAttribute("aria-expanded", String(isExpanded));
    }

    text.addEventListener("click", toggleTestimonial);
    text.addEventListener("keydown", (event) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault();
      toggleTestimonial();
    });
  });

  document.addEventListener("click", (event) => {
    const productCard = event.target.closest(".product-card");
    const addFromSearch = event.target.closest("[data-search-add]");
    const inc = event.target.closest("[data-cart-inc]");
    const dec = event.target.closest("[data-cart-dec]");
    const remove = event.target.closest("[data-cart-remove]");

    if (productCard && event.target.closest("button")) {
      const index = [...document.querySelectorAll(".product-card")].indexOf(productCard);
      addToCart(productCard.dataset.productId || products[index]?.id);
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

  document.querySelector(".newsletter")?.addEventListener("submit", (event) => {
    event.preventDefault();
    showToast("Thanks for joining our newsletter.");
    event.currentTarget.reset();
  });

  const tabCards = [...document.querySelectorAll(".tab-content-card")];
  if (tabCards.length) {
    const tabIds = ["description", "benefits", "dosage", "ingredients", "reviews", "faq"];

    function getTabCard(id) {
      const target = document.getElementById(id);
      return target?.classList.contains("tab-content-card") ? target : target?.closest(".tab-content-card");
    }

    function showProductTab(id, updateHash = true) {
      const nextId = tabIds.includes(id) ? id : "description";
      const nextCard = getTabCard(nextId) || tabCards[0];

      tabCards.forEach((card) => {
        const isActive = card === nextCard;
        card.classList.toggle("is-hidden", !isActive);
        card.querySelectorAll(".product-tabs a").forEach((link) => {
          link.classList.toggle("active", link.getAttribute("href") === `#${nextId}`);
        });
      });

      nextCard.classList.add("is-visible");
      if (updateHash) history.replaceState(null, "", `#${nextId}`);
    }

    document.addEventListener("click", (event) => {
      const tabLink = event.target.closest(".product-tabs a");
      if (!tabLink) return;
      const id = tabLink.getAttribute("href")?.replace("#", "");
      if (!tabIds.includes(id)) return;
      event.preventDefault();
      showProductTab(id);
    });

    showProductTab(location.hash.replace("#", ""), false);
  }

  prepareAnimatedHeadings();
  preparePageAnimations();

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      if (entry.target.classList.contains("animated-heading")) {
        entry.target.classList.add("heading-ready");
      }
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.14 });

  document.querySelectorAll(".reveal-on-scroll, .reveal-group > *").forEach((item, index) => {
    item.style.transitionDelay = `${Math.min(index % 6, 5) * 70}ms`;
    observer.observe(item);
  });

  document.querySelectorAll(".animated-heading").forEach((heading) => {
    observer.observe(heading);
  });

  renderCart();
  updateHeaderState();
});
