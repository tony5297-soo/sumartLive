(function () {
  function ready(fn) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fn, { once: true });
    } else {
      fn();
    }
  }

  function bindLoginFlow() {
    const button = document.getElementById('go');
    const result = document.getElementById('result');

    if (!button || !result) return;

    const providerName = button.textContent.replace(/\s*계정으로 로그인\s*/, '').trim();
    const providerKey = providerName === '카카오' ? '카카오' : providerName === '네이버' ? '네이버' : providerName === 'Google' ? 'Google' : providerName === 'Apple' ? 'Apple' : providerName;

    button.addEventListener('click', function () {
      localStorage.setItem('sumartLoginProvider', providerKey);
      localStorage.setItem('sumartLoggedIn', 'true');
      localStorage.setItem('sumartAccessToken', `demo-${providerKey.toLowerCase()}-token`);
      localStorage.setItem('sumartTokenType', 'demo');
      result.textContent = `${providerKey} 간편로그인이 완료되었습니다. 마이페이지로 이동합니다.`;
      window.setTimeout(function () {
        window.location.href = 'mypage.html';
      }, 800);
    });
  }

  ready(bindLoginFlow);
})();
