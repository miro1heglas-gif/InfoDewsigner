# Info Designer 2 – mobilná aplikácia (klikateľný prototyp)

Klikateľný prototyp mobilnej aplikácie modulu **Info Designer 2** platformy Wertyz (EMLines). Dispečer alebo pracovník dopravného podniku z telefónu:

- pošle rýchlu správu na zariadenia,
- upraví alebo prepne playlist na mieste,
- pridá fotku do snímky,
- schváli zmeny,
- skontroluje, čo sa kde práve prehráva.

Ide o prototyp na odsúhlasenie návrhu, nie o produkčnú aplikáciu. Údaje sú ukážkové a držia sa len v pamäti, takže po obnovení stránky sa všetko vráti na začiatok. Fotoaparát, nahrávanie a odoslanie na zariadenia sú simulované.

- **Verzia:** publikovaná verzia 26 návrhu v claude.ai (artefakt typu Design), stav k 20. 11. 2026.
- **Jazyky rozhrania:** slovenčina (predvolená), čeština, poľština, angličtina, nemčina.
- **Veľkosť:** navrhnuté pre telefón 390 × 844 px. Na širšej obrazovke sa aplikácia zobrazí v strede.

## Spustenie

**Na GitHub Pages:**
1. V repozitári otvorte Settings › Pages.
2. V časti „Build and deployment“ nastavte Source na „Deploy from a branch“, vetvu `main` a priečinok `/ (root)`.
3. Po minúte bude prototyp na adrese `https://<účet>.github.io/<repozitár>/`.

Úvodná stránka `index.html` ukáže aplikáciu v rámčeku telefónu a zoznam obrazoviek.

**Lokálne:** stránky treba otvárať cez webový server. Pri dvojkliku na súbor (`file://`) sa obrazovky `Obr_*` nenačítajú.

```
python3 -m http.server 8000
```

Potom otvorte http://localhost:8000/.

Prototyp pri behu potrebuje internet len na písmo Source Sans 3 z Google Fonts. Bez neho sa použije systémové písmo.

## Obsah repozitára

```
index.html                 úvodná stránka: telefón + zoznam obrazoviek
project/                   samotný prototyp (súbory z claude.ai upravené pre telefón, pozri nižšie)
  Main.dc.html             celá aplikácia: šablóna, štýly a logika v jednom súbore
  Slide.dc.html            pomocný komponent na vykreslenie snímky (displej, kiosk, LED)
  Obr_*.dc.html            26 vstupov priamo do konkrétnej obrazovky (načítajú Main so štartovou obrazovkou a jazykom)
  i18n.js                  preklady (generované zo zdroje/preklady)
  canvas.json              rozmiestnenie obrazoviek na plátne v claude.ai (na beh netreba)
  support.js               runtime typu Design z claude.ai (pozri nižšie)
zdroje/
  aplikacia/               časti, z ktorých sa skladá project/Main.dc.html
    css.html               štýly
    tplA.html, tplB.html   šablóna obrazoviek
    js1.js, jsR1.js, jsR2.js  logika (údaje, stav, akcie)
    build.py               poskladá Main.dc.html
  preklady/
    m_dict.txt             slovník: jeden riadok = sk ||| cs ||| pl ||| en ||| de
    build_i18n.py          vygeneruje project/i18n.js
    engine.js              prekladový engine (vkladá sa do i18n.js)
```

## Obrazovky

