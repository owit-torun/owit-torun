# Reguły Firebase dla modułu Wskaźniki

Strona `wskazniki.html` zapisuje dane w Realtime Database w węźle `indicators`.
Dane zawierają imiona i nazwiska beneficjentów, więc **koniecznie** dodaj poniższe reguły
w konsoli Firebase (Realtime Database → Reguły), obok istniejących węzłów.
Bez nich dostęp zależy od dotychczasowych reguł bazy.

```json
"indicators": {
  "entries": {
    ".read": "auth != null && auth.token.email == 'admin@owit.pl'",
    "$key": {
      ".read": "auth != null && $key == auth.token.email.replace('@','_').replace('.','_')",
      ".write": "auth != null && $key == auth.token.email.replace('@','_').replace('.','_')"
    }
  },
  "network": {
    ".read": "auth != null && auth.token.email == 'admin@owit.pl'",
    "$key": {
      ".read": "auth != null && $key == auth.token.email.replace('@','_').replace('.','_')",
      ".write": "auth != null && $key == auth.token.email.replace('@','_').replace('.','_')"
    }
  },
  "links": {
    ".read": "auth != null && auth.token.email == 'admin@owit.pl'",
    "$key": {
      ".read": "auth != null && $key == auth.token.email.replace('@','_').replace('.','_')",
      ".write": "auth != null && $key == auth.token.email.replace('@','_').replace('.','_')"
    }
  },
  "people": {
    ".read": "auth != null",
    "$h": {
      ".write": "auth != null && (!data.exists() || data.child('by').val() == auth.token.email.replace('@','_').replace('.','_'))",
      ".validate": "newData.hasChildren(['by','entryId']) && newData.child('by').val() == auth.token.email.replace('@','_').replace('.','_')"
    }
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

Węzeł `people` to wspólny indeks osób: kluczem jest skrót (SHA-256) imienia i nazwiska, wartością tylko
`{by, entryId}`, bez nazwisk jawnym tekstem. Dzięki niemu „Nowy PESEL” w formularzu sprawdza całą bazę, a nie tylko
wpisy zalogowanego pracownika. Zapis działa na zasadzie „pierwszy wygrywa”: cudzego rekordu nie da się nadpisać.
Bez tych reguł formularz działa, ale sprawdza tylko własne wpisy. Indeks uzupełnia się sam przy wejściu na stronę
(admin uzupełnia wszystkie osoby, pracownik swoje). Imienników rozróżnia pole „Dopisek” w formularzu.

Dodatkowo pracownik czyta swoje wypożyczenia z `history` (zapytanie po `addedBy`).
Jeśli `history` jest dziś czytelne tylko dla admina, strona pokaże ostrzeżenie i policzy
tylko aktualnie wypożyczone urządzenia. Rozwiązanie: w `history` dodaj `".indexOn": ["addedBy"]`
i zezwól na odczyt zalogowanym (`auth != null`) albo ogranicz do własnych wpisów.

Lista kont z dostępem: stała `ALLOWED` w `wskazniki.html` (i ta sama w `katalog.html`, przycisk „Wskaźniki”).
