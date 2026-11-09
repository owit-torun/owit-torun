# Reguły Firebase dla modułu Wskaźniki

Strona `wskazniki.html` zapisuje dane w Realtime Database w węźle `indicators`.
Dane zawierają imiona i nazwiska beneficjentów, więc **koniecznie** dodaj poniższe reguły
w konsoli Firebase (Realtime Database → Reguły), obok istniejących węzłów.
Bez nich dostęp zależy od dotychczasowych reguł bazy.

```json
"indicators": {
  "entries": {
    ".read": "auth != null && auth.token.email == 'admin@owit.pl'",
    ".write": "auth != null && auth.token.email == 'admin@owit.pl'",
    "$key": {
      ".read": "auth != null && $key == auth.token.email.replace('@','_').replace('.','_')",
      ".write": "auth != null && $key == auth.token.email.replace('@','_').replace('.','_')"
    }
  },
  "network": {
    ".read": "auth != null && auth.token.email == 'admin@owit.pl'",
    ".write": "auth != null && auth.token.email == 'admin@owit.pl'",
    "$key": {
      ".read": "auth != null && $key == auth.token.email.replace('@','_').replace('.','_')",
      ".write": "auth != null && $key == auth.token.email.replace('@','_').replace('.','_')"
    }
  },
  "links": {
    ".read": "auth != null && auth.token.email == 'admin@owit.pl'",
    ".write": "auth != null && auth.token.email == 'admin@owit.pl'",
    "$key": {
      ".read": "auth != null && $key == auth.token.email.replace('@','_').replace('.','_')",
      ".write": "auth != null && $key == auth.token.email.replace('@','_').replace('.','_')"
    }
  },
  "rentalExcl": {
    ".read": "auth != null && auth.token.email == 'admin@owit.pl'",
    ".write": "auth != null && auth.token.email == 'admin@owit.pl'",
    "$key": { ".read": "auth != null && $key == auth.token.email.replace('@','_').replace('.','_')" }
  },
  "staff": {
    "$k": { ".read": "auth != null && $k == auth.token.email.replace('@','_').replace('.','_').replace('.','_')" }
  },
  "persons": {
    ".read": "root.child('indicators').child('staff').child(auth.token.email.replace('@','_').replace('.','_').replace('.','_')).val() === true",
    "$id": {
      ".write": "root.child('indicators').child('staff').child(auth.token.email.replace('@','_').replace('.','_').replace('.','_')).val() === true",
      ".validate": "newData.hasChildren(['name','createdBy']) && newData.child('name').isString() && newData.child('name').val().length < 200"
    }
  },
  "personKeys": {
    ".read": "root.child('indicators').child('staff').child(auth.token.email.replace('@','_').replace('.','_').replace('.','_')).val() === true",
    "$h": { ".write": "(root.child('indicators').child('staff').child(auth.token.email.replace('@','_').replace('.','_').replace('.','_')).val() === true) && (!data.exists() || !newData.exists())" }
  },
  "targets": {
    ".read": "auth != null && auth.token.email == 'admin@owit.pl'",
    ".write": "auth != null && auth.token.email == 'admin@owit.pl'",
    "$key": {
      ".read": "auth != null && $key == auth.token.email.replace('@','_').replace('.','_')"
    }
  }
}
```

## Edycja przez administratora

Admin (`admin@owit.pl`) edytuje i usuwa wpisy każdego pracownika (węzły `entries`, `network`, `links`) oraz wyłącza
wypożyczenia z katalogu ze wskaźnika (`rentalExcl/{konto}/{wypożyczenie}: true`). Wymaga to powyższych reguł `.write`
na poziomie tych węzłów. Wyłączenie nie zmienia historii w katalogu, tylko przestaje liczyć wypożyczenie do wskaźnika
(można je przywrócić). Wypożyczenie wpisane przez pomyłkę i „zwrócone” w katalogu trafia do historii, więc liczy się,
dopóki admin go nie wyłączy.

## Rejestr osób (`staff`, `persons`, `personKeys`)

Każdy beneficjent ma jeden trwały `personId` w `indicators/persons` (imię i nazwisko, dopisek, kto i kiedy dodał).
Wpisy w `indicators/entries` zawierają `personId`, więc nazwisko można poprawić (przycisk „Dane osoby” na karcie
beneficjenta) bez utraty historii. „Nowy PESEL” ustala się sam: dostaje go wpis, który jako pierwszy tworzy osobę w OWiT.

- `personKeys/{skrót}` → `personId` to indeks wyszukiwania po imieniu i nazwisku. Reguła pozwala tylko **utworzyć** klucz
  (nie nadpisać), a aplikacja tworzy go transakcją. Dzięki temu dwóch pracowników dodających tę samą nową osobę
  w tej samej chwili dostanie ten sam `personId`, a „Nowy PESEL” tylko jeden z nich.
- **Dane w rejestrze to jawne imiona i nazwiska osób korzystających ze wsparcia.** Nie są zahaszowane ani zanonimizowane.
  Chroni je wyłącznie lista `indicators/staff`: odczyt i zapis mają tylko wymienione w niej konta, a nie każdy zalogowany
  użytkownik projektu. Skrót w `personKeys` to tylko klucz wyszukiwania (prefiks jest w kodzie strony), nie zabezpieczenie.
- **Lista `staff` ustawiana ręcznie w konsoli Firebase** (Realtime Database → Dane → `indicators/staff`): dla każdego konta
  dodaj klucz `adres_owit_pl` (kropki i @ zamienione na `_`) z wartością `true`, także dla `admin@owit.pl`.
  Przykład: `"adrian_owit_pl": true`. Bez wpisu konto nie widzi rejestru, a formularz wraca do ręcznego pola „Nowy PESEL”
  (bez ochrony przed duplikatami).
- Stare wpisy (bez `personId`) dostają go automatycznie, gdy pracownik wejdzie na stronę. Osoby sprzed wdrożenia
  aplikacji dodaje admin w zakładce „Import osób”.
- Węzeł `indicators/people` z poprzedniej wersji (skróty bez nazwisk) nie jest już używany. Można go usunąć w konsoli.

Dodatkowo pracownik czyta swoje wypożyczenia z `history` (zapytanie po `addedBy`).
Jeśli `history` jest dziś czytelne tylko dla admina, strona pokaże ostrzeżenie i policzy
tylko aktualnie wypożyczone urządzenia. Rozwiązanie: w `history` dodaj `".indexOn": ["addedBy"]`
i zezwól na odczyt zalogowanym (`auth != null`) albo ogranicz do własnych wpisów.

Lista kont z dostępem: stała `ALLOWED` w `wskazniki.html` (i ta sama w `katalog.html`, przycisk „Wskaźniki”).
