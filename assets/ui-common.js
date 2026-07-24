(function () {
  function ready(fn) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fn, { once: true });
    } else {
      fn();
    }
  }

  function initUiCommon() {
    if (document.querySelector('.toast')) return;

    var toast = document.createElement('div');
    toast.className = 'toast';
    toast.setAttribute('aria-live', 'polite');
    document.body.appendChild(toast);

    window.sumartToast = function (message) {
      toast.textContent = message;
      toast.classList.add('show');
      clearTimeout(toast._timer);
      toast._timer = setTimeout(function () {
        toast.classList.remove('show');
      }, 1500);
    };

    document.querySelectorAll('[data-toast]').forEach(function (button) {
      if (button.dataset.uiReady === '1') return;
      button.dataset.uiReady = '1';
      button.addEventListener('click', function (event) {
        event.preventDefault();
        window.sumartToast(button.getAttribute('data-toast') || '');
      });
    });

    document.querySelectorAll('[data-link]').forEach(function (element) {
      if (element.dataset.uiReady === '1') return;
      element.dataset.uiReady = '1';
      element.style.cursor = 'pointer';
      element.addEventListener('click', function (event) {
        if (event.target.closest('button,a')) return;
        var href = element.getAttribute('data-link');
        if (!href) return;
        event.preventDefault();
        window.location.href = href;
      });
    });

    document.querySelectorAll('.scroll-top, [data-top], .sumart-v4-top').forEach(function (button) {
      if (button.dataset.uiReady === '1') return;
      button.dataset.uiReady = '1';
      button.addEventListener('click', function (event) {
        event.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    });

    function getAuthState() {
      try {
        var loggedIn = localStorage.getItem('sumartLoggedIn') === 'true';
        var provider = localStorage.getItem('sumartLoginProvider') || 'SUMART';
        var token = localStorage.getItem('sumartAccessToken');
        return { loggedIn: loggedIn && !!token, provider: provider };
      } catch (error) {
        return { loggedIn: false, provider: 'SUMART' };
      }
    }

    function updateAuthUi() {
      var state = getAuthState();
      var loginButtons = document.querySelectorAll('.btn-login, [data-auth-button]');
      loginButtons.forEach(function (button) {
        if (!button) return;
        if (state.loggedIn) {
          button.textContent = '로그아웃';
          button.setAttribute('data-auth-state', 'logged-in');
          button.setAttribute('href', 'javascript:void(0)');
          button.onclick = function (event) {
            event.preventDefault();
            try {
              localStorage.removeItem('sumartLoggedIn');
              localStorage.removeItem('sumartLoginProvider');
              localStorage.removeItem('sumartAccessToken');
              localStorage.removeItem('sumartTokenType');
            } catch (error) {}
            window.location.href = 'login.html';
          };
        } else {
          button.textContent = '로그인';
          button.setAttribute('data-auth-state', 'logged-out');
          button.setAttribute('href', 'login.html');
          button.onclick = null;
        }
      });

      var welcome = document.querySelector('.my-welcome h2');
      if (welcome && state.loggedIn) {
        var providerLabel = state.provider || 'SUMART';
        welcome.innerHTML = `안녕하세요, ${providerLabel} 회원님 👋<br/>오늘도 AI가 더 좋은 선택을 준비했습니다.`;
      }
    }

    updateAuthUi();
  }

  ready(initUiCommon);
})();
