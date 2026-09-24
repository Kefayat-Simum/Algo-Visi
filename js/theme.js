/* ==========================================================================
   Theme toggle — persists choice in localStorage as "dsa-theme".
   The initial theme is applied by a tiny inline <head> script on every page
   (prevents a flash of the wrong theme); this file wires the toggle button
   and keeps the sun / moon glyph in sync.
   ========================================================================== */
(function () {
  function currentTheme() {
    return document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
  }

  function updateButton(theme) {
    var btn = document.getElementById('theme-toggle');
    if (!btn) return;
    var isLight = theme === 'light';
    var sun = btn.querySelector('.icon-sun');
    var moon = btn.querySelector('.icon-moon');
    // In dark mode show the sun (click -> switch to light).
    // In light mode show the moon (click -> switch to dark).
    if (sun) sun.style.display = isLight ? 'none' : 'block';
    if (moon) moon.style.display = isLight ? 'block' : 'none';
    var label = isLight ? 'Switch to dark theme' : 'Switch to light theme';
    btn.setAttribute('aria-label', label);
    btn.setAttribute('title', label);
  }

  function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    try { localStorage.setItem('dsa-theme', theme); } catch (e) { /* storage blocked */ }
    updateButton(theme);
  }

  document.addEventListener('DOMContentLoaded', function () {
    var btn = document.getElementById('theme-toggle');
    if (btn) {
      btn.addEventListener('click', function () {
        setTheme(currentTheme() === 'light' ? 'dark' : 'light');
      });
    }
    updateButton(currentTheme());
  });
})();
