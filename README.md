# Info Designer 2 – mobilná aplikácia (klikateľný prototyp)

Klikateľný prototyp mobilnej aplikácie modulu **Info Designer 2** platformy Wertyz (EMLines). Dispečer alebo pracovník dopravného podniku z telefónu:

- pošle rýchlu správu na zariadenia,
- upraví a zverejní playlist alebo na mieste na zvolený čas prepne iný playlist,
- pridá fotku do snímky a spravuje galériu,
- schváli obsah partnera (tretej strany),
- skontroluje, čo sa kde práve prehráva a ktoré miesta majú hlásenie.

Prototyp má prepínanie účtov (Viac › Prepnúť účet): Admin a Director zverejňujú a schvaľujú, Worker zverejňuje na pridelených miestach, Partner vidí len pridelené plochy a zmeny posiela na schválenie. V Nastaveniach sa dá prepnúť svetlý alebo tmavý vzhľad. Dolná lišta má záložky Domov, Playlisty, Miesta, AI asistent a Viac; Galéria je vo Viac, nastavenie AI asistenta v Nastaveniach. AI asistent je chat, ktorý odpovedá z ukážkových údajov prototypu.

Mobilná aplikácia len upravuje: nevytvára playlisty, nemaže snímky ani súbory a nemení vzory (rozloženie plochy). Snímku môže z playlistu odstrániť, v zozname snímok však ostane. Snímky podľa zložených vzorov (sekcie v riadkoch a stĺpcoch, ako v desktopovom editore vzorov) sa upravujú ťuknutím na sekciu: obsah sekcie sa vyberá z rovnakých typov ako v desktope (text, obrázok, video, odchody vozidiel, cestovné poriadky, odkaz, mapa, počasie, detail linky, info menu, vozidlová trasa, kalendár, vodné merania, čas). Ponúknu sa len typy, pre ktoré má organizácia pripojený zdroj dát a ktoré zariadenie zvládne (napríklad info menu len na dotykovom kiosku). Ostatné sú vypísané ako nedostupné s dôvodom. Prehľad zdrojov dát je vo Viac › Nastavenia. Sekcie, ktoré patria tretej strane (napríklad Mesto Riečany), sú šrafované a označené jej menom. Dopravca ich obsah nemení, partner upravuje len svoje sekcie.

Ide o prototyp na odsúhlasenie návrhu, nie o produkčnú aplikáciu. Údaje sú ukážkové a držia sa len v pamäti, takže po obnovení stránky sa všetko vráti na začiatok. Fotoaparát, nahrávanie a odoslanie na zariadenia sú simulované.

- **Verzia:** verzia 40 návrhu v claude.ai (artefakt typu Design), stav k 20. 11. 2026. Súbory v `project/` sú rovnaké ako v claude.ai.
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
  Obr_*.dc.html            33 vstupov priamo do konkrétnej obrazovky (načítajú Main so štartovou obrazovkou, jazykom, účtom alebo vzhľadom)
  i18n.js                  preklady (generované zo zdroje/preklady)
  canvas.json              rozmiestnenie obrazoviek na plátne v claude.ai (na beh netreba)
  manifest.json            údaje pre pridanie na plochu telefónu (názov, ikony, farby)
  ikony/                   ikona Info Designera: favicon, ikona pre iPhone a Android
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
  ikona/
    ikona.svg              logo (kruh) – z neho sú ikony 32, 192 a 512 px
    ikona-plna.svg         logo na tmavom štvorci – ikona pre iPhone (180 px) a Android (maskable)
