/**
 * data/battery-rules.js
 * Reguły ładowania sprzętu (zakładka „Ładowanie” w panelu pracownika, katalog.html).
 * Klucze w `groups` to nazwy grup z data/equipment-codes.js (dokładnie takie jak w arkuszu).
 * Grupa bez wpisu nie trafia do systemu ładowania (brak baterii, baterie jednorazowe, sprzęt medyczny).
 * Szczegóły i źródła: baterie-sprzet.md.
 *
 * Klasy:
 *   A  — duży akumulator Li-ion (laptop, tablet, telefon, zegarek)
 *   B  — mały akumulator urządzenia asystującego
 *   B+ — mała bateria i duży pobór w uśpieniu (OrCam, switche Bluetooth, Roger)
 */
window.BATTERY_RULES = {
  // Po ilu dniach bez ładowania urządzenie wraca na listę „do naładowania” (podtrzymanie kondycji baterii)
  windows: { "A": 90, "B": 60, "B+": 35 },
  // Przy wydaniu: ostrzeżenie, jeśli ostatnie ładowanie było dawniej niż tyle dni
  issueWarnDays: 30,
  // Rezerwacja startująca w ciągu tylu dni podnosi urządzenie na górę listy
  urgentDays: 2,
  groups: {
    // Komputery, tablety, telefony, zegarek
    "Apple iPad 9 generacji": "A",
    "Apple iPad 10 generacji": "A",
    "Apple iPad Pro": "A",
    "iPad Air 11\" WiFi 128GB": "A",
    "Apple Macbook Air": "A",
    "Apple Macbook Pro M2 pro": "A",
    "Appple Macbook Pro M4 Max": "A",
    "Apple Watch 11": "A",
    "Microsoft Surface Go 3": "A",
    "Microsoft Surface Go 3- Ogólnopolska": "A",
    "Microsoft Surface Pro 11": "A",
    "Lenovo V15-ADA": "A",
    "HP 15s": "A",
    "Lenovo K10": "A",
    "Tablet Samsung": "A",
    "iPhone 17 Pro Max": "A",
    "Samsung Galaxy S26 Ultra": "A",
    "Hammer Iron 3": "A",
    "Alcatel 20.19": "A",
    "Smart Vision 2": "A",

    // Słuchawki, głośniki, VR
    "Beats Solo 4": "B",
    "Aftershokz OpenMove": "B",
    "Sony Bravia Theatre U": "B",
    "Okulary VR zestaw 4 szt": "B",

    // Monitory brajlowskie
    "Braillant BI20x": "B",
    "Braillant BI40x": "B",
    "BraillePen 14": "B",
    "Focus 40 blue": "B",
    "Mountbatten Tutor": "B",

    // Powiększalniki
    "Luna 6": "B",
    "Ruby 7HD": "B",
    "Ruby HD": "B",
    "Ruby XL HD": "B",
    "Mano Edu Lite": "B",
    "Mano Edu + Ekran + bateria (?) + stacja ładująca": "B",
    "Exigo": "B",
    "Prodigy Connect 12": "B",

    // Czytniki i asystenci
    "Czytak 4": "B",
    "ClearReader+": "B",
    "Victor Reader Stream": "B",
    "Milestone 112 Ace": "B",
    "Sunu Band": "B",
    "Sonda Ray": "B",
    "Navi Belt": "B",
    "EduMic": "B",
    "OrCam MyEye 2.0": "B+",

    // Switche i sterowanie głową
    "Cosmo Excel": "B+",
    "Cosmo Explore": "B+",
    "Cosmo Switch pojedynczy": "B+",
    "GlassOuse Pro": "B+",
    "GlassOuse v1.4": "B+",
    "Bigtrack Wireless": "B",

    // Mikrofony Roger
    "Roger ClipOn Mic": "B+",
    "Roger Neckloop": "B+"
  }
};
