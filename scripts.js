const menuToggle = document.querySelector('.menu-toggle');
const siteNav = document.getElementById('site-nav');

if (menuToggle && siteNav) {
  menuToggle.addEventListener('click', () => {
    const isOpen = siteNav.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
  });

  document.addEventListener('click', (event) => {
    const target = event.target;
    if (siteNav.classList.contains('open') && !target.closest('.site-header')) {
      siteNav.classList.remove('open');
      menuToggle.setAttribute('aria-expanded', 'false');
    }
  });
}
