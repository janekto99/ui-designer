# visionOS 26 — vytěžená specifikace

Zdroj: `figma/visionOS 26.fig` (Apple Design Resources) a snímky obrazovky
z Figmy. Tenhle soubor je jediné místo, kde jsou hodnoty zapsané v čitelné
podobě — `.fig` je binární (Kiwi ve Zstandardu) a znovu ho rozbalit není
sranda.

**Co je změřené a co dopočtené.** Figma kit je pro visionOS, a ten má jen
tmavý režim. Všechno v sekcích označených _(z Figmy)_ je odečtené z dat.
Světlý režim je odvozený — u něj je poznamenáno, z čeho.

Hodnoty jsou v `app/designs/visionos.css`. Když se něco změní tam, patří to
i sem.

---

## Barvy

### Tmavé varianty _(z Figmy)_

```
Red     #FF453A     Orange  #FF9F0A     Yellow  #FFD60A
Green   #32D74B     Mint    #66D4CF     Teal    #6AC4DC
Cyan    #5AC8F5     Blue    #0A84FF     Indigo  #5E5CE6
Purple  #BF5AF2     Pink    #FF375F     Brown   #AC8E68
Gray    #98989D     Black   #000000     White   #FFFFFF
```

### Světlé varianty

Figma má styly `Colors/Blue` i `Colors/Blue - Dark`, takže **modrá `#0091FF`
je změřená**. Zbytek světlé palety je standardní systémová paleta Apple —
nepřevzatá z tohohle souboru.

---

## Materiály a stavy ovládacích prvků _(z Figmy)_

Jádro celého vzhledu. Výplň je vždycky **dvouvrstvá**: barevný podklad a přes
něj bílý závoj. V CSS to jsou `--platter-tint` a `--platter-veil`.

| Stav | Výplň |
| --- | --- |
| Idle, bez podložky | průhledná |
| Idle, s podložkou | bílá 6 % nad šedou `#5E5E5E` 18 % |
| Hover | totéž + dva radiální přesvity |
| Pinch / active | bílá 16 % nad šedou `#5E5E5E` 36 % |
| Selected | plná bílá, text černý |
| Disabled | bílá ~3 %, text na 30 % |

Text: Primary bílá · Secondary 60 % · Tertiary 30 %.

Ve světlém režimu se to obrací — podklad je bílý místo šedého, text černý.
Konkrétní procenta jsou odhad, ne měření.

---

## Sklo

### Specular obrys _(z Figmy)_

Obrys **není plná čára**, je to lineární přechod shora dolů:

```
bílá 40 % → 0 % → 0 % → 10 %
```

Tohle je nejvíc poznávací věc celého designu. Bez ní vypadá sklo jako obyčejný
průhledný obdélník. V CSS se dělá 1px prstencem s `mask-composite: exclude`,
aby přechod kopíroval `border-radius`.

### Efekty _(z Figmy)_

```
Blur + Shadow Big   BACKGROUND_BLUR  radius 100
                    DROP_SHADOW      y40  blur80  rgba(0,0,0,.30)
                    DROP_SHADOW      y7   blur10  rgba(0,0,0,.09)

Recessed            INNER_SHADOW     y1.5   blur4  rgba(0,0,0,.10)  overlay .08
                    INNER_SHADOW     y-0.5  blur1  rgba(255,255,255,.25)  overlay .30
```

Ovládací prvky mají menší rozostření než okna — 100px je pro panel, ne pro
tlačítko. Hodnota pro tlačítko není v datech, používá se 24px.

---

## Typografie _(z Figmy)_

Písmo SF Pro, letter-spacing −0.4 px u všech stylů.

| Styl | Velikost / prokládání |
| --- | --- |
| XLTitle1 | 48 / 56 |
| XLTitle2 | 38 / 46 |
| LargeTitle | 29 / 38 |
| Title1 | 24 / 32 |
| Title2 | 22 / 28 |
| Title3 | 19 / 24 |
| Headline | 17 / 22 |
| Body | 17 / 22 |
| Callout | 15 / 20 |
| Subheadline | 15 / 20 |
| Footnote | 13 / 18 |
| Caption1 | 12 / 16 |
| Caption2 | 12 / 16 |

Headline se od Body liší jen tučností, Subheadline od Callout taky.

**SF Pro se na web dát nesmí** — je licencované Applem. Používá se
`-apple-system, 'SF Pro Text', system-ui`, takže na Macu se vykreslí opravdové
SF Pro a jinde se to degraduje na systémové písmo.

---

## Tlačítko _(z Figmy)_

```
Button - Text and icon/Regular/Idle (Platter)/Text Pill
    86 × 44   cornerRadius 500 (pilulka)   stroke 1
    fill  SOLID #FFFFFF  opacity 0.06
    fill  SOLID #5E5E5E  opacity 0.18

Jen ikona     64 · 52 · 44 · 32 · 28     cornerRadius 100 (kruh)
Toolbar       šířky 44 · 104 · 164 · 224 · 284 · 344 (krok 60), výška 44
```

Stavy jsou ve Figmě navázané na styly výplně `Controls/Idle`, `Controls/Hover`,
`Controls/Pinch`, `Controls/Disabled`.

Mapování velikostí v kódu:

| | výška | ikona | písmo | vodorovné odsazení |
| --- | --- | --- | --- | --- |
| xs | 28 | 14 | Caption1 | 10 |
| sm | 32 | 16 | Footnote | 12 |
| md | 44 | 20 | Body | 16 |
| lg | 52 | 24 | Title3 | 20 |
| xl | 64 | 28 | Title2 | 24 |

Odsazení u `md` sedí na změřených 86 px: 16 + 20 (ikona) + 6 (mezera) + text + 16.

---

## Stránky ve Figma souboru

Zatím je vytěžená jen část. Co v souboru je:

```
Buttons · Colors · Text Styles · Materials · Examples
Toggles and Checkboxes · Dropdown Buttons · Text Fields · Lists · Menus
Navigation Bars · Page Controls · Pickers · Progress Indicators
Search Tokens · Segmented Controls · Sliders · Tab Bars · Toolbars
Tooltips · Alerts · Color Pickers · Share Sheets · Sidebars · Keyboards
Notifications · SharePlay · Window Controls · Backgrounds · Gestures
App Icon · Cover · Getting Started · License · Change log
```

---

## Snímky obrazovky

Do téhle složky patří i snímky z Figmy. **Zapsat je z konverzace na disk
neumím** — k jejich datům nemám přístup, takže je sem musíš uložit sám.
Nabízí se pojmenování podle stránky: `colors.png`, `materials.png`,
`text-styles.png`, `buttons.png`, `lists.png`, `menus.png`.
