/* ══════════════════════════════════════════════════════════════
   RYS SITEWIDE SEARCH — NAV BAR + DROPDOWN PANEL
   Injects a search bar into the navbar (desktop + mobile overlay),
   moves the theme toggle to sit after Register, and powers a
   grouped, keyboard-navigable results dropdown against
   window.RYS_SEARCH_INDEX. Zero markup duplication across pages —
   everything below is built and wired at runtime.
   ══════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  var INDEX = window.RYS_SEARCH_INDEX || [];
  var CATEGORY_ICON = { Page: '⌂', Conference: '⚑', Section: '◈' };
  var CATEGORY_ORDER = ['Conference', 'Page', 'Section'];
  var QUICK_LINKS = ['/upcoming/', '/about/', '/conferences/', '/contact/'];

  // ─── Scoring ───
  function score(entry, qRaw) {
    var q = qRaw.trim().toLowerCase();
    if (!q) return 0;
    var title = entry.title.toLowerCase();
    var desc = (entry.description || '').toLowerCase();
    var tags = entry.tags || [];
    var best = 0;

    if (title === q) best = Math.max(best, 100);
    if (title.indexOf(q) === 0) best = Math.max(best, 85);
    for (var i = 0; i < tags.length; i++) {
      var t = tags[i].toLowerCase();
      if (t === q) best = Math.max(best, 90);
      else if (t.indexOf(q) === 0) best = Math.max(best, 70);
      else if (t.indexOf(q) !== -1) best = Math.max(best, 55);
    }
    if (title.indexOf(q) !== -1) best = Math.max(best, 60);
    if (desc.indexOf(q) !== -1) best = Math.max(best, 35);

    // token-based partial match (handles multi-word queries)
    var qTokens = q.split(/\s+/).filter(Boolean);
    if (qTokens.length > 1) {
      var hitCount = 0;
      var hay = title + ' ' + tags.join(' ') + ' ' + desc;
      qTokens.forEach(function (tok) { if (hay.indexOf(tok) !== -1) hitCount++; });
      if (hitCount === qTokens.length) best = Math.max(best, 50);
    }
    return best;
  }

  function search(q) {
    if (!q.trim()) return [];
    var results = INDEX.map(function (e) { return { entry: e, s: score(e, q) }; })
      .filter(function (r) { return r.s > 0; })
      .sort(function (a, b) { return b.s - a.s; })
      .slice(0, 24)
      .map(function (r) { return r.entry; });
    return results;
  }

  function highlight(text, q) {
    var qt = q.trim();
    if (!qt) return escapeHtml(text);
    var idx = text.toLowerCase().indexOf(qt.toLowerCase());
    if (idx === -1) return escapeHtml(text);
    return escapeHtml(text.slice(0, idx)) + '<mark>' + escapeHtml(text.slice(idx, idx + qt.length)) + '</mark>' + escapeHtml(text.slice(idx + qt.length));
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  // ─── Panel rendering ───
  function groupResults(results) {
    var groups = {};
    results.forEach(function (r) {
      if (!groups[r.category]) groups[r.category] = [];
      groups[r.category].push(r);
    });
    return groups;
  }

  function quickLinksHtml() {
    var map = {
      '/upcoming/': 'Upcoming Conferences',
      '/about/': 'About',
      '/conferences/': 'Conferences',
      '/contact/': 'Contact'
    };
    var rows = QUICK_LINKS.map(function (url) {
      return '<a class="nav-search-row" href="' + url + '" data-url="' + url + '">' +
        '<span class="nav-search-row-icon">→</span>' +
        '<span class="nav-search-row-text"><span class="nav-search-row-title">' + map[url] + '</span></span>' +
        '</a>';
    }).join('');
    return '<div class="nav-search-quicklinks">' +
      '<div class="nav-search-group-label">Quick Links</div>' + rows + '</div>';
  }

  function renderPanel(panel, results, q) {
    panel.innerHTML = '';
    if (!q.trim()) {
      panel.innerHTML = quickLinksHtml();
      return;
    }
    if (!results.length) {
      panel.innerHTML = '<div class="nav-search-empty">No results for “' + escapeHtml(q) + '”</div>' + quickLinksHtml();
      return;
    }
    var groups = groupResults(results);
    var html = '';
    CATEGORY_ORDER.forEach(function (cat) {
      if (!groups[cat] || !groups[cat].length) return;
      html += '<div class="nav-search-group">';
      html += '<div class="nav-search-group-label">' + cat + 's' + '</div>';
      groups[cat].forEach(function (r) {
        html += '<a class="nav-search-row" href="' + r.url + '" data-url="' + r.url + '">' +
          '<span class="nav-search-row-icon">' + (CATEGORY_ICON[r.category] || '→') + '</span>' +
          '<span class="nav-search-row-text">' +
          '<span class="nav-search-row-title">' + highlight(r.title, q) + '</span>' +
          (r.description ? '<span class="nav-search-row-meta">' + escapeHtml(r.description) + '</span>' : '') +
          '</span></a>';
      });
      html += '</div>';
    });
    panel.innerHTML = html;
  }

  // ─── Build one search widget (desktop bar or mobile bar) ───
  function buildWidget(variant) {
    var wrap = document.createElement('div');
    wrap.className = 'nav-search nav-search--' + variant;
    wrap.innerHTML =
      '<span class="nav-search-icon">🔍</span>' +
      '<input class="nav-search-input" type="text" placeholder="Search RYS…" aria-label="Search the site" autocomplete="off" spellcheck="false">' +
      '<div class="nav-search-panel" hidden></div>';
    var input = wrap.querySelector('.nav-search-input');
    var panel = wrap.querySelector('.nav-search-panel');
    var activeIndex = -1;

    function openPanel() {
      renderPanel(panel, search(input.value), input.value);
      panel.hidden = false;
      wrap.classList.add('nav-search--open');
      activeIndex = -1;
    }
    function closePanel() {
      panel.hidden = true;
      wrap.classList.remove('nav-search--open');
      activeIndex = -1;
    }
    function rows() { return Array.prototype.slice.call(panel.querySelectorAll('.nav-search-row')); }
    function setActive(i) {
      var rs = rows();
      rs.forEach(function (r) { r.classList.remove('nav-search-row--active'); });
      if (!rs.length) return;
      activeIndex = (i + rs.length) % rs.length;
      rs[activeIndex].classList.add('nav-search-row--active');
      rs[activeIndex].scrollIntoView({ block: 'nearest' });
    }

    input.addEventListener('input', function () {
      renderPanel(panel, search(input.value), input.value);
      if (panel.hidden) openPanel(); else activeIndex = -1;
    });
    input.addEventListener('focus', openPanel);
    input.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowDown') { e.preventDefault(); if (panel.hidden) openPanel(); setActive(activeIndex + 1); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); if (panel.hidden) openPanel(); setActive(activeIndex - 1); }
      else if (e.key === 'Enter') {
        var rs = rows();
        if (activeIndex >= 0 && rs[activeIndex]) { window.location.href = rs[activeIndex].getAttribute('data-url'); }
        else if (rs.length) { window.location.href = rs[0].getAttribute('data-url'); }
      } else if (e.key === 'Escape') { closePanel(); input.blur(); }
    });
    document.addEventListener('click', function (e) {
      if (!wrap.contains(e.target)) closePanel();
    });

    wrap._openPanel = openPanel;
    wrap._input = input;
    return wrap;
  }

  // ─── Reorder desktop nav: insert search bar at toggle's old slot, move toggle after Register ───
  function wireDesktopNav() {
    var navLinks = document.querySelector('.nav-links');
    if (!navLinks) return;
    var toggleBtn = navLinks.querySelector('.theme-toggle-btn');
    if (!toggleBtn) return;
    var toggleLi = toggleBtn.closest('li');
    if (!toggleLi) return;

    var searchLi = document.createElement('li');
    searchLi.className = 'nav-search-li';
    searchLi.appendChild(buildWidget('desktop'));

    toggleLi.parentNode.insertBefore(searchLi, toggleLi);
    navLinks.appendChild(toggleLi); // move toggle to the end (after Register)
  }

  // ─── Mobile overlay: add a search bar near the top for quick access ───
  function wireMobileNav() {
    var overlay = document.querySelector('.mobile-nav-overlay');
    if (!overlay) return;
    var closeBtn = overlay.querySelector('.mobile-nav-close');
    var widget = buildWidget('mobile');
    if (closeBtn && closeBtn.nextSibling) {
      overlay.insertBefore(widget, closeBtn.nextSibling);
    } else {
      overlay.insertBefore(widget, overlay.firstChild);
    }
  }

  // ─── Global shortcuts: Ctrl/Cmd+K and "/" focus the desktop (or mobile, if open) bar ───
  function wireShortcuts() {
    document.addEventListener('keydown', function (e) {
      var isK = (e.key === 'k' || e.key === 'K') && (e.metaKey || e.ctrlKey);
      var isSlash = e.key === '/' && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA';
      if (!isK && !isSlash) return;
      e.preventDefault();
      var overlay = document.querySelector('.mobile-nav-overlay');
      var visible = overlay && overlay.classList.contains('open');
      var sel = visible ? '.nav-search--mobile .nav-search-input' : '.nav-search--desktop .nav-search-input';
      var input = document.querySelector(sel) || document.querySelector('.nav-search-input');
      if (input) { input.focus(); input.select(); }
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    if (!INDEX.length) return;
    wireDesktopNav();
    wireMobileNav();
    wireShortcuts();
  });
})();
