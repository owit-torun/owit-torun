"""
Jednorazowy skrypt do ujednolicenia nazw pól formularzy PDF.
Po uruchomieniu wszystkie dokumenty będą miały te same nazwy dla wspólnych danych,
dzięki czemu po scaleniu wystarczy wpisać dane raz.

Mapowanie nazw wspólnych pól:
  imie_nazwisko       — imię i nazwisko beneficjenta
  pesel               — PESEL beneficjenta
  adres               — adres zamieszkania beneficjenta
  telefon             — numer telefonu beneficjenta
  email               — adres email beneficjenta
  nr_umowy            — numer umowy
  nr_ewidencyjny      — numer ewidencyjny sprzętu
  rodzaj_ta           — rodzaj technologii asystującej
  data                — data dokumentu
  pracownik_owit      — imię i nazwisko pracownika OWiT
  opiekun_imie        — imię i nazwisko opiekuna/przedstawiciela
  opiekun_pesel       — PESEL opiekuna
  opiekun_adres       — adres opiekuna
  opiekun_telefon     — telefon opiekuna
  opiekun_email       — email opiekuna
"""

import pikepdf
from pikepdf import Pdf, Dictionary, Name, String
from pathlib import Path

BASE = Path(__file__).parent

# Mapowanie: (plik, stara_nazwa) -> nowa_nazwa
RENAMES = {
    # ── umowa.pdf ──────────────────────────────────────────────────────────
    ("umowa.pdf",         "fill_1"):                       "pracownik_owit",
    ("umowa.pdf",         "fill_2"):                       "imie_nazwisko",
    ("umowa.pdf",         "fill_3"):                       "adres",
    ("umowa.pdf",         "PESEL"):                        "pesel",
    ("umowa.pdf",         "fill_4"):                       "rodzaj_ta",
    ("umowa.pdf",         "o numerze ewidencyjnym"):       "nr_ewidencyjny",
    ("umowa.pdf",         "zgodnie z jej przeznaczeniem"): "okres_wypozyczenia",
    ("umowa.pdf",         "numer"):                        "nr_umowy",
    ("umowa.pdf",         "Data"):                         "data",

    # ── dane-beneficjenta.pdf ──────────────────────────────────────────────
    ("dane-beneficjenta.pdf", "fill_1"):                              "imie_nazwisko",
    ("dane-beneficjenta.pdf", "fill_2"):                              "pesel",
    ("dane-beneficjenta.pdf", "fill_3"):                              "telefon",
    ("dane-beneficjenta.pdf", "Miejsce zamieszkania nazwa miasta czy wsi"): "adres",
    ("dane-beneficjenta.pdf", "Adres email opcjonalnie"):             "email",
    ("dane-beneficjenta.pdf", "fill_6"):                              "opiekun_imie",
    ("dane-beneficjenta.pdf", "Pesel opiekuna prawnego"):             "opiekun_pesel",
    ("dane-beneficjenta.pdf", "Nr telefonu opiekuna prawnego"):       "opiekun_telefon",
    ("dane-beneficjenta.pdf", "fill_9"):                              "wyksztalcenie",
    ("dane-beneficjenta.pdf", "fill_10"):                             "stopien_niepelnosprawnosci",
    ("dane-beneficjenta.pdf", "fill_11"):                             "rodzaj_niepelnosprawnosci",
    ("dane-beneficjenta.pdf", "fill_12"):                             "niepelnosprawnosc_od",
    ("dane-beneficjenta.pdf", "fill_13"):                             "orzeczenie_wazne_do",

    # ── protokol-odbioru.pdf ───────────────────────────────────────────────
    ("protokol-odbioru.pdf", "Data odbioru"):    "data",
    ("protokol-odbioru.pdf", "fill_5"):          "imie_nazwisko",
    ("protokol-odbioru.pdf", "fill_6"):          "nr_umowy",
    ("protokol-odbioru.pdf", "Nr umowy"):        "nr_umowy_2",   # duplikat w PDF, osobne pole
    ("protokol-odbioru.pdf", "Imię i nazwisko"): "pracownik_owit",
    ("protokol-odbioru.pdf", "Data"):            "data_podpisu",

    # ── protokol-przekazania-urzadzenia.pdf ────────────────────────────────
    ("protokol-przekazania-urzadzenia.pdf", "fill_1"):           "nr_umowy",
    ("protokol-przekazania-urzadzenia.pdf", "fill_3"):           "imie_nazwisko",
    ("protokol-przekazania-urzadzenia.pdf", "Numer ewidencyjny"): "nr_ewidencyjny",
    ("protokol-przekazania-urzadzenia.pdf", "fill_5"):           "nazwa_sprzetu",
    ("protokol-przekazania-urzadzenia.pdf", "z dnia"):           "data",

    # ── wniosek-ozn.pdf (osoba z niepełnosprawnością) ─────────────────────
    ("wniosek-ozn.pdf", "Imię i Nazwisko OzN"):  "imie_nazwisko",
    ("wniosek-ozn.pdf", "PESEL"):                "pesel",
    ("wniosek-ozn.pdf", "Adres zamieszkania"):   "adres",
    ("wniosek-ozn.pdf", "Numer telefonu"):       "telefon",
    ("wniosek-ozn.pdf", "Adres email"):          "email",
    ("wniosek-ozn.pdf", "Rodzaj technologii"):   "rodzaj_ta",
    ("wniosek-ozn.pdf", "Data"):                 "data",

    # ── wniosek-oozn.pdf (opiekun osoby z niepełnosprawnością) ────────────
    ("wniosek-oozn.pdf", "Imię i Nazwisko"):      "imie_nazwisko",
    ("wniosek-oozn.pdf", "PESEL"):                "pesel",
    ("wniosek-oozn.pdf", "Adres zamieszkania"):   "adres",
    ("wniosek-oozn.pdf", "Numer telefonu"):       "telefon",
    ("wniosek-oozn.pdf", "Adres email"):          "email",
    ("wniosek-oozn.pdf", "PESEL1"):               "opiekun_pesel",
    ("wniosek-oozn.pdf", "Adres zamieszkania_2"): "opiekun_adres",
    ("wniosek-oozn.pdf", "Numer telefonu_2"):     "opiekun_telefon",
    ("wniosek-oozn.pdf", "Adres email_2"):        "opiekun_email",
    ("wniosek-oozn.pdf", "Tekst1"):               "opiekun_imie",
    ("wniosek-oozn.pdf", "Rodzaj TA"):            "rodzaj_ta",
    ("wniosek-oozn.pdf", "Data2_af_date"):        "data",
}


