

## User Stories

### Képfeltöltés
GIVEN;Még nincs feltöltött kép
AND;egyik szerkesztő fül sem látszik
WHEN;A felhasználó rányom az "Upload image" gombra,
AND;a felugró párbeszédablakban kiválaszt egy .jpg vagy .png képet
THEN;A weboldal hiba és kivétel dobása nélkül megjeleníti azt az első szerkesztő fülben
AND;minden állítható értéket alapértelmezettre állít be
AND;a további szerkesztőket megjeleníti.


### Szerkesztők Általánosan
GIVEN;A szerkesztőben már van egy feltöltött kép
WHEN;A felhasználó átállítja bármely tulajdonságot a szerkesztőben
THEN;A szerkesztőben lévő kép az új paramétereknek megfelelően azonnal változik

WHEN;A felhasználó rányom az "Upload image" gombra
THEN;A weboldal figyelmezteti, hogy az eddigi változtatásai el fognak veszni
AND;lehetőséget kínál a művelet megszakítására
AND;amennyiben a felhasználó továbblép, a fentieknek megfelelően új képet tölthet fel

WHEN;A felhasználó olyan értéket próbál megadni a szerkesztőnek, amellyel nem lehetséges képet alkotni
THEN;Ahol lehet, a weboldal ne engedélyezze ilyen értékek megadását (pl. értékkészlet korlátozásával)
AND;ahol pedig nem, ott figyelmeztesse a felhasználót hibaüzenettel
AND;a megjelenített kép maradjon változatlan

GIVEN;A szerkesztőben már van egy feltöltött kép
AND;A felhasználó már létrehozott valamilyen módosítást ezen
AND;Még nem használta a következőkben leírt funkciót egymás után 5-ször
WHEN;A felhasználó megnyomja a 'Ctrl+Z' kombinációt
THEN;A képen tett legutóbbi változtatás legyen visszafordítva,
AND;ezt tükrözzék a szerkesztőben megjelenő eszközök illetve paraméterek is, amennyiben ez releváns

GIVEN;A szerkesztőben már van egy feltöltött kép
AND;A felhasználó már létrehozott valamilyen módosítást ezen, amelyet aztán visszavont
AND;Még nem használta a következőkben leírt funkciót, hogy ezt a visszavont műveletet újra alkalmazza
WHEN;A felhasználó megnyomja a 'Ctrl+Y' kombinációt
THEN;A képen tett legutóbb visszavont változtatás lépjen ismét életbe,
AND;ezt tükrözzék a szerkesztőben megjelenő eszközök illetve paraméterek is, amennyiben ez releváns



### Második Szerkesztő (Körvonalak keresése)

GIVEN;Van feltöltött kép és a második szerkesztő van megjelenítve

WHEN;A felhasználó rákattint a megjelenített képre
THEN;A kattintáshoz legközelebb lévő (bizonyos területen belüli) körvonal legyen kiemelve
AND;az eddigi kijelölés váltson erre a körvonalra (az előző kijelölés szűnjön meg)

WHEN;A felhasználó rákattint a megjelenített képre miközben lenyomva tartja a 'Ctrl' billentyűt
THEN;A kattintáshoz legközelebb lévő (bizonyos területen belüli) körvonal legyen kiemelve
AND;az eddigi kijelölés maradjon meg, az új körvonal pedig legyen hozzáadva

GIVEN;Van feltöltött kép és a második szerkesztő van megjelenítve
AND;legalább egy körvonal ki van jelölve

WHEN;A felhasználó megnyomja a 'Delete' billentyűt, vagy az erre elhelyezett gombot
THEN;Minden kijelölt körvonal tűnjön el a megjelenített képről,
AND;ne jelenjen meg újra, amíg a körvonalkeresés paraméterei nem változnak.

WHEN;A felhasználó megnyomja az 'Enter' billentyűt, vagy az erre elhelyezett gombot
THEN;Minden kijelölt körvonal legyen kiemelve a megjelenített képen,
AND;legyen "elmentve:" kerüljön át a következő szerkesztőben lévő képre
AND;maradjon kiemelve és elmentve még akkor is, ha a körvonalkeresés paraméterei változnak.

WHEN;A felhasználó törölni próbál egy elmentett körvonalat
THEN;Az oldal figyelmeztesse a felhasználót,
AND;amennyiben tényleg törölni akarja, az törlődjön az elmentett körvonalak közül is.

WHEN;A felhasználó egy (vagy több) mentett körvonalat jelölt ki,
AND;Leadja a mentéshez szükséges valamelyik bemenetet
THEN;A körvonalak kerüljenek le a mentett körvonalak listájáról,
AND;maradjanak mint kijelölt körvonalak a szerkesztő előnézetén.  

További, egyelőre nehezen specifikálható követelmény:
- A felhasználónak legyen lehetősége egy adott körvonal "javítására"
    - gyakori, hogy egy körvonal nem teljesen zárt, noha emberi szemmel nézve könnyű lenne zárttá tenni
    - ezt a problémát lehessen orvosolni, lehetőség szerint minél könnyebben
- Alternatívaként lehet, hogy a "point_map_img" változóban tárolt kép, ami csak a körvonalak csúcspontjait tartalmazza, segítségünkre lehet
    - ugyanis itt is általában könnyű észrevenni, hogy mi a kívánt alakzat, bár algoritmust még nem találtam rá
    - valamilyen módon talán ezt is ki lehet majd használni, akár egy körvonalnál, akár az egész képnél




- Erode coastlines
    - for the entire image, or a sub-image
    - Automatically
    - into Fjords
    - into Small Islands
    - into "general coastline"


### Harmadik Szerkesztő (Partvonal javítása)

GIVEN;A harmadik szerkesztőben lévő (bináris) kép nem egyszínű
WHEN;A felhasználó kiválasztja az automatikus partvonal alakítás opciót
THEN;A kép két színét (mondjuk fekete és fehér) egymástól elválasztó vonala megváltoznak,
AND;úgy, hogy egész kép jobban hasonlít egy térképre: az elválasztások nem egyenesek, természetesnek hatnak
AND;kellően nagy kép esetén a kialakított partvonal változatos.

GIVEN;A felhasználó kiválasztotta az egyik partvonal alakító "ecsetet"
AND;A kurzorral a szerkesztő előnézetében egy nem egyszínű részképet kijelölve kattint, vagy az egeret lenyomva és arrébb húzva egy nem egyszínű részképet jelöl ki
THEN;A részképen belüli elválasztó vonal (partvonal) az ecsetnek megfelelően változik, pl. fjord-szerű alakokat, vagy kicsi szigeteket hoz létre.

GIVEN;A szerkesztőben már van egy feltöltött kép
WHEN;A felhasználó rányom a "Download" gombra;
THEN;Megnyílik egy párbeszédablak, amely lehetőséget ad a harmadik szerkesztőben lévő kép letöltésére


- Download image
- upload to Azgaar's (can we even do that?)
