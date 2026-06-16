/**
 * Vision Optical Center — Premium Interactions
 * Minimal, elegant, purposeful motion.
 */
(function () {
  'use strict';

  /* Navigation */
  var currentPage = 'home';

  var validPages = ['home', 'about', 'services', 'exams', 'glasses', 'lenses', 'gallery', 'faq', 'contact'];

  window.navigate = function (page, skipHash) {
    document.querySelectorAll('.page').forEach(function (p) { p.classList.remove('active'); });
    var target = document.getElementById(page);
    if (target) target.classList.add('active');

    document.querySelectorAll('.nav-links a').forEach(function (a) {
      a.classList.toggle('active', a.dataset.page === page);
    });

    // Update mobile nav active state
    document.querySelectorAll('.mobile-nav a').forEach(function (a) {
      a.classList.toggle('active', a.dataset.page === page);
    });

    currentPage = page;

    // Update page meta tags for SEO (title, description, canonical, OG, Twitter)
    updatePageMeta(page);

    // Update URL hash without triggering a scroll or duplicate navigation
    if (!skipHash && location.hash !== '#' + page) {
      location.hash = page;
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(checkReveal, 200);

    // Refresh map when navigating to contact page
    if (page === 'contact') {
      setTimeout(refreshMap, 400);
    }

    // Inject shared footer into sub-pages
    var homeFooter = document.querySelector('#home footer');
    if (!homeFooter) return;
    validPages.forEach(function (pg) {
      if (pg === 'home') return;
      var ft = document.getElementById(pg + '-footer');
      if (ft && !ft.innerHTML.trim()) ft.innerHTML = homeFooter.outerHTML;
    });
  };

  /* Handle browser back/forward buttons and initial page load */
  function navigateFromHash() {
    var hash = location.hash.replace('#', '') || 'home';
    if (validPages.indexOf(hash) !== -1 && hash !== currentPage) {
      navigate(hash, true);
    }
  }

  window.addEventListener('hashchange', navigateFromHash);

  /* Page-specific meta data for SEO */
  var pageMeta = {
    home: {
      title: 'Vision Optical Center | Premium Eye Care in Madhyapur Thimi, Bhaktapur',
      desc: 'Professional eye exams, prescription glasses & contact lenses in Madhyapur Thimi, Bhaktapur. Book your appointment at Vision Optical Center today.'
    },
    about: {
      title: 'About Us | Vision Optical Center | Eye Care in Madhyapur Thimi, Bhaktapur',
      desc: 'Vision Optical Center has served Bhaktapur since 2016 with expert eye care, precision prescriptions, and quality optical solutions. Book your visit today.'
    },
    services: {
      title: 'Our Services | Vision Optical Center | Eye Care in Madhyapur Thimi, Bhaktapur',
      desc: 'Comprehensive eye care services in Madhyapur Thimi, Bhaktapur \u2014 eye exams, vision testing, prescription glasses, progressive lenses, contact lenses and styling.'
    },
    exams: {
      title: 'Eye Examinations | Vision Optical Center | Madhyapur Thimi, Bhaktapur',
      desc: 'Thorough eye examinations in Bhaktapur \u2014 visual acuity testing, refractive assessment, ocular health screening and personalized care plans.'
    },
    glasses: {
      title: 'Prescription Glasses & Lenses | Vision Optical Center | Madhyapur Thimi',
      desc: 'Premium prescription glasses, progressive lenses, blue light and UV protection in Madhyapur Thimi. Expert frame styling for every face shape.'
    },
    lenses: {
      title: 'Contact Lenses | Vision Optical Center | Madhyapur Thimi, Bhaktapur',
      desc: 'Professional contact lens fitting in Bhaktapur \u2014 daily, monthly, toric and multifocal options. Comfort and clarity at Vision Optical Center.'
    },
    gallery: {
      title: 'Gallery | Vision Optical Center | Madhyapur Thimi, Bhaktapur',
      desc: 'See our Madhyapur Thimi clinic, eye exam facilities, premium eyewear collections, frames and contact lens solutions at Vision Optical Center.'
    },
    faq: {
      title: 'FAQ | Vision Optical Center | Eye Care in Madhyapur Thimi, Bhaktapur',
      desc: 'Answers to common questions about eye exams, prescription glasses, contact lenses, progressive lenses and operating hours at Vision Optical Center.'
    },
    contact: {
      title: 'Contact Us | Vision Optical Center | Book an Eye Appointment in Bhaktapur',
      desc: 'Book your eye appointment at Vision Optical Center in Madhyapur Thimi, Bhaktapur. Call 986-0479291, email us, or walk in during business hours.'
    }
  };

  /* Update all SEO meta tags based on current page */
  function updatePageMeta(page) {
    var baseUrl = 'https://visionopticalcenter.com';
    var canonicalUrl = page === 'home' ? baseUrl + '/' : baseUrl + '/#' + page;
    var meta = pageMeta[page] || pageMeta.home;

    // Canonical URL
    var canonicalLink = document.querySelector('link[rel="canonical"]');
    if (canonicalLink) canonicalLink.href = canonicalUrl;

    // Page title
    document.title = meta.title;

    // Meta description
    var metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.content = meta.desc;

    // Open Graph
    var ogUrl = document.querySelector('meta[property="og:url"]');
    if (ogUrl) ogUrl.content = canonicalUrl;

    var ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.content = meta.title;

    var ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.content = meta.desc;

    // Twitter Card
    var twTitle = document.querySelector('meta[name="twitter:title"]');
    if (twTitle) twTitle.content = meta.title;

    var twDesc = document.querySelector('meta[name="twitter:description"]');
    if (twDesc) twDesc.content = meta.desc;
  }

  /* Mobile Navigation — Toggle */
  window.toggleMobileNav = function () {
    var nav = document.getElementById('mobileNav');
    var overlay = document.getElementById('mobileNavOverlay');
    var btn = document.querySelector('.hamburger');
    var isOpen = nav.classList.contains('open');
    if (isOpen) {
      nav.classList.remove('open');
      overlay.classList.remove('open');
      document.body.style.overflow = '';
      if (btn) btn.setAttribute('aria-expanded', 'false');
    } else {
      nav.classList.add('open');
      overlay.classList.add('open');
      document.body.style.overflow = 'hidden';
      if (btn) btn.setAttribute('aria-expanded', 'true');
    }
  };

  window.closeMobileNav = function () {
    var nav = document.getElementById('mobileNav');
    var overlay = document.getElementById('mobileNavOverlay');
    nav.classList.remove('open');
    overlay.classList.remove('open');
    document.body.style.overflow = '';
    var btn = document.querySelector('.hamburger');
    if (btn) btn.setAttribute('aria-expanded', 'false');
  };

  /* Scroll Effects — Nav background */
  window.addEventListener('scroll', function () {
    var nav = document.getElementById('mainNav');
    if (nav) nav.classList.toggle('scrolled', window.scrollY > 40);
    checkReveal();
  });

  /* Reveal Animations — Gentle fade-in on scroll */
  function checkReveal() {
    document.querySelectorAll('.reveal').forEach(function (el) {
      if (el.getBoundingClientRect().top < window.innerHeight - 60) {
        el.classList.add('visible');
      }
    });
  }
  setTimeout(checkReveal, 100);

  /* Counter Animations — Subtle number count-up */
  function animateCounters() {
    document.querySelectorAll('[data-target]').forEach(function (el) {
      var target = parseInt(el.dataset.target, 10);
      var suffix = el.dataset.suffix || '+';
      var current = 0;
      var step = target / 60;
      var timer = setInterval(function () {
        current = Math.min(current + step, target);
        el.textContent = Math.floor(current) + suffix;
        if (current >= target) clearInterval(timer);
      }, 25);
    });
  }

  /* FAQ Accordion */
  window.toggleFaq = function (questionEl) {
    var faqItem = questionEl.parentElement;
    var answer = faqItem.querySelector('.faq-a');
    var isOpen = faqItem.classList.contains('open');

    document.querySelectorAll('.faq-item.open').forEach(function (item) {
      if (item !== faqItem) {
        item.classList.remove('open');
        item.querySelector('.faq-a').style.maxHeight = '0';
      }
    });

    if (isOpen) {
      faqItem.classList.remove('open');
      answer.style.maxHeight = '0';
    } else {
      faqItem.classList.add('open');
      answer.style.maxHeight = answer.scrollHeight + 'px';
    }
  };

  /* Gallery Filter */
  window.filterGallery = function (category, btn) {
    document.querySelectorAll('.filter-btn').forEach(function (b) { b.classList.remove('active'); });
    if (btn) btn.classList.add('active');

    document.querySelectorAll('.gallery-item').forEach(function (item) {
      var match = category === 'all' || item.dataset.cat === category;
      if (match) {
        item.style.display = '';
        item.style.opacity = '0';
        setTimeout(function () {
          item.style.transition = 'opacity 0.4s ease';
          item.style.opacity = '1';
        }, 50);
      } else {
        item.style.transition = 'opacity 0.3s ease';
        item.style.opacity = '0';
        setTimeout(function () { item.style.display = 'none'; }, 300);
      }
    });
  };

  /* Contact Form */
  window.handleFormSubmit = function (e) {
    e.preventDefault();
    var form = e.target;
    var nameInput = form.querySelector('input[type="text"]');
    var submitBtn = form.querySelector('button[type="submit"]');

    if (!nameInput || !nameInput.value.trim()) { nameInput.focus(); return; }

    var originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '✓ Message Sent';
    submitBtn.style.background = 'var(--color-success)';
    submitBtn.style.color = 'white';
    submitBtn.disabled = true;

    setTimeout(function () {
      submitBtn.innerHTML = originalText;
      submitBtn.style.background = '';
      submitBtn.style.color = '';
      submitBtn.disabled = false;
      form.reset();
    }, 3000);
  };

  /* Keyboard Support */
  document.addEventListener('keydown', function (e) {
    if (e.target.classList.contains('faq-q') && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      e.target.click();
    }
  });

  /* Initialize counters when page loads */
  setTimeout(animateCounters, 800);

  /* Initialize Map with Leaflet */
  var mapInstance = null;
  var mapInitialized = false;

  function initMap() {
    var mapContainer = document.getElementById('map');
    if (mapInitialized || !mapContainer || typeof L === 'undefined') return;

    mapInitialized = true;

    // Vision Optical Center coordinates
    var lat = 27.6838284;
    var lng = 85.3878188;

    mapInstance = L.map('map', {
      center: [lat, lng],
      zoom: 17,
      scrollWheelZoom: false,
      zoomControl: true
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19
    }).addTo(mapInstance);

    // Custom marker
    var markerIcon = L.divIcon({
      className: '',
      html: '<div class="map-marker-icon"><span>V</span></div>',
      iconSize: [40, 48],
      iconAnchor: [20, 48],
      popupAnchor: [0, -48]
    });

    L.marker([lat, lng], { icon: markerIcon })
      .addTo(mapInstance)
      .bindPopup('<strong>Vision Optical Center</strong><br>Madhyapur Thimi, Bhaktapur, Nepal')
      .openPopup();

    // Enable scroll after first interaction
    mapInstance.once('click', function () { mapInstance.scrollWheelZoom.enable(); });
  }

  // Refresh map when contact page is shown (handles display:none sizing)
  function refreshMap() {
    if (mapInstance) {
      setTimeout(function () { mapInstance.invalidateSize(); }, 300);
    } else {
      initMap();
    }
  }

  // Restore page from URL hash on initial load
  navigateFromHash();

  // Initialize map when either Leaflet loads or DOM is ready
  if (document.readyState === 'complete') {
    initMap();
  } else {
    window.addEventListener('load', initMap);
  }
  // Also try after a delay if Leaflet hasn't loaded yet
  setTimeout(initMap, 2000);

})();