def rename_fields_in_pdf(pdf_path: Path, renames: dict[str, str]) -> int:
    """Zmienia nazwy pól w jednym PDF. Zwraca liczbę zmienionych pól."""
    if not renames:
        return 0

    changed = 0
    with Pdf.open(pdf_path, allow_overwriting_input=True) as pdf:
        if "/AcroForm" not in pdf.Root:
            return 0
        acroform = pdf.Root.AcroForm
        if "/Fields" not in acroform:
            return 0

        def walk(fields):
            nonlocal changed
            for field_ref in fields:
                field = field_ref
                if "/T" in field:
                    old_name = str(field.T)
                    if old_name in renames:
                        field.T = String(renames[old_name])
                        changed += 1
                if "/Kids" in field:
                    walk(field.Kids)

        walk(acroform.Fields)
        pdf.save(pdf_path)

    return changed


def main():
    # Grupuj po pliku
    by_file: dict[str, dict[str, str]] = {}
    for (filename, old_name), new_name in RENAMES.items():
        by_file.setdefault(filename, {})[old_name] = new_name

    print("Zmiana nazw pól formularzy PDF\n" + "=" * 40)
    total = 0
    for filename, renames in sorted(by_file.items()):
        path = BASE / filename
        if not path.exists():
            print(f"  POMINIĘTO (brak pliku): {filename}")
            continue
        n = rename_fields_in_pdf(path, renames)
        print(f"  {filename}: {n} pól zmienionych")
        total += n

    print(f"\nRazem: {total} pól zmienionych.")
    print("rodo.pdf — brak pól formularza, nie wymaga zmian.")


if __name__ == "__main__":
    main()
