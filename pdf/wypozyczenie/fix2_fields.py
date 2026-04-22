"""
Drugi przebieg korekt:
1. dane-beneficjenta.pdf — OzN sekcja → prefix ozn_, opiekun → shared names
   (żeby dane z wniosek-oozn poprawnie zaciągały się do PFRON-a)
2. Tab order — /Tabs /R na wszystkich stronach wniosek-ozn i wniosek-oozn
   (fix: niemożność tab do PESEL, błędny skok do kolejnego dokumentu)
"""

import pikepdf
from pikepdf import Pdf, String, Name, Array
from pathlib import Path

BASE = Path(__file__).parent

FIELD_RENAMES = {
    # ── dane-beneficjenta.pdf ─────────────────────────────────────────────────
    # Beneficjent PFRON = zawsze OzN → prefix ozn_
    # Opiekun w dane-beneficjenta = wypożyczający (imie_nazwisko, pesel, telefon)
    ("dane-beneficjenta.pdf", "imie_nazwisko"):   "ozn_imie_nazwisko",
    ("dane-beneficjenta.pdf", "pesel"):            "ozn_pesel",
    ("dane-beneficjenta.pdf", "telefon"):          "ozn_telefon",
    ("dane-beneficjenta.pdf", "adres"):            "ozn_adres",
    ("dane-beneficjenta.pdf", "email"):            "ozn_email",
    ("dane-beneficjenta.pdf", "opiekun_imie"):     "imie_nazwisko",
    ("dane-beneficjenta.pdf", "opiekun_pesel"):    "pesel",
    ("dane-beneficjenta.pdf", "opiekun_telefon"):  "telefon",
}

TAB_ORDER_FILES = [
    "wniosek-ozn.pdf",
    "wniosek-oozn.pdf",
]


def fix_field_names(pdf_path: Path, renames: dict[str, str]) -> int:
    """Collect-then-apply rename (bezpieczne przy cyklicznych zmianach)."""
    with Pdf.open(pdf_path, allow_overwriting_input=True) as pdf:
        if "/AcroForm" not in pdf.Root:
            return 0
        acroform = pdf.Root.AcroForm
        if "/Fields" not in acroform:
            return 0

        to_rename = []

        def walk(fields):
            for field in fields:
                if "/T" in field:
                    old = str(field.T)
                    if old in renames:
                        to_rename.append((field, renames[old]))
                if "/Kids" in field:
                    walk(field.Kids)

        walk(acroform.Fields)
        for field, new_name in to_rename:
            field.T = String(new_name)
        pdf.save(pdf_path)
    return len(to_rename)


def fix_tab_order(pdf_path: Path) -> int:
    """Ustawia /Tabs /R (row order) na każdej stronie — tab podąża za wizualną pozycją."""
    with Pdf.open(pdf_path, allow_overwriting_input=True) as pdf:
        pages_fixed = 0
        for page in pdf.pages:
            page["/Tabs"] = Name("/R")
            pages_fixed += 1
        pdf.save(pdf_path)
    return pages_fixed


def main():
    print("Korekta #2 pól i kolejności tab\n" + "=" * 40)

    # 1. Rename pól w dane-beneficjenta
    by_file: dict[str, dict[str, str]] = {}
    for (filename, old_name), new_name in FIELD_RENAMES.items():
        by_file.setdefault(filename, {})[old_name] = new_name

    for filename, renames in sorted(by_file.items()):
        path = BASE / filename
        if not path.exists():
            print(f"  POMINIĘTO (brak): {filename}")
            continue
        n = fix_field_names(path, renames)
        print(f"  {filename}: {n} pól przemianowanych")

    print()

    # 2. Tab order fix
    for filename in TAB_ORDER_FILES:
        path = BASE / filename
        if not path.exists():
            print(f"  POMINIĘTO (brak): {filename}")
            continue
        n = fix_tab_order(path)
        print(f"  {filename}: /Tabs /R ustawiony na {n} stronach")

    print("\nGotowe.")


if __name__ == "__main__":
    main()
