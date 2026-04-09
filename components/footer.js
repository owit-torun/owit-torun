(function () {
  const html = `
    <footer class="bg-green-900 text-white pt-16 pb-10 px-4" role="contentinfo">
      <div class="max-w-7xl mx-auto">
        <div class="grid md:grid-cols-3 gap-10 mb-12">

          <!-- Logo + opis -->
          <div>
            <div class="flex items-center gap-4 mb-5">
              <img src="images/ui/logo owit.png" alt="OWiT Toruń" class="h-14 object-contain brightness-0 invert" onerror="this.style.display='none'">
              <img src="images/ui/logo pfron.png" alt="PFRON" class="h-14 object-contain brightness-0 invert" onerror="this.style.display='none'">
            </div>
            <p class="text-green-300 text-sm leading-relaxed">
              Ośrodek Wsparcia i Testów w&nbsp;Toruniu.
              Wspieramy osoby z&nbsp;niepełnosprawnościami poprzez nowoczesne technologie asystujące.
            </p>
            <div class="flex items-center gap-3 mt-5">
              <a href="https://www.facebook.com/owit.torun" target="_blank" rel="noopener noreferrer"
                class="w-9 h-9 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center transition-colors"
                aria-label="Facebook OWiT Toruń (otwiera w nowej karcie)">
                <img loading="lazy" src="images/ui/facebook.png" alt="Facebook" class="w-6 h-6 object-contain">
              </a>
            </div>
          </div>

          <!-- Nawigacja -->
          <nav aria-label="Nawigacja w stopce">
            <p class="font-bold text-green-200 mb-5 uppercase text-xs tracking-widest">Nawigacja</p>
            <ul class="space-y-2.5">
              <li><a href="index.html" class="text-green-300 hover:text-white transition-colors text-sm flex items-center gap-2"><i data-lucide="chevron-right" class="w-3.5 h-3.5"></i>Strona główna</a></li>
              <li><a href="index.html#o-nas" class="text-green-300 hover:text-white transition-colors text-sm flex items-center gap-2"><i data-lucide="chevron-right" class="w-3.5 h-3.5"></i>O nas</a></li>
              <li><a href="katalog.html" class="text-green-300 hover:text-white transition-colors text-sm flex items-center gap-2"><i data-lucide="chevron-right" class="w-3.5 h-3.5"></i>Katalog sprzętu</a></li>
              <li><a href="faq.html" class="text-green-300 hover:text-white transition-colors text-sm flex items-center gap-2"><i data-lucide="chevron-right" class="w-3.5 h-3.5"></i>FAQ</a></li>
              <li><a href="jak-wypozyczac.html" class="text-green-300 hover:text-white transition-colors text-sm flex items-center gap-2"><i data-lucide="chevron-right" class="w-3.5 h-3.5"></i>Jak wypożyczyć sprzęt</a></li>
              <li><a href="technologie-asystujace.html" class="text-green-300 hover:text-white transition-colors text-sm flex items-center gap-2"><i data-lucide="chevron-right" class="w-3.5 h-3.5"></i>Technologie asystujące</a></li>
              <li><a href="przydatne-linki.html" class="text-green-300 hover:text-white transition-colors text-sm flex items-center gap-2"><i data-lucide="chevron-right" class="w-3.5 h-3.5"></i>Przydatne linki</a></li>
              <li><a href="media.html" class="text-green-300 hover:text-white transition-colors text-sm flex items-center gap-2"><i data-lucide="chevron-right" class="w-3.5 h-3.5"></i>Dla mediów</a></li>
              <li><a href="regulamin.html" class="text-green-300 hover:text-white transition-colors text-sm flex items-center gap-2"><i data-lucide="chevron-right" class="w-3.5 h-3.5"></i>Regulamin</a></li>
              <li><a href="dostepnosc.html" class="text-green-300 hover:text-white transition-colors text-sm flex items-center gap-2"><i data-lucide="chevron-right" class="w-3.5 h-3.5"></i>Dostępność</a></li>
              <li><a href="index.html#kontakt" class="text-green-300 hover:text-white transition-colors text-sm flex items-center gap-2"><i data-lucide="chevron-right" class="w-3.5 h-3.5"></i>Kontakt</a></li>
            </ul>
          </nav>

          <!-- Kontakt -->
          <div>
            <p class="font-bold text-green-200 mb-5 uppercase text-xs tracking-widest">Kontakt</p>
            <ul class="space-y-3.5">
              <li class="flex items-center gap-3 text-green-300 text-sm">
                <i data-lucide="phone" class="w-4 h-4 flex-shrink-0 text-green-400"></i>
                <a href="tel:+48697677027" class="hover:text-white transition-colors">+48 697 677 027</a>
              </li>
              <li class="flex items-center gap-3 text-green-300 text-sm">
                <i data-lucide="mail" class="w-4 h-4 flex-shrink-0 text-green-400"></i>
                <a href="mailto:owit.torun@gmail.com" class="hover:text-white transition-colors">owit.torun@gmail.com</a>
              </li>
              <li class="flex items-start gap-3 text-green-300 text-sm">
                <i data-lucide="map-pin" class="w-4 h-4 flex-shrink-0 mt-0.5 text-green-400"></i>
                <span>ul. Juliana Fałata 88/90<br>87-100 Toruń</span>
              </li>
            </ul>
          </div>
        </div>

        <!-- Bottom bar -->
        <div class="border-t border-green-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-2 text-sm text-green-300">
          <p>© 2026 OWiT Toruń – Ośrodek Wsparcia i Testów</p>
          <p class="text-green-400 text-xs">projekt i wykonanie: <span class="text-green-200 font-medium">Adrian Kędzior</span></p>
        </div>
      </div>
    </footer>
  `;

  document.getElementById('site-footer').outerHTML = html;

  // Re-inicjalizacja ikon Lucide po wstrzyknięciu
  if (window.lucide) lucide.createIcons({ attrs: { 'aria-hidden': 'true' } });
})();
