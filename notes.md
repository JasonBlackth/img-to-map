

### Contour ötletek
- "nagyobb területet foglaló contourok keresése"
    - ie. a pohár széle ne legyen benne, túl egyenes, túl keskeny, stb
- "majdnem zárt" contourok és ~részletek keresése
- pointcloud-ban közeli pontok összekötése
    - contour-ok beleszámolása valahogy??
    - ez nagyon fájna, de gráfként kezelve biztos lehet valami intuíciót építeni arról, hogy mi egy sziget és mi nem


### Features
- valószínűleg szükséges lesz, hogy lehessen kézzel contour-t törölni (pl. kattintásra)
    - pl. ha a pohár széle összeérne, akkor az minden algoritmus szerint contour-nak számítana
    => valami sokkal efficient-ebb módja kéne az eltárolásnak, és pontok keresésének
- Ebből kiindulva:
    - irányított contour keresés (adott területen, részképben)
    - új contour-ok keresése, miközben a "tiltottakat" kihagyjuk
        - ig ha letiltunk egy területet, akkor azt a pontot tartalmazó contour ne szerepeljen
- Legyen Ctrl+Z és Ctrl+Y


### "Majdnem zárt" Contour-ok
- A legközelebbi nem szomszédos pont távolsága minden pontra nagyon kicsi
    - ez egy "rendes" alakzatnál nem lenne igaz (legalábbis nem minden pontra)
   