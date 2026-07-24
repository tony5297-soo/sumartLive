(function () {
  function setOpenState(nav, panel, buttons, open) {
    panel.hidden = !open;
    panel.setAttribute('aria-hidden', String(!open));
    buttons.forEach(function (button) {
      if (!button) return;
      button.setAttribute('aria-expanded', String(open));
      button.setAttribute('aria-label', open ? '전체 카테고리 닫기' : '전체 카테고리 열기');
    });
  }

  function initCategoryNav() {
    document.querySelectorAll('.sx-category-nav').forEach(function (nav) {
      if (nav.dataset.ready === '1') return;

      nav.dataset.ready = '1';
      var panel = nav.querySelector('.sx-category-panel');
      var toggle = nav.querySelector('.sx-category-toggle');
      var menu = nav.querySelector('.sx-category-menu-btn');
      var buttons = [toggle, menu].filter(Boolean);

      if (!panel || buttons.length === 0) return;

      buttons.forEach(function (button) {
        button.addEventListener('click', function (event) {
          event.preventDefault();
          event.stopImmediatePropagation();
          var open = button.getAttribute('aria-expanded') !== 'true';
          setOpenState(nav, panel, buttons, open);
        });
      });

      panel.addEventListener('click', function (e) {
        if (e.target.closest('a')) {
          setOpenState(nav, panel, buttons, false);
        }
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCategoryNav, { once: true });
  } else {
    initCategoryNav();
  }
})();
