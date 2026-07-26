(function() {
  var CLIPBOARD_SVG = '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>';
  var CHECK_SVG = '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>';

  document.querySelectorAll('.highlight').forEach(function(block) {
    var btn = document.createElement('button');
    btn.className = 'copy-btn';
    btn.innerHTML = CLIPBOARD_SVG;
    btn.title = 'Copiar';
    btn.setAttribute('aria-label', 'Copiar');

    btn.addEventListener('click', function() {
      var code = block.querySelector('code');
      if (!code) return;
      navigator.clipboard.writeText(code.textContent).then(function() {
        btn.innerHTML = CHECK_SVG;
        btn.classList.add('copied');
        setTimeout(function() {
          btn.innerHTML = CLIPBOARD_SVG;
          btn.classList.remove('copied');
        }, 2000);
      });
    });

    block.style.position = 'relative';
    block.appendChild(btn);
  });
})();