```

## Obrazovky

| Súbor | Čo ukazuje |
|---|---|
| `Main` | celá klikateľná aplikácia (domov) |
| `Obr_Playlisty` | playlisty – zoznam, filter, upraviť (ceruzka) a náhľad (play) |
| `Obr_DetailPlaylistu` | detail playlistu pre displej – poradie, pridanie fotky, odoslanie |
| `Obr_UpravaSnimky` | úprava snímky pre displej – text, farba, trvanie, odstránenie z playlistu |
| `Obr_PlaylistSekcie` | playlist so zloženými snímkami (31″ zastávka) |
| `Obr_SnimkaSekcie` | vzor „Kiosk s menu“ – ťuknutím na sekciu ju upravíte, vzor sa nemení |
| `Obr_VzorPolovice` | vzor „Hore 1 + dole 2“ – hore oznam, dole mapa a odchody |
| `Obr_VzorOdchody` | vzor „Odchody + 2 info“ – odchody, oznam, počasie |
| `Obr_VzorPas` | vzor „Pás – nástupište“ na šírku – odchody a reklama |
| `Obr_Vzor2x2` | vzor „Nástenka 2 × 2 na šírku“ – štyri sekcie |
| `Obr_LED` | úprava textu pre LED tabuľu – veľkosť, farba, pole |
| `Obr_Oznacnik` | playlist pre označník – LED čas a dátum, LED odchody, e-papier |
| `Obr_PridanieFotky` | pridanie fotky – odfotiť, z telefónu, z galérie |
| `Obr_ZoznamSnimok` | pridanie snímky zo zoznamu vytvorených snímok |
| `Obr_Nahlad` | náhľad playlistu na jeho zariadení |
| `Obr_RychlaSprava` | rýchla správa – text, kam, priorita, trvanie |
| `Obr_VyberMiest` | rýchla správa – výber miest (všetky, skupina, jednotlivo) |
| `Obr_Miesta` | miesta – stav, filter Hlásenia, zariadenie, úprava a prepnutie playlistu |
| `Obr_PrepnutiePlaylistu` | prepnutie playlistu na mieste – čo prehrať a ako dlho, aj vlastný čas od – do |
| `Obr_Galeria` | galéria (Viac › Galéria) – súbory, filtre, nahratie, použité v playlistoch |
| `Obr_Viac` | viac – prepnutie účtu, schvaľovanie, galéria, história správ, nastavenie AI asistenta, nastavenia, jazyk |
| `Obr_Schvalovanie` | schvaľovanie – čaká a vybavené |
| `Obr_DetailSchvalenia` | detail schválenia – zmeny, schváliť, vrátiť, zamietnuť |
| `Obr_HistoriaSprav` | história správ – skončené a zrušené, poslať znova |
| `Obr_AI` | AI asistent (záložka dole) – chat: návrh textu správy, miesta s hlásením, čo sa kde hrá, schvaľovanie |
| `Obr_Nastavenia` | nastavenia – vzhľad (svetlý, tmavý, podľa telefónu), upozornenia, AI asistent a úložisko |
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

- Každá stránka má `<meta name="viewport" content="width=device-width, initial-scale=1">`, aby sa v telefóne zobrazila na celú šírku.
- Vzhľad si volí používateľ v aplikácii (Viac › Nastavenia › Vzhľad: Svetlý, Tmavý, Podľa telefónu). Voľba sa pamätá v prehliadači.
- Aplikácia má `color-scheme: only light` (svetlý) alebo `only dark` (tmavý), aby ju prehliadač neprefarboval vlastným tmavým režimom (Chrome, Edge, Opera, Brave). Stránka zároveň hlási, že tmavý vzhľad podporuje (`<meta name="color-scheme" content="light dark">` a pravidlo `prefers-color-scheme`).
- Prehliadač Samsung Internet má predvolene zapnutý vlastný „vynútený tmavý režim“. Ten prefarbí každú stránku a stránka ho nemôže vypnúť ani zistiť štandardnou cestou (potvrdil to Samsung na svojom fóre pre vývojárov, marec 2026). Aplikácia ho preto rozpozná náhradným spôsobom (biely obrázok SVG vykreslený na plátno prestane byť biely) a na Domove ukáže návod, ako ho vypnúť. Návod je aj vo Viac › Nastavenia, ak stránku otvoríte v Samsung Internet.
- Ako ho vypnúť: Samsung Internet 29 a novší: ⋮ › Nastavenia › Zobrazenie webových stránok a posúvanie › Tmavý režim › vypnúť vynútený tmavý režim pre webový obsah. Verzia 28: ⋮ › Nastavenia › Užitočné funkcie › Labs › zapnúť tmavý režim webovej stránky. Potom sa použije vzhľad zvolený v aplikácii.
- GitHub Pages dovoľuje prehliadaču držať stránky 10 minút. Nová verzia sa preto môže prejaviť až do 10 minút po nahratí.

## Ikona na ploche telefónu

Prototyp sa dá pridať na plochu telefónu ako aplikácia s ikonou Info Designera. Po spustení z plochy sa otvorí celá aplikácia (`project/Main.dc.html`) bez panela prehliadača.

- **Android (Chrome, Edge, Samsung Internet):** otvorte aplikáciu, v ponuke prehliadača (⋮ alebo ☰) zvoľte „Pridať na plochu“ alebo „Inštalovať aplikáciu“.
- **iPhone (Safari):** otvorte aplikáciu (na úvodnej stránke odkaz „Celá klikateľná aplikácia“), ťuknite na Zdieľať › „Pridať na plochu“.

Ikonu zobrazí iPhone zo súboru `ikony/apple-touch-icon.png`, Android zo súboru `manifest.json`. Ak bol prototyp na ploche už skôr, starú ikonu treba odstrániť a pridať znova.

## support.js

`support.js` je runtime artefaktu typu Design z claude.ai (Anthropic). Obsahuje knižnicu React (licencia MIT) a interpretuje súbory `.dc.html`. Nie je súčasťou kódu prototypu a jeho licencia (okrem Reactu) nie je uvedená. Odporúčame preto **súkromný repozitár**.

Súbor neupravujte. Ak by ste ho chceli nahradiť, stránky ho načítavajú ako `./support.js` z priečinka `project/`.
