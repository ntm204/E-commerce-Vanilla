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
    images: ['https://raw.githubusercontent.com/fom-solutions/sneakers-product-page/main/images/image-product-2.jpg', 'https://raw.githubusercontent.com/fom-solutions/sneakers-product-page/main/images/image-product-3.jpg'],
    thumbnails: ['https://raw.githubusercontent.com/fom-solutions/sneakers-product-page/main/images/image-product-2-thumbnail.jpg', 'https://raw.githubusercontent.com/fom-solutions/sneakers-product-page/main/images/image-product-3-thumbnail.jpg']
  },
  {
    id: 3,
    name: 'Monochrome Runner',
    price: 150.00,
    category: 'Footwear',
    description: 'Engineered for comfort and style. The Monochrome Runner features a recycled knit upper and a high-rebound sole.',
    images: ['https://raw.githubusercontent.com/fom-solutions/sneakers-product-page/main/images/image-product-3.jpg', 'https://raw.githubusercontent.com/fom-solutions/sneakers-product-page/main/images/image-product-1.jpg'],
    thumbnails: ['https://raw.githubusercontent.com/fom-solutions/sneakers-product-page/main/images/image-product-3-thumbnail.jpg', 'https://raw.githubusercontent.com/fom-solutions/sneakers-product-page/main/images/image-product-1-thumbnail.jpg']
  },
  {
    id: 4,
    name: 'Silk Blend Trousers',
    price: 185.00,
    category: 'Apparel',
    description: 'The ultimate in relaxed sophistication. These trousers are cut from a luxurious silk-cotton blend for a fluid drape.',
    images: ['https://raw.githubusercontent.com/fom-solutions/sneakers-product-page/main/images/image-product-4.jpg'],
    thumbnails: ['https://raw.githubusercontent.com/fom-solutions/sneakers-product-page/main/images/image-product-4-thumbnail.jpg']
  },
  {
    id: 5,
    name: 'Minimalist Tote Bag',
    price: 95.00,
    category: 'Accessories',
    description: 'A clean, architectural tote designed to carry your daily essentials with ease. Crafted from premium full-grain leather.',
    images: ['https://raw.githubusercontent.com/fom-solutions/sneakers-product-page/main/images/image-product-1.jpg'],
    thumbnails: ['https://raw.githubusercontent.com/fom-solutions/sneakers-product-page/main/images/image-product-1-thumbnail.jpg']
  },
  {
    id: 6,
    name: 'Standard Issue Tee',
    price: 45.00,
    category: 'Apparel',
    description: 'The perfect heavyweight tee. Custom knit from 100% organic cotton for a structured yet soft feel.',
    images: ['https://raw.githubusercontent.com/fom-solutions/sneakers-product-page/main/images/image-product-2.jpg'],
    thumbnails: ['https://raw.githubusercontent.com/fom-solutions/sneakers-product-page/main/images/image-product-2-thumbnail.jpg']
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
  let currentQty = 1;

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
            ${item.color ? `<p style="color: #888; font-size: 11px; margin-top: 2px;">${item.color} / ${item.size}</p>` : ''}
            <p style="margin-top: 4px;">$${item.price} x ${item.quantity}</p>
          </div>
          <button class="cart-item__delete" data-cartid="${item.cartId || item.id}">
            <i class="icon icon-delete"></i>
          </button>
        </div>
      `).join('') + '<button class="cart-dropdown__checkout">Checkout</button>';

      count.textContent = cart.reduce((acc, item) => acc + item.quantity, 0);
      count.style.display = 'flex';

      container.querySelectorAll('.cart-item__delete').forEach(btn => {
        btn.onclick = () => {
          const cartId = btn.dataset.cartid;
          cart = cart.filter(item => (item.cartId || item.id.toString()) !== cartId);
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

    // Track recently viewed
    trackRecentlyViewed(p.id);

    const breadcrumbCurrent = document.getElementById('breadcrumb-current');
    if(breadcrumbCurrent) breadcrumbCurrent.textContent = p.name;

    const mainImg = document.getElementById('main-product-img');
    const thumbContainer = document.getElementById('product-thumbnails');

    if (mainImg) mainImg.src = p.images[0];
    if (thumbContainer) {
      thumbContainer.innerHTML = p.thumbnails.map((t, i) => `
        <div class="thumbnail ${i === 0 ? 'active' : ''} img-placeholder" data-src="${p.images[i] || p.images[0]}">
          <img src="${t}" alt="Thumbnail ${i+1}">
        </div>
      `).join('');
    }
    
    const title = document.getElementById('product-title');
    const desc = document.getElementById('product-description');
    const price = document.getElementById('product-price');
    if (title) title.textContent = p.name;
    if (desc) desc.textContent = p.description;
    if (price) price.textContent = `$${p.price.toFixed(2)}`;

    currentQty = 1;
    const qtyValue = document.getElementById('qty-value');
    if(qtyValue) qtyValue.value = currentQty;

    // Smart Stock Status
    updateStockStatus();

    // Delivery Estimate
    updateDeliveryDate();

    // Zoom Lightbox functionality
    initLightbox(mainImg);

    // Render Related Products
    const relatedGrid = document.getElementById('related-grid');
    if(relatedGrid) {
      const related = products.filter(prod => prod.id !== p.id).slice(0, 4);
      relatedGrid.innerHTML = related.map((rp, index) => `
        <a href="product.html?id=${rp.id}" class="product-card nav-link" style="--i: ${index}">
          <div class="product-card__img-wrapper img-placeholder">
            <img src="${rp.images[0]}" alt="${rp.name}">
          </div>
          <div class="product-card__info">
            <h3 class="product-card__title">${rp.name}</h3>
            <p class="product-card__price">$${rp.price.toFixed(2)}</p>
          </div>
        </a>
      `).join('');
    }

    initProductEvents(p);
  };

  const updateStockStatus = () => {
    const stockEl = document.getElementById('stock-status');
    if(!stockEl) return;
    
    setTimeout(() => {
      const randomStock = Math.floor(Math.random() * 10) + 1;
      const statusText = stockEl.querySelector('.status-text');
      const pulse = stockEl.querySelector('.pulse-icon');
      
      if(randomStock < 5) {
        statusText.innerHTML = `Only <strong>${randomStock} left</strong> in stock - order soon`;
        statusText.style.color = '#e67e22';
        if(pulse) pulse.style.backgroundColor = '#e67e22';
      } else {
        statusText.innerHTML = 'In stock, ready to ship';
        statusText.style.color = '#27ae60';
        if(pulse) pulse.style.backgroundColor = '#27ae60';
      }
    }, 800);
  };

  const updateDeliveryDate = () => {
    const deliveryDateEl = document.getElementById('delivery-date');
    if(!deliveryDateEl) return;
    
    const today = new Date();
    const deliveryDate = new Date(today);
    deliveryDate.setDate(today.getDate() + 3);
    
    const options = { weekday: 'long', month: 'long', day: 'numeric' };
    deliveryDateEl.textContent = deliveryDate.toLocaleDateString('en-US', options);
  };

  const initLightbox = (mainImg) => {
    const zoomBtn = document.querySelector('.gallery__zoom');
    const galleryMain = document.querySelector('.gallery__main');
    
    const createLightbox = () => {
      const lb = document.createElement('div');
      lb.className = 'lightbox';
      lb.style = 'position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(255,255,255,0.98); z-index:5000; display:flex; align-items:center; justify-content:center; opacity:0; transition:0.4s; cursor:zoom-out;';
      lb.innerHTML = `
        <div style="width:100%; height:100%; display:flex; align-items:center; justify-content:center; padding:40px;">
          <img src="${mainImg.src}" style="max-width:100%; max-height:100%; object-fit:contain; box-shadow:0 30px 100px rgba(0,0,0,0.1);">
        </div>
        <button style="position:absolute; top:40px; right:40px; font-size:10px; letter-spacing:3px; font-weight:700; text-transform:uppercase; color:#000; background:#fff; padding:10px 20px; border:1px solid #eee;">CLOSE</button>
      `;
      document.body.appendChild(lb);
      setTimeout(() => lb.style.opacity = '1', 10);
      lb.onclick = () => {
        lb.style.opacity = '0';
        setTimeout(() => lb.remove(), 400);
      };
    };

    if(zoomBtn) zoomBtn.onclick = (e) => { e.stopPropagation(); createLightbox(); };
    if(galleryMain) galleryMain.onclick = () => createLightbox();
  };

  const trackRecentlyViewed = (id) => {
    let viewed = JSON.parse(localStorage.getItem('recentlyViewed')) || [];
    viewed = viewed.filter(v => v !== id);
    viewed.unshift(id);
    localStorage.setItem('recentlyViewed', JSON.stringify(viewed.slice(0, 10)));
  };

  const initProductEvents = (p) => {
    const thumbnails = document.querySelectorAll('.thumbnail');
    const mainImg = document.getElementById('main-product-img');
    
    thumbnails.forEach(thumb => {
      thumb.onclick = () => {
        thumbnails.forEach(t => t.classList.remove('active'));
        thumb.classList.add('active');
        
        // Smooth transition
        mainImg.style.opacity = '0';
        setTimeout(() => {
          mainImg.src = thumb.dataset.src;
          mainImg.classList.remove('loaded');
          handleImageLoading();
          mainImg.style.opacity = '1';
        }, 250);
      };
    });

    const qtyValue = document.getElementById('qty-value');
    const btnMinus = document.getElementById('qty-minus');
    const btnPlus = document.getElementById('qty-plus');

    if(btnMinus) {
      btnMinus.onclick = () => { 
        if (currentQty > 1) { currentQty--; qtyValue.value = currentQty; } 
      };
    }
    if(btnPlus) {
      btnPlus.onclick = () => { 
        if (currentQty < 99) { currentQty++; qtyValue.value = currentQty; } 
      };
    }

    // Options (Color & Size)
    const colorSwatches = document.querySelectorAll('.color-swatch');
    const selectedColorText = document.getElementById('selected-color');
    colorSwatches.forEach(swatch => {
      swatch.onclick = () => {
        colorSwatches.forEach(s => s.classList.remove('active'));
        swatch.classList.add('active');
        if(selectedColorText) selectedColorText.textContent = swatch.dataset.color;
      }
    });

    const sizeSwatches = document.querySelectorAll('.size-swatch');
    const selectedSizeText = document.getElementById('selected-size');
    sizeSwatches.forEach(swatch => {
      swatch.onclick = () => {
        sizeSwatches.forEach(s => s.classList.remove('active'));
        swatch.classList.add('active');
        if(selectedSizeText) selectedSizeText.textContent = swatch.dataset.size;
      }
    });

    // Accordions
    const accordions = document.querySelectorAll('.accordion');
    accordions.forEach(acc => {
      const header = acc.querySelector('.accordion__header');
      if(header) {
        header.onclick = () => {
          const isActive = acc.classList.contains('active');
          accordions.forEach(a => a.classList.remove('active'));
          if(!isActive) acc.classList.add('active');
        }
      }
    });

    const addToCartBtn = document.getElementById('add-to-cart');
    if(addToCartBtn) {
      addToCartBtn.onclick = () => {
        if (currentQty > 0) {
          const selectedColor = document.querySelector('.color-swatch.active')?.dataset.color || 'Black';
          const selectedSize = document.querySelector('.size-swatch.active')?.dataset.size || 'M';
          
          const cartId = `${p.id}-${selectedColor}-${selectedSize}`;
          const existing = cart.find(item => item.cartId === cartId);
          
          if (existing) {
            existing.quantity += currentQty;
          } else {
            cart.push({ 
              cartId: cartId,
              id: p.id, 
              name: p.name, 
              price: p.price, 
              thumbnail: p.thumbnails[0], 
              quantity: currentQty,
              color: selectedColor,
              size: selectedSize
            });
          }
          
          currentQty = 1;
          qtyValue.value = 1;
          saveCart();
          
          // Button feedback
          const btnText = addToCartBtn.querySelector('.btn-text') || addToCartBtn;
          const originalText = btnText.textContent;
          btnText.textContent = 'Added to Bag!';
          addToCartBtn.style.backgroundColor = '#4CAF50';
          addToCartBtn.style.color = '#fff';
          
          setTimeout(() => {
            btnText.textContent = originalText;
            addToCartBtn.style.backgroundColor = '';
            document.getElementById('cart-dropdown')?.classList.add('active');
          }, 1000);
        }
      };
    }
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
