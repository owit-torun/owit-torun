"""
Skrypt korekcyjny pól formularzy PDF — poprawia błędy z pierwszego przebiegu.

Zidentyfikowane problemy:
1. umowa.pdf — pola fill_2/3/4/1 miały odwróconą kolejność wizualną;
   po pierwszym przejściu imie_nazwisko trafia w PRACOWNIKA OWiT zamiast w wypożyczającego
2. wniosek-oozn.pdf — dane OzN (sekcja 1) powinny mieć prefix ozn_,
   a dane opiekuna (sekcja 2) powinny mieć wspólne nazwy (imie_nazwisko, pesel itd.)
   bo to opiekun podpisuje umowę i jest „osobą wypożyczającą"
3. Daty niezależne: protokol-odbioru (data zwrotu ≠ data wypożyczenia),
   wniosek-ozn, wniosek-oozn
4. Kolizje generycznych fill_N między protokolem odbioru a przekazania
"""

import pikepdf
from pikepdf import Pdf, String, Name
from pathlib import Path

BASE = Path(__file__).parent

# Mapowanie: (plik, AKTUALNA nazwa) -> NOWA nazwa
# Wykonywa się jednocześnie (collect-then-apply), więc cyrkularne zmiany są bezpieczne
FIXES = {
    # ── umowa.pdf ─────────────────────────────────────────────────────────
    # Wizualna kolejność pól ≠ kolejność fill_N; po pierwszym przejściu:
    #   imie_nazwisko  → wizualnie: pracownik OWiT   (błąd → popraw)
    #   adres          → wizualnie: imię i nazwisko wypożyczającego (błąd)
    #   rodzaj_ta      → wizualnie: adres zamieszkania (błąd)
    #   pracownik_owit → wizualnie: rodzaj TA (błąd)
    ("umowa.pdf", "imie_nazwisko"):  "pracownik_owit",
    ("umowa.pdf", "adres"):          "imie_nazwisko",
    ("umowa.pdf", "rodzaj_ta"):      "adres",
    ("umowa.pdf", "pracownik_owit"): "rodzaj_ta",
    # pesel i pozostałe bez zmian

    # ── wniosek-oozn.pdf ──────────────────────────────────────────────────
    # Sekcja 1 (OzN — osoba z niepełnosprawnością) → prefix ozn_
    # Sekcja 2 (opiekun/przedstawiciel = faktyczny wypożyczający) → wspólne nazwy
    ("wniosek-oozn.pdf", "imie_nazwisko"):   "ozn_imie_nazwisko",
    ("wniosek-oozn.pdf", "adres"):           "ozn_adres",
    ("wniosek-oozn.pdf", "pesel"):           "ozn_pesel",
    ("wniosek-oozn.pdf", "telefon"):         "ozn_telefon",
    ("wniosek-oozn.pdf", "email"):           "ozn_email",
    ("wniosek-oozn.pdf", "opiekun_imie"):    "imie_nazwisko",
    ("wniosek-oozn.pdf", "opiekun_adres"):   "adres",
    ("wniosek-oozn.pdf", "opiekun_pesel"):   "pesel",
    ("wniosek-oozn.pdf", "opiekun_telefon"): "telefon",
    ("wniosek-oozn.pdf", "opiekun_email"):   "email",
    # data podpisu niezależna (wniosek podpisywany osobno)
    ("wniosek-oozn.pdf", "data"):            "data_wniosek",

    # ── wniosek-ozn.pdf ───────────────────────────────────────────────────
    # OzN jest bezpośrednim wypożyczającym — wspólne nazwy zostają
    # Tylko data staje się niezależna
    ("wniosek-ozn.pdf", "data"):             "data_wniosek",

    # ── protokol-odbioru.pdf ──────────────────────────────────────────────
    # Data odbioru (zwrotu) ≠ data wypożyczenia → niezależna
    ("protokol-odbioru.pdf", "data"):        "data_odbioru",
    # Generyczne fill_N → unikalne nazwy (zapobiega kolizji z protokol-przekazania)
    ("protokol-odbioru.pdf", "fill_8"):      "odbioru_rodzaj_1",
    ("protokol-odbioru.pdf", "fill_9"):      "odbioru_ilosc_1",
    ("protokol-odbioru.pdf", "fill_10"):     "odbioru_kompletnosc_1",
    ("protokol-odbioru.pdf", "fill_12"):     "odbioru_rodzaj_2",
    ("protokol-odbioru.pdf", "fill_13"):     "odbioru_ilosc_2",
    ("protokol-odbioru.pdf", "fill_15"):     "odbioru_kompletnosc_2",
    ("protokol-odbioru.pdf", "fill_16"):     "odbioru_dok_2",
    ("protokol-odbioru.pdf", "fill_17"):     "odbioru_stan_2",
    ("protokol-odbioru.pdf", "fill_19"):     "odbioru_rodzaj_3",
    ("protokol-odbioru.pdf", "fill_20"):     "odbioru_ilosc_3",
    ("protokol-odbioru.pdf", "fill_22"):     "odbioru_kompletnosc_3",
    ("protokol-odbioru.pdf", "fill_23"):     "odbioru_dok_3",
    ("protokol-odbioru.pdf", "fill_24"):     "odbioru_stan_3",

    # ── protokol-przekazania-urzadzenia.pdf ────────────────────────────────
    # Generyczne fill_N → unikalne nazwy (zapobiega kolizji z protokol-odbioru)
    ("protokol-przekazania-urzadzenia.pdf", "fill_12"): "przek_zasilacz",
    ("protokol-przekazania-urzadzenia.pdf", "fill_13"): "przek_kabel",
    ("protokol-przekazania-urzadzenia.pdf", "fill_14"): "przek_etui",
    ("protokol-przekazania-urzadzenia.pdf", "fill_15"): "przek_torba",
    ("protokol-przekazania-urzadzenia.pdf", "fill_16"): "przek_instrukcja_stan",
    ("protokol-przekazania-urzadzenia.pdf", "fill_17"): "przek_dodatkowe",
    ("protokol-przekazania-urzadzenia.pdf", "fill_19"): "przek_instrukcja_opis_1",
    ("protokol-przekazania-urzadzenia.pdf", "fill_21"): "przek_instrukcja_opis_2",
    # data przekazania = ta sama co umowy → zostaje jako "data" (dzielona)
}


def fix_fields_in_pdf(pdf_path: Path, renames: dict[str, str]) -> int:
    if not renames:
        return 0

    with Pdf.open(pdf_path, allow_overwriting_input=True) as pdf:
        if "/AcroForm" not in pdf.Root:
            return 0
        acroform = pdf.Root.AcroForm
        if "/Fields" not in acroform:
            return 0

        # Faza 1: zbierz wszystkie pola do zmiany (nie modyfikuj jeszcze)
        to_rename = []

        def walk(fields):
            for field_ref in fields:
                field = field_ref
                if "/T" in field:
                    old_name = str(field.T)
                    if old_name in renames:
                        to_rename.append((field, renames[old_name]))
                if "/Kids" in field:
                    walk(field.Kids)

        walk(acroform.Fields)

        # Faza 2: zastosuj wszystkie zmiany naraz (bezpieczne przy cyrkulacji)
        for field, new_name in to_rename:
            field.T = String(new_name)

        pdf.save(pdf_path)

    return len(to_rename)


def main():
    by_file: dict[str, dict[str, str]] = {}
    for (filename, old_name), new_name in FIXES.items():
        by_file.setdefault(filename, {})[old_name] = new_name

    print("Korekta nazw pól formularzy PDF\n" + "=" * 40)
    total = 0
    for filename, renames in sorted(by_file.items()):
        path = BASE / filename
        if not path.exists():
            print(f"  POMINIĘTO (brak): {filename}")
            continue
        n = fix_fields_in_pdf(path, renames)
        print(f"  {filename}: {n} pól poprawionych")
        total += n

    print(f"\nRazem: {total} pól poprawionych.")


if __name__ == "__main__":
    main()
