(function () {
  const page = window.location.pathname.split('/').pop() || 'index.html';
  const isHome = page === 'index.html' || page === '';
  const pre = isHome ? '' : 'index.html'; // prefix for anchor-only links

  // Active state helpers
  function isActive(href) {
    const target = href.split('#')[0].split('/').pop();
    return target && target === page;
  }

  function desktopLink(href, label) {
    const active = isActive(href);
    const cls = active
      ? 'nav-link text-green-700 font-semibold text-base transition-colors'
      : 'nav-link text-gray-700 hover:text-green-700 font-semibold text-base transition-colors';
    const cur = active ? ' aria-current="page"' : '';
    return `<a href="${href}" class="${cls}"${cur}>${label}</a>`;
  }

  function mobileLink(href, icon, label) {
    const active = isActive(href);
    const cls = active
      ? 'flex items-center gap-3 px-4 py-3 rounded-xl bg-green-50 text-green-700 font-medium transition-colors text-sm'
      : 'flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-green-50 text-gray-700 hover:text-green-700 font-medium transition-colors text-sm';
    const cur = active ? ' aria-current="page"' : '';
    return `<li><a href="${href}" onclick="toggleMobileMenu()" class="${cls}"${cur}><i data-lucide="${icon}" class="w-4 h-4"></i>${label}</a></li>`;
  }

  const html = `
    <nav id="navbar" class="fixed top-3 left-0 right-0 z-50 px-4" aria-label="Nawigacja główna">
      <div class="max-w-7xl mx-auto bg-white/95 backdrop-blur-md rounded-2xl shadow-lg border border-gray-100 px-5 py-3 flex items-center justify-between gap-4">

        <!-- Logo -->
        <div class="flex-shrink-0 flex items-center gap-4">
          <a href="index.html" aria-label="OWiT Toruń – strona główna">
            <img src="images/ui/logo owit.png" alt="OWiT Toruń" class="h-16 md:h-20 object-contain" onerror="this.style.display='none'">
          </a>
          <img src="images/ui/logo pfron.png" alt="PFRON – Państwowy Fundusz Rehabilitacji Osób Niepełnosprawnych" class="h-16 md:h-20 object-contain" onerror="this.style.display='none'">
        </div>

        <!-- Linki (desktop) -->
        <ul class="hidden lg:flex items-center gap-7 flex-1 justify-center" role="list">
          <li>${desktopLink(pre + '#o-nas', 'O nas')}</li>
          <li>${desktopLink(isHome ? '#katalog' : 'katalog.html', 'Katalog sprzętu')}</li>
          <li>${desktopLink(pre + '#zespol', 'Zespół')}</li>
          <li>${desktopLink('faq.html', 'FAQ')}</li>

          <!-- Baza wiedzy (Dropdown) -->
          <li class="relative group">
            <button
              class="nav-link flex items-center gap-1 text-gray-700 hover:text-green-700 font-semibold text-base transition-colors focus:outline-none"
              aria-expanded="false" aria-haspopup="true" aria-controls="baza-wiedzy-menu"
              onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();const exp=this.getAttribute('aria-expanded')==='true';this.setAttribute('aria-expanded',String(!exp));this.closest('li').classList.toggle('dropdown-open',!exp);}">
              Baza wiedzy <i data-lucide="chevron-down" class="w-4 h-4 group-hover:rotate-180 transition-transform duration-200"></i>
            </button>
            <div id="baza-wiedzy-menu"
              class="absolute top-full left-1/2 -translate-x-1/2 mt-4 w-60 bg-white rounded-2xl shadow-xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible group-focus-within:opacity-100 group-focus-within:visible transition-all duration-200 transform translate-y-2 group-hover:translate-y-0 group-focus-within:translate-y-0 p-2 z-50">
              <div class="absolute -top-4 left-0 right-0 h-4"></div>
              <a href="regulamin.html" class="block px-4 py-2.5 rounded-xl hover:bg-green-50 text-gray-700 hover:text-green-700 font-medium transition-colors text-sm"><i data-lucide="scroll-text" class="w-4 h-4 inline-block mr-2 -mt-0.5"></i>Regulamin</a>
              <a href="${pre + '#do-pobrania'}" class="block px-4 py-2.5 rounded-xl hover:bg-green-50 text-gray-700 hover:text-green-700 font-medium transition-colors text-sm"><i data-lucide="download" class="w-4 h-4 inline-block mr-2 -mt-0.5"></i>Do pobrania</a>
              <a href="przydatne-linki.html" class="block px-4 py-2.5 rounded-xl hover:bg-green-50 text-gray-700 hover:text-green-700 font-medium transition-colors text-sm"><i data-lucide="link" class="w-4 h-4 inline-block mr-2 -mt-0.5"></i>Przydatne linki</a>
              <a href="media.html" class="block px-4 py-2.5 rounded-xl hover:bg-green-50 text-gray-700 hover:text-green-700 font-medium transition-colors text-sm"><i data-lucide="image" class="w-4 h-4 inline-block mr-2 -mt-0.5"></i>Dla mediów</a>
            </div>
          </li>

          <li>${desktopLink(pre + '#kontakt', 'Kontakt')}</li>
        </ul>

        <!-- Mobile btn -->
        <div class="flex items-center gap-2">
          <button id="mobile-menu-btn" onclick="toggleMobileMenu()"
            class="lg:hidden p-2.5 rounded-xl hover:bg-gray-100 transition-colors"
            aria-label="Otwórz menu mobilne" aria-expanded="false" aria-controls="mob-menu">
            <i data-lucide="menu" class="w-5 h-5 text-gray-700"></i>
          </button>
        </div>
      </div>

      <!-- Menu mobilne -->
      <div id="mob-menu" class="hidden lg:hidden mt-2 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        <ul class="p-3 space-y-1" role="list">
          <li><a href="${pre + '#o-nas'}" onclick="toggleMobileMenu()" class="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-green-50 text-gray-700 hover:text-green-700 font-medium transition-colors text-sm"><i data-lucide="info" class="w-4 h-4"></i>O nas</a></li>
          ${mobileLink(isHome ? '#katalog' : 'katalog.html', 'package', 'Katalog sprzętu')}
          <li><a href="${pre + '#zespol'}" onclick="toggleMobileMenu()" class="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-green-50 text-gray-700 hover:text-green-700 font-medium transition-colors text-sm"><i data-lucide="users" class="w-4 h-4"></i>Zespół</a></li>
          ${mobileLink('faq.html', 'help-circle', 'FAQ')}
          ${mobileLink('jak-wypozyczac.html', 'clipboard-list', 'Jak wypożyczyć')}
          ${mobileLink('technologie-asystujace.html', 'cpu', 'Technologie asystujące')}
          <li role="presentation"><span class="block px-4 py-2 mt-2 text-xs font-bold text-gray-400 uppercase tracking-wider">Baza wiedzy / Do pobrania</span></li>
          ${mobileLink('regulamin.html', 'scroll-text', 'Regulamin')}
          <li><a href="${pre + '#do-pobrania'}" onclick="toggleMobileMenu()" class="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-green-50 text-gray-700 hover:text-green-700 font-medium transition-colors text-sm"><i data-lucide="download" class="w-4 h-4"></i>Do pobrania</a></li>
          ${mobileLink('przydatne-linki.html', 'link', 'Przydatne linki')}
          ${mobileLink('media.html', 'image', 'Dla mediów')}
          <li><a href="${pre + '#kontakt'}" onclick="toggleMobileMenu()" class="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-green-50 text-gray-700 hover:text-green-700 font-medium transition-colors text-sm"><i data-lucide="phone" class="w-4 h-4"></i>Kontakt</a></li>
        </ul>
      </div>
    </nav>
  `;

  document.getElementById('site-header').innerHTML = html;

  // Re-inicjalizacja ikon Lucide po wstrzyknięciu
  if (window.lucide) lucide.createIcons({ attrs: { 'aria-hidden': 'true' } });

  // Mobile menu toggle
  window.toggleMobileMenu = function () {
    const menu = document.getElementById('mob-menu');
    const btn = document.getElementById('mobile-menu-btn');
    const isHidden = menu.classList.toggle('hidden');
    btn.setAttribute('aria-expanded', String(!isHidden));
  };

  window.closeMobileMenu = function () {
    const menu = document.getElementById('mob-menu');
    const btn = document.getElementById('mobile-menu-btn');
    if (menu) menu.classList.add('hidden');
    if (btn) btn.setAttribute('aria-expanded', 'false');
  };

  // Dropdown klawiatura (aria-expanded)
  document.addEventListener('click', function (e) {
    const btn = e.target.closest('[aria-controls="baza-wiedzy-menu"]');
    if (btn) {
      const expanded = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', String(!expanded));
    }
  });
})();
