(function () {
  function ready(fn) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fn, { once: true });
    } else {
      fn();
    }
  }

  function getFormAction(form) {
    return form.getAttribute('data-form-action') || form.id || '';
  }

  function bindFormActions() {
    document.querySelectorAll('form[data-form-action], form[id="f"]').forEach(function (form) {
      if (form.dataset.formBound === '1') return;
      form.dataset.formBound = '1';

      form.addEventListener('submit', function (event) {
        event.preventDefault();

        const action = getFormAction(form);
        const result = document.getElementById('result');

        if (action === 'signup') {
          try {
            localStorage.setItem('sumartMember', 'true');
            localStorage.setItem('sumartAccessToken', 'demo-access-token');
            localStorage.setItem('sumartTokenType', 'demo');
          } catch (error) {}
          if (result) {
            result.textContent = '회원가입이 완료되었습니다. 잠시 후 로그인 화면으로 이동합니다.';
          }
          window.setTimeout(function () {
            window.location.href = 'login.html';
          }, 900);
          return;
        }

        if (action === 'find-id') {
          if (result) {
            result.textContent = '가입된 아이디: sumart***@example.com';
          }
          return;
        }

        if (action === 'find-password') {
          if (result) {
            result.style.display = 'block';
            result.textContent = '입력한 이메일로 비밀번호 재설정 링크를 전송했습니다.';
          }
          return;
        }
      });
    });
  }

  ready(bindFormActions);
})();
