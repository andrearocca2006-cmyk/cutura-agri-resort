(() => {
  const assetVersion = '20260906-3';
  const versionedAsset = source => {
    const url = new URL(source, document.baseURI);
    url.searchParams.set('v', assetVersion);
    return url.href;
  };

  document.querySelectorAll('img[src^="assets/"]').forEach(image => {
    image.loading = 'eager';
    image.decoding = image.classList.contains('hero-image') ? 'sync' : 'async';
    image.src = versionedAsset(image.getAttribute('src'));
  });

  const body = document.body;
  const header = document.querySelector('.site-header');
  const menuButton = document.querySelector('.menu-toggle');
  const mobileMenu = document.querySelector('.mobile-menu');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const setHeader = () => header.classList.toggle('is-scrolled', window.scrollY > 24);
  setHeader();
  window.addEventListener('scroll', setHeader, { passive: true });

  const closeMenu = () => {
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', 'Apri il menu');
    mobileMenu.setAttribute('aria-hidden', 'true');
    mobileMenu.classList.remove('open');
    header.classList.remove('menu-active');
    body.classList.remove('menu-open');
  };

  menuButton.addEventListener('click', () => {
    const open = menuButton.getAttribute('aria-expanded') === 'true';
    if (open) return closeMenu();
    menuButton.setAttribute('aria-expanded', 'true');
    menuButton.setAttribute('aria-label', 'Chiudi il menu');
    mobileMenu.setAttribute('aria-hidden', 'false');
    mobileMenu.classList.add('open');
    header.classList.add('menu-active');
    body.classList.add('menu-open');
  });
  mobileMenu.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));

  if (!reduceMotion && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -35px' });
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
  } else {
    document.querySelectorAll('.reveal').forEach(el => el.classList.add('visible'));
  }

  const filterButtons = [...document.querySelectorAll('[data-filter]')];
  const galleryItems = [...document.querySelectorAll('.gallery-item')];
  filterButtons.forEach(button => button.addEventListener('click', () => {
    filterButtons.forEach(item => item.classList.toggle('active', item === button));
    const filter = button.dataset.filter;
    galleryItems.forEach(item => {
      item.hidden = filter !== 'all' && item.dataset.category !== filter;
    });
  }));

  const lightbox = document.querySelector('#lightbox');
  const lightboxImage = lightbox.querySelector('img');
  const lightboxCaption = lightbox.querySelector('figcaption');
  const galleryButtons = galleryItems.filter(item => item.matches('button[data-full]'));
  let currentIndex = 0;

  const visibleGallery = () => galleryButtons.filter(item => !item.hidden);
  const showImage = index => {
    const items = visibleGallery();
    if (!items.length) return;
    currentIndex = (index + items.length) % items.length;
    const item = items[currentIndex];
    lightboxImage.src = versionedAsset(item.dataset.full);
    lightboxImage.alt = item.dataset.alt;
    lightboxCaption.textContent = item.dataset.alt;
  };

  galleryButtons.forEach(item => item.addEventListener('click', () => {
    currentIndex = visibleGallery().indexOf(item);
    showImage(currentIndex);
    lightbox.showModal();
  }));
  lightbox.querySelector('.prev').addEventListener('click', () => showImage(currentIndex - 1));
  lightbox.querySelector('.next').addEventListener('click', () => showImage(currentIndex + 1));
  lightbox.querySelector('.lightbox-close').addEventListener('click', () => lightbox.close());
  lightbox.addEventListener('click', event => { if (event.target === lightbox) lightbox.close(); });
  document.addEventListener('keydown', event => {
    if (!lightbox.open) return;
    if (event.key === 'ArrowLeft') showImage(currentIndex - 1);
    if (event.key === 'ArrowRight') showImage(currentIndex + 1);
  });

  const legalDialog = document.querySelector('#legal-dialog');
  const legalTitle = document.querySelector('#legal-title');
  const titles = { privacy: 'Privacy Policy', cookie: 'Cookie Policy', terms: 'Termini e condizioni' };
  document.querySelectorAll('[data-legal]').forEach(button => button.addEventListener('click', () => {
    legalTitle.textContent = titles[button.dataset.legal];
    legalDialog.showModal();
  }));
  legalDialog.querySelector('.legal-close').addEventListener('click', () => legalDialog.close());
  legalDialog.querySelector('.legal-done').addEventListener('click', () => legalDialog.close());
  legalDialog.addEventListener('click', event => { if (event.target === legalDialog) legalDialog.close(); });

  document.querySelector('#year').textContent = new Date().getFullYear();
})();
