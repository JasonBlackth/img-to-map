## Architektúra

Az alkalmazás architektúrája háromrétegű lesz: View (UI) - ViewModel - Model.

### View

A felhasználói felület (View) HTML-t, illetve Bootstrap 5-öt fog használni, minimális javascript-tel. Ennek drótvázterve a következő:

<img src="documentation\diagrams\Wireframe\upload_image.png">
<img src="documentation\diagrams\Wireframe\editor1.png">
<img src="documentation\diagrams\Wireframe\editor2.png">
<img src="documentation\diagrams\Wireframe\editor3.png">
<img src="documentation\diagrams\Wireframe\download_image.png">

Megfigyelhető, hogy minden szerkesztő az azt megelőző szerkesztő végeredményét veszi kiindulási pontnak - egyedül a letöltési fülön nem látható ez, ugyanis a drótvázterv megalkotására használt felületen ezt nehéz lett volna kivitelezni. A valódi program természetesen ott is a kép legújabb verziójával fog majd dolgozni. 

### ViewModel

Ahhoz, hogy a felhasználói bemenetek a megfelelő függvényhívásokhoz vezessenek a Model-ben, egy ViewModel-t fogunk bevezetni. Ehhez az alábbi struktúrában szereplő osztályok fognak tartozni:

<img src="documentation\diagrams\out\class\ViewModel.svg">
<img src="documentation\diagrams\out\class\ViewModelInterfaces.svg">


Az `Application` osztály `initialize()` függvénye lesz felelős az alkalmazás indításáért, és minden további osztály példányosításáért. Ez lesz továbbá az az osztály, amely lehetővé teszi a felhasználó cselekedeteinek visszavonását, vagy újbóli végrehajtását, az `undo()` és `redo()`, valamint a végrehajtott változtatásokat tároló `Action[]` típusú adattagok. 

Az `EditorViewModel` példányai az egyes szerkesztők megjelenítéséért, és az `Editor` osztályokkal való megfelelő összeköttetésért felelnek majd. A nézetben található `editorView.html` sablon fájl tartalmát fogják feltölteni a hozzájuk rendelt szerkesztő függvényeit meghívó gombokkal és egyéb vezérlőkkel, a `buttonMap` adattag tartalmának megfelelően.

Az `ImageUploader` és az `ImageDownloader` pedig értelemszerűen a képek le- és feltöltését teszik majd lehetővé. Az `Application` kivételével minden itt ábrázolt osztály a `Showable` interfész leszármazottja, amely biztosítja az egyes elemek eltüntetését illetve újra megjelenítését. Így a felhasználó egyszerre csak egy, az aktuálisan használt szerkesztőt fogja látni.


### Model

Mivel szeretnénk, hogy a felhasználó vissza tudja vonni saját változtatásait, a modellhez elengedhetetlen lesz a függvények egy olyan osztálya, amelynek hatásai könnyedén visszaforgathatóak. Ezt valósítja meg az `Action` absztrakt osztály. 

<img src="documentation\diagrams\out\class\Action.svg">

A cél, hogy minden nézet által meghívott függvénynek kötelező legyen deklarálni egy "inverz" függvényét, amely visszaforgatja az eszközölt változtatásokat. Ezért minden ilyen függvény visszatérési értéke `Action` lesz. Jóllehet ez nem szükséges: egy `void` típusú függvényen belül is lehetséges `Action`-t létrehozni. Mégis ezzel tudjuk ezt az invariánst fenntartani, és egy esetleges külső fejlesztő számára is világosan látszik, hogy egy adott metódusra milyen szabályok vonatkoznak, és milyen viselkedést várhat el tőle. 

Tekintve, hogy számos változtatás leírható egy adattag átírásával, a `ChangeValueAction<T>` tetszőleges típusú adattagra képes lesz ezt végrehajtani, csökkentve ezzel a kódismétlést. Ennek `originalValue` és `newValue` adattagjai fogják eltárolni a változtatás előtti illetve utáni értéket, melyeket az `apply()` és `revert()` függvények ki tudnak cserélni. Az általános esetben ugyanezt a célt a `dataStorage` objektum szolgálja.

Végül pedig az `ActionType` bevezetése egyedül a kód olvashatóságát hivatott javítani: így ugyanis egy új `Action` létrehozásakor az `apply()` és `revert()` függvényeket megnevezve kell definiálnunk őket, nem elég egy lambda kifejezés megírása. 

Az alábbiakban az `Editor` interfészt implementáló, a képszerkesztés logikájáért felelős osztályok diagramja látható:

<img src="documentation\diagrams\out\class\Editor.svg">

Minden szerkesztő tartalmazza az általa szerkesztett kép jelenlegi, és eredeti verzióját egy mátrix formájában, valamint a mátrix sorainak és oszlopainak a számát. A `getImage()` pedig ezek alapján hivatott kiszámítani a kép új állapotát egy változtatást követően. 

Ezen túl minden metódus és adattag az adott szerkesztő felület egyedi funkciójához köthető. Valamennyi felhasználó által elérhető funkciót `Action` típusú metódus jelöl, az egyetlen kivétel ez alól a `selectContourClosestTo()` függvény, amely csak körvonalak kiválasztásáért felel, nem végez visszafordítást igénylő változtatást. 