| Súbor | Čo ukazuje |
|---|---|
| `Main` | celá klikateľná aplikácia (domov) |
| `Obr_Playlisty` | playlisty – zoznam, filter a zariadenie playlistu |
| `Obr_DetailPlaylistu` | detail playlistu pre displej – poradie, pridanie fotky, odoslanie |
| `Obr_DetailLED` | detail playlistu pre LED tabuľu – text alebo snímka zo zoznamu |
| `Obr_UpravaSnimky` | úprava snímky pre displej – text, farba, trvanie |
| `Obr_LED` | úprava textu pre LED tabuľu – veľkosť, farba, pole |
| `Obr_Oznacnik` | playlist pre označník – LED čas a dátum, LED odchody, e-papier |
| `Obr_OznacnikNahlad` | náhľad označníka – tri displeje pod sebou |
| `Obr_PridanieFotky` | pridanie fotky – odfotiť, z telefónu, z galérie |
| `Obr_ZoznamSnimok` | pridanie snímky zo zoznamu vytvorených snímok |
| `Obr_Nahlad` | náhľad playlistu na jeho zariadení |
| `Obr_RychlaSprava` | rýchla správa – text, kam, priorita, trvanie |
| `Obr_VyberMiest` | rýchla správa – výber miest (všetky, skupina, jednotlivo) |
| `Obr_Miesta` | miesta – stav, zariadenie, úprava a prepnutie playlistu |
| `Obr_PrepnutiePlaylistu` | prepnutie playlistu na mieste |
| `Obr_Galeria` | galéria – súbory, filtre, nahratie |
| `Obr_Viac` | viac – profil, schvaľovanie, história správ, AI asistent, nastavenia, jazyk |
| `Obr_Schvalovanie` | schvaľovanie – čaká a vybavené |
| `Obr_DetailSchvalenia` | detail schválenia – zmeny, schváliť, vrátiť, zamietnuť |
| `Obr_HistoriaSprav` | história správ – skončené a zrušené, poslať znova |
| `Obr_AI` | AI asistent – návrh textu rýchlej správy |
| `Obr_Nastavenia` | nastavenia – upozornenia v telefóne a úložisko |
| `Obr_Jazyk` | výber jazyka |
| `Obr_Jazyk_CS`, `_PL`, `_EN`, `_DE` | ukážky v češtine, poľštine, angličtine a nemčine |

## Úpravy

**Aplikácia:**
1. Upravte súbory v `zdroje/aplikacia/`.
2. Z koreňa repozitára spustite `python3 zdroje/aplikacia/build.py` (Python 3, bez ďalších balíkov). Prepíše `project/Main.dc.html`.

**Preklady:**
1. Do `zdroje/preklady/m_dict.txt` pridajte alebo opravte riadok vo formáte `slovenský text ||| čeština ||| polština ||| angličtina ||| nemčina`. Zástupné znaky `{0}`, `{1}` sú premenné časti textu. Riadok s tromi tvarmi oddelenými `|` je množné číslo (1 / 2–4 / 5+).
2. Spustite:

```
python3 zdroje/preklady/build_i18n.py project/i18n.js zdroje/preklady/m_dict.txt
```

Zdroje vytvoria presne súbory `project/Main.dc.html` a `project/i18n.js`, ktoré sú v repozitári.

**Návrat do claude.ai:** súbory z `project/` (okrem `support.js`) sa dajú znova publikovať do artefaktu typu Design.

## Rozdiel oproti verzii v claude.ai

Aby sa prototyp otvoril v telefóne správne, sú stránky oproti publikovanej verzii 26 upravené v troch bodoch. V claude.ai sa prototyp zobrazuje v rámčeku s pevnou veľkosťou, kde tieto úpravy nič nemenia.

- **Šírka telefónu:** každá stránka `.dc.html` má `<meta name="viewport" content="width=device-width, initial-scale=1">`. Bez neho prehliadač v telefóne kreslí stránku 980 px širokú a zmenší ju, takže aplikácia je malá v strede a spodná lišta je mimo obrazovky.
- **Len svetlý vzhľad:** `<meta name="color-scheme" content="only light">` hovorí prehliadaču, že stránka má len svetlý vzhľad. Chrome a ďalšie prehliadače na Chromiu ju potom nestmavujú. Samsung Internet s tmavým režimom ju môže stmaviť aj tak. Vtedy treba v jeho ponuke vypnúť tmavý režim pre webové stránky.
- **Výška obrazovky:** hlavný kontajner má `height: 100dvh`, aby sa spodná lišta neschovala pod lištu prehliadača.

## support.js

`support.js` je runtime artefaktu typu Design z claude.ai (Anthropic). Obsahuje knižnicu React (licencia MIT) a interpretuje súbory `.dc.html`. Nie je súčasťou kódu prototypu a jeho licencia (okrem Reactu) nie je uvedená. Odporúčame preto **súkromný repozitár**.

Súbor neupravujte. Ak by ste ho chceli nahradiť, stránky ho načítavajú ako `./support.js` z priečinka `project/`.
