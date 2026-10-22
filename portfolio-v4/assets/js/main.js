(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  /* Auto-add reveal to inner-page content */
  $$('.page-header, .sidebar, .crumb, .meta, .hero-img, .project-links, .prose > *').forEach(function (el, i) {
    el.classList.add('reveal');
  });

  /* Reveal on scroll */
  var revealEls = $$('.reveal');
  if ('IntersectionObserver' in window && !reduce) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('in'); });
  }

  /* Mobile menu */
  var toggle = $('.nav-toggle'), nav = $('.site-nav');
  if (toggle && nav) {
    var close = function () { nav.classList.remove('open'); toggle.setAttribute('aria-expanded', 'false'); };
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    $$('a', nav).forEach(function (a) { a.addEventListener('click', close); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });
    document.addEventListener('click', function (e) { if (!nav.contains(e.target) && !toggle.contains(e.target)) close(); });
  }

  /* Scroll effects: progress bar, header shadow, back-to-top, parallax blobs */
  var bar = $('.progress'), head = $('.masthead'), top = $('.to-top'), ticking = false;
  function onScroll() {
    var y = window.pageYOffset, h = document.documentElement.scrollHeight - window.innerHeight;
    if (bar) bar.style.transform = 'scaleX(' + (h > 0 ? Math.min(y / h, 1) : 0) + ')';
    if (head) head.classList.toggle('scrolled', y > 8);
    if (top) top.classList.toggle('show', y > 500);
    ticking = false;
  }
  window.addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
  onScroll();
  if (top) top.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' }); });

  /* Card tilt + spotlight (mouse only) */
  if (fine && !reduce) {
    $$('.card').forEach(function (card) {
      card.addEventListener('mousemove', function (e) {
        var r = card.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top;
        card.style.setProperty('--mx', x + 'px'); card.style.setProperty('--my', y + 'px');
        card.style.setProperty('--ry', ((x / r.width - 0.5) * 8) + 'deg');
        card.style.setProperty('--rx', ((0.5 - y / r.height) * 8) + 'deg');
      });
      card.addEventListener('mouseleave', function () { card.style.setProperty('--rx', '0deg'); card.style.setProperty('--ry', '0deg'); });
    });
  }

  /* Button ripple */
  $$('.button').forEach(function (b) {
    b.addEventListener('click', function (e) {
      if (reduce) return;
      var r = b.getBoundingClientRect(), d = Math.max(r.width, r.height), s = document.createElement('span');
      s.className = 'ripple'; s.style.width = s.style.height = d + 'px';
      s.style.left = (e.clientX - r.left - d / 2) + 'px'; s.style.top = (e.clientY - r.top - d / 2) + 'px';
      b.appendChild(s); setTimeout(function () { s.remove(); }, 600);
    });
  });

  /* Highlight "Portfolio" in the nav while that section is on screen (home page) */
  var spyLink = $('[data-spy="portfolio"]'), sec = $('#portfolio');
  if (spyLink && sec && 'IntersectionObserver' in window) {
    new IntersectionObserver(function (es) {
      es.forEach(function (e) { spyLink.classList.toggle('active', e.isIntersecting); });
    }, { rootMargin: '-40% 0px -40% 0px' }).observe(sec);
  }
})();
