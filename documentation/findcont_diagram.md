@startuml

left to right direction

package "Find Contours" as FindContours{
    usecase (F1) as "Keresési\nparaméterek\nváltoztatása"
    usecase (F2) as "Keresési\nalgoritmus\nkiválasztása"    
    usecase (F3) as "Körvonalak kijelölése"
    usecase (F4) as "Körvonalak törlése"
    usecase (F5) as "Körvonalak mentése"
    usecase (F6) as "Körvonal\negyéni javítása"
    usecase (F7) as "Mentett\nkörvonalak elrejtése,\nmegjelenítése"
}

actor :Felhasználó: as User2

User2 --> (F1)
User2 --> (F2)
User2 --> (F3)
User2 --> (F4)
User2 --> (F5)
User2 --> (F6)
User2 --> (F7)

@enduml