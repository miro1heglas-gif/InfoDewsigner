# Info Designer 2 – mobilná aplikácia (klikateľný prototyp)

Klikateľný prototyp mobilnej aplikácie modulu **Info Designer 2** platformy Wertyz (EMLines). Dispečer alebo pracovník dopravného podniku z telefónu:

- pošle rýchlu správu na zariadenia,
- upraví a zverejní playlist alebo ho prepne na jednom či viacerých miestach (aj na celú skupinu),
- pridá fotku do snímky a spravuje galériu,
- schváli obsah partnera (tretej strany),
- skontroluje, čo sa kde práve prehráva a ktoré miesta majú problém.

Prototyp má prepínanie účtov (Viac › Prepnúť účet): Admin a Director zverejňujú a schvaľujú, Worker zverejňuje na pridelených miestach, Partner vidí len pridelené plochy a zmeny posiela na schválenie. V Nastaveniach sa dá prepnúť svetlý alebo tmavý vzhľad.

Ide o prototyp na odsúhlasenie návrhu, nie o produkčnú aplikáciu. Údaje sú ukážkové a držia sa len v pamäti, takže po obnovení stránky sa všetko vráti na začiatok. Fotoaparát, nahrávanie a odoslanie na zariadenia sú simulované.

- **Verzia:** verzia 30 návrhu v claude.ai (artefakt typu Design), stav k 20. 11. 2026. Súbory v `project/` sú rovnaké ako v claude.ai.
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
project/                   samotný prototyp (rovnaké súbory ako v claude.ai)
  Main.dc.html             celá aplikácia: šablóna, štýly a logika v jednom súbore
  Slide.dc.html            pomocný komponent na vykreslenie snímky (displej, kiosk, LED)
  Obr_*.dc.html            29 vstupov priamo do konkrétnej obrazovky (načítajú Main so štartovou obrazovkou, jazykom, účtom alebo vzhľadom)
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
| `Obr_Miesta` | miesta – stav, filter Problémy, zariadenie, úprava a prepnutie playlistu |
| `Obr_PrepnutiePlaylistu` | prepnutie playlistu – viac miest alebo celá skupina naraz |
| `Obr_Galeria` | galéria – súbory, filtre, nahratie, zmazanie |
| `Obr_Viac` | viac – prepnutie účtu, schvaľovanie, história správ, AI asistent, nastavenia, jazyk |
| `Obr_Schvalovanie` | schvaľovanie – čaká a vybavené |
| `Obr_DetailSchvalenia` | detail schválenia – zmeny, schváliť, vrátiť, zamietnuť |
| `Obr_HistoriaSprav` | história správ – skončené a zrušené, poslať znova |
| `Obr_AI` | AI asistent – návrh textu rýchlej správy |
| `Obr_Nastavenia` | nastavenia – vzhľad (svetlý, tmavý, podľa telefónu), upozornenia a úložisko |
| `Obr_PrepnutieUctu` | prepnutie účtu – Admin, Director, Worker, Partner |
| `Obr_Partner` | účet Partner – len pridelené miesta, zmeny idú na schválenie |
| `Obr_TmavyRezim` | tmavý vzhľad – domovská obrazovka |
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

## Telefón a vzhľad

Každá stránka má `<meta name="viewport" content="width=device-width, initial-scale=1">`, aby sa v telefóne zobrazila na celú šírku, a `<meta name="color-scheme" content="only light">`, aby ju prehliadač sám nestmavoval. Tmavý vzhľad si používateľ zapne v aplikácii (Viac › Nastavenia › Vzhľad). Voľba sa pamätá v prehliadači. Prehliadač Samsung Internet so zapnutým tmavým režimom môže stránku stmaviť aj tak. Vtedy treba v jeho ponuke vypnúť tmavý režim pre webové stránky.

## support.js

`support.js` je runtime artefaktu typu Design z claude.ai (Anthropic). Obsahuje knižnicu React (licencia MIT) a interpretuje súbory `.dc.html`. Nie je súčasťou kódu prototypu a jeho licencia (okrem Reactu) nie je uvedená. Odporúčame preto **súkromný repozitár**.

Súbor neupravujte. Ak by ste ho chceli nahradiť, stránky ho načítavajú ako `./support.js` z priečinka `project/`.
