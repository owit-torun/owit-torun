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
  "targets": {
    ".read": "auth != null && auth.token.email == 'admin@owit.pl'",
    ".write": "auth != null && auth.token.email == 'admin@owit.pl'",
    "$key": {
      ".read": "auth != null && $key == auth.token.email.replace('@','_').replace('.','_')"
    }
  }
}
```

Dodatkowo pracownik czyta swoje wypożyczenia z `history` (zapytanie po `addedBy`).
Jeśli `history` jest dziś czytelne tylko dla admina, strona pokaże ostrzeżenie i policzy
tylko aktualnie wypożyczone urządzenia. Rozwiązanie: w `history` dodaj `".indexOn": ["addedBy"]`
i zezwól na odczyt zalogowanym (`auth != null`) albo ogranicz do własnych wpisów.

Lista kont z dostępem: stała `ALLOWED` w `wskazniki.html` (i ta sama w `katalog.html`, przycisk „Wskaźniki”).
