// --- PRODUCT DATA (MOCK) ---
const products = [
  {
    id: 1,
    name: 'Limited Edition Sneaker',
    price: 125.00,
    category: 'Footwear',
    description: 'The New Standard in footwear. Crafted with premium materials and a focus on essential form, these sneakers are designed for those who value understated luxury.',
    images: [
      'https://raw.githubusercontent.com/fom-solutions/sneakers-product-page/main/images/image-product-1.jpg',
      'https://raw.githubusercontent.com/fom-solutions/sneakers-product-page/main/images/image-product-2.jpg',
      'https://raw.githubusercontent.com/fom-solutions/sneakers-product-page/main/images/image-product-3.jpg',
      'https://raw.githubusercontent.com/fom-solutions/sneakers-product-page/main/images/image-product-4.jpg'
    ],
    thumbnails: [
      'https://raw.githubusercontent.com/fom-solutions/sneakers-product-page/main/images/image-product-1-thumbnail.jpg',
      'https://raw.githubusercontent.com/fom-solutions/sneakers-product-page/main/images/image-product-2-thumbnail.jpg',
      'https://raw.githubusercontent.com/fom-solutions/sneakers-product-page/main/images/image-product-3-thumbnail.jpg',
      'https://raw.githubusercontent.com/fom-solutions/sneakers-product-page/main/images/image-product-4-thumbnail.jpg'
    ]
  },
  {
    id: 2,
    name: 'Essential Canvas Coat',
    price: 210.00,
    category: 'Outerwear',
    description: 'A timeless silhouette designed for the modern nomad. Made from high-density organic canvas with water-resistant finishing.',
    images: ['https://raw.githubusercontent.com/fom-solutions/sneakers-product-page/main/images/image-product-2.jpg'],
    thumbnails: ['https://raw.githubusercontent.com/fom-solutions/sneakers-product-page/main/images/image-product-2-thumbnail.jpg']
  },
  {
    id: 3,
    name: 'Monochrome Runner',
    price: 150.00,
    category: 'Footwear',
    description: 'Engineered for comfort and style. The Monochrome Runner features a recycled knit upper and a high-rebound sole.',
    images: ['https://raw.githubusercontent.com/fom-solutions/sneakers-product-page/main/images/image-product-3.jpg'],
    thumbnails: ['https://raw.githubusercontent.com/fom-solutions/sneakers-product-page/main/images/image-product-3-thumbnail.jpg']
  },
  {
    id: 4,
    name: 'Silk Blend Trousers',
    price: 185.00,
    category: 'Apparel',
    description: 'The ultimate in relaxed sophistication. These trousers are cut from a luxurious silk-cotton blend for a fluid drape.',
    images: ['https://raw.githubusercontent.com/fom-solutions/sneakers-product-page/main/images/image-product-4.jpg'],
    thumbnails: ['https://raw.githubusercontent.com/fom-solutions/sneakers-product-page/main/images/image-product-4-thumbnail.jpg']
  }
];

document.addEventListener('DOMContentLoaded', () => {
  // --- Initialize Lenis ---
  const lenis = new Lenis({ lerp: 0.1 });
  function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
  requestAnimationFrame(raf);

  // --- UI Elements ---
  const loadingBar = document.getElementById('loading-bar') || createLoadingBar();
  const searchOverlay = document.getElementById('search-overlay');
  const searchBtn = document.getElementById('search-btn');
  const searchBtnMobile = document.getElementById('search-btn-mobile');
  const searchClose = document.getElementById('search-close');
  const searchInput = document.getElementById('search-input');
  const searchResults = document.getElementById('search-results');
  const menuTrigger = document.getElementById('menu-trigger');
  const mobileMenu = document.getElementById('mobile-menu');

  function createLoadingBar() {
    const bar = document.createElement('div');
    bar.id = 'loading-bar';
    document.body.appendChild(bar);
    return bar;
  }

  // --- State ---
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  let currentQty = 0;

  const cartBtn = document.getElementById('cart-btn');
  const cartDropdown = document.getElementById('cart-dropdown');

  // --- Search Logic ---
  const openSearch = () => {
    searchOverlay?.classList.add('active');
    document.body.classList.add('search-open');
    setTimeout(() => searchInput?.focus(), 400);
  };

  const closeSearch = () => {
    searchOverlay?.classList.remove('active');
    document.body.classList.remove('search-open');
    if (searchInput) searchInput.value = '';
    if (searchResults) searchResults.innerHTML = '';
  };

  searchBtn?.addEventListener('click', openSearch);
  searchBtnMobile?.addEventListener('click', openSearch);
  searchClose?.addEventListener('click', closeSearch);

  // --- Cart Toggle ---
  cartBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    cartDropdown?.classList.toggle('active');
  });

  document.addEventListener('click', (e) => {
    if (cartDropdown?.classList.contains('active') && !cartDropdown.contains(e.target) && e.target !== cartBtn) {
      cartDropdown.classList.remove('active');
    }
  });

  searchInput?.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase();
    if (!query) { searchResults.innerHTML = ''; return; }
    const filtered = products.filter(p => p.name.toLowerCase().includes(query) || p.category.toLowerCase().includes(query));
    renderSearchResults(filtered);
  });

  const renderSearchResults = (items) => {
    if (!searchResults) return;
    if (items.length === 0) {
      searchResults.innerHTML = '<p style="font-family:serif; font-size:24px; color:#888;">No results found.</p>';
      return;
    }
    searchResults.innerHTML = items.map(item => `
      <a href="product.html?id=${item.id}" class="search-result-item nav-link">
        <div class="search-result-img img-placeholder" style="width:60px; height:80px;">
          <img src="${item.thumbnails[0]}" alt="${item.name}">
        </div>
        <div class="search-result-info">
          <h4>${item.name}</h4>
          <p>${item.category} / $${item.price}</p>
        </div>
      </a>
    `).join('');
    handleImageLoading();
    attachNavLinkListeners();
  };

  // --- Cart ---
  const updateCartUI = () => {
    const container = document.getElementById('cart-items');
    const count = document.getElementById('cart-count');
    if (!container || !count) return;

    if (cart.length === 0) {
      container.innerHTML = '<p style="text-align:center; padding: 3rem 0; color: #888; font-size: 13px;">Your bag is empty.</p>';
      count.style.display = 'none';
    } else {
      container.innerHTML = cart.map((item, index) => `
        <div class="cart-item" style="--i: ${index}">
          <img src="${item.thumbnail}" alt="${item.name}" class="cart-item__img">
          <div class="cart-item__details">
            <p>${item.name}</p>
            <p>$${item.price} x ${item.quantity}</p>
          </div>
          <button class="cart-item__delete" data-id="${item.id}">
            <i class="icon icon-delete"></i>
          </button>
        </div>
      `).join('') + '<button class="cart-dropdown__checkout">Checkout</button>';

      count.textContent = cart.reduce((acc, item) => acc + item.quantity, 0);
      count.style.display = 'flex';

      container.querySelectorAll('.cart-item__delete').forEach(btn => {
        btn.onclick = () => {
          const id = parseInt(btn.dataset.id);
          cart = cart.filter(item => item.id !== id);
          saveCart();
        };
      });
    }
  };

  const saveCart = () => {
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartUI();
  };

  // --- Page Functions ---
  const renderProductGrid = () => {
    const grid = document.querySelector('.product-grid');
    if (!grid) return;
    grid.innerHTML = products.map((p, index) => `
      <a href="product.html?id=${p.id}" class="product-card nav-link" style="--i: ${index}">
        <div class="product-card__img-wrapper img-placeholder">
          <img src="${p.images[0]}" alt="${p.name}">
        </div>
        <div class="product-card__info">
          <h3 class="product-card__title">${p.name}</h3>
          <p class="product-card__price">$${p.price.toFixed(2)}</p>
        </div>
      </a>
    `).join('');
    handleImageLoading();
    attachNavLinkListeners();
  };

  const renderProductDetail = () => {
    const params = new URLSearchParams(window.location.search);
    const id = parseInt(params.get('id')) || 1;
    const p = products.find(prod => prod.id === id);
    if (!p) return;

    const mainImg = document.getElementById('main-product-img');
    const thumbContainer = document.querySelector('.gallery__thumbnails');
    const infoContainer = document.querySelector('.product__info');

    if (mainImg) mainImg.src = p.images[0];
    if (thumbContainer) {
      thumbContainer.innerHTML = p.thumbnails.map((t, i) => `
        <div class="thumbnail ${i === 0 ? 'active' : ''} img-placeholder" data-src="${p.images[i] || p.images[0]}">
          <img src="${t}" alt="Thumbnail ${i+1}">
        </div>
      `).join('');
    }
    
    if (infoContainer) {
      infoContainer.querySelector('.product__title').textContent = p.name;
      infoContainer.querySelector('.product__description').textContent = p.description;
      infoContainer.querySelector('.price').textContent = `$${p.price.toFixed(2)}`;
    }

    initProductEvents(p);
  };

  const initProductEvents = (p) => {
    const thumbnails = document.querySelectorAll('.thumbnail');
    const mainImg = document.getElementById('main-product-img');
    const qtyValue = document.getElementById('qty-value');
    const addToCartBtn = document.getElementById('add-to-cart');

    thumbnails.forEach(thumb => {
      thumb.onclick = () => {
        thumbnails.forEach(t => t.classList.remove('active'));
        thumb.classList.add('active');
        mainImg.src = thumb.dataset.src;
        mainImg.classList.remove('loaded');
        handleImageLoading();
      };
    });

    document.getElementById('qty-minus').onclick = () => { if (currentQty > 0) { currentQty--; qtyValue.textContent = currentQty; } };
    document.getElementById('qty-plus').onclick = () => { currentQty++; qtyValue.textContent = currentQty; };

    addToCartBtn.onclick = () => {
      if (currentQty > 0) {
        const existing = cart.find(item => item.id === p.id);
        if (existing) existing.quantity += currentQty;
        else cart.push({ id: p.id, name: p.name, price: p.price, thumbnail: p.thumbnails[0], quantity: currentQty });
        currentQty = 0;
        qtyValue.textContent = 0;
        saveCart();
        document.getElementById('cart-dropdown')?.classList.add('active');
      }
    };
  };

  const handleImageLoading = () => {
    document.querySelectorAll('.img-placeholder img').forEach(img => {
      if (img.complete) img.classList.add('loaded');
      else img.onload = () => img.classList.add('loaded');
    });
  };

  // --- Navigation ---
  const navigateTo = async (url) => {
    const content = document.getElementById('content');
    if (!content) return;

    closeSearch();
    cartDropdown?.classList.remove('active');
    menuTrigger?.classList.remove('active');
    mobileMenu?.classList.remove('active');
    document.body.classList.remove('menu-open');

    loadingBar.style.width = '30%';
    content.classList.add('fade-out');

    setTimeout(async () => {
      try {
        loadingBar.style.width = '70%';
        const response = await fetch(url);
        const html = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        
        content.innerHTML = doc.getElementById('content').innerHTML;
        document.title = doc.title;
        window.history.pushState({}, '', url);

        content.classList.remove('fade-out');
        loadingBar.style.width = '100%';
        setTimeout(() => loadingBar.style.width = '0', 300);

        initPage();
        lenis.scrollTo(0, { immediate: true });
      } catch (err) {
        window.location.href = url;
      }
    }, 600);
  };

  const attachNavLinkListeners = () => {
    document.querySelectorAll('.nav-link').forEach(link => {
      link.onclick = (e) => {
        const href = link.getAttribute('href');
        if (href && href !== '#' && !href.startsWith('http')) { e.preventDefault(); navigateTo(href); }
      };
    });
  };

  const initPage = () => {
    const path = window.location.pathname;
    if (path.includes('product.html')) renderProductDetail();
    else if (path.endsWith('index.html') || path === '/' || path === '') renderProductGrid();
    
    updateActiveNavLink();
    handleImageLoading();
    attachNavLinkListeners();
    setTimeout(() => document.getElementById('content')?.classList.add('visible'), 50);
  };

  const updateActiveNavLink = () => {
    const current = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.header__nav .nav-link, .mobile-menu__link').forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === current);
    });
  };

  // Initial
  initPage();
  updateCartUI();

  window.onscroll = () => {
    document.querySelector('.header')?.classList.toggle('scrolled', window.scrollY > 50);
  };

  menuTrigger?.addEventListener('click', () => {
    menuTrigger.classList.toggle('active');
    mobileMenu?.classList.toggle('active');
    document.body.classList.toggle('menu-open');
  });

  window.onpopstate = () => window.location.reload();
});
