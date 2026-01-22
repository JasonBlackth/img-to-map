
Model, aminek vannak függvényei, ezek változtatják a képeket
pl. Editor osztály, azon  belül pedig "Modifier" vagy "Brush" vagy ilyesmi

ViewModel, minden Editor-nak egy-egy megjelenítő osztály.
Ez tartalmazza az ikonokat, és a paraméterek megjelenítését (pl. checkbox vagy slider) és elrendezését

View, ami HTML + js
Ez csak egy váz az EditorViewModel-leknek, illetve magának a weboldalnak, lehet theme-je és ilyesmi 
