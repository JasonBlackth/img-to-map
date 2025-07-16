@startuml

left to right direction
usecase (U) as "Kép feltöltése"
package "User actions" as UA{
    usecase (UnD) as "Visszavonás (Ctrl+Z)"
    usecase (R) as "Ismét (Ctrl+Y)"
    usecase (D) as "Kép letöltése"
}
package "Szerkesztők" as Editors{
    rectangle P as "Preprocess"
    rectangle F as "Find Contours"
    rectangle E as "Erode Coastlines"
} 


package Preprocess{
    usecase (P1) as "Zajcsökkentés beállítása"
    usecase (P2) as "Kontrasztarányok beállítása"
    usecase (P3) as "Kontraszt középpontjának\nmódosítása"
    usecase (P4) as "Szürkeárnyalatos kép\nelőnézete"
}

package "Find Contours" as FindContours{
    usecase (F1) as "Körvonalkeresési\nparaméterek változtatása"
    usecase (F2) as "Körvonalak kijelölése"
    usecase (F3) as "Kijelölt körvonalak törlése"
    usecase (F4) as "Kijelölt körvonalak mentése"
}

package "Erode Coastlines" as ErodeCoastlines{
    usecase (E1) as "Partvonal automatikus\njavítása"
    usecase (E2) as "Fjordok létrehozása"
    usecase (E3) as "Kicsi szigetek létrehozása"
    usecase (E4) as "Partvonal javítása\nadott területen"
    usecase (E5) as "Kép letöltése"
}


actor :Felhasználó: as User
actor :Felhasználó: as User1
actor :Felhasználó: as User2
actor :Felhasználó: as User3

User3 --> (E1)
User3 --> (E2)
User3 --> (E3)
User3 --> (E4)
User3 --> (E5)


User1 --> (P1)
User1 --> (P2)
User1 --> (P3)
User1 --> (P4)


User2 --> (F1)
User2 --> (F2)
User2 --> (F3)
User2 --> (F4)


User --> (U)
User --> (UnD)
User --> (R)
User --> (D)
User --> (P)
User --> (F)
User --> (E)

U ..> Editors : precedes
U ..> UA : precedes

@enduml