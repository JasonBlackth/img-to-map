@startuml

left to right direction

package "Find Contours" as FindContours{
    usecase (F1) as "Körvonalkeresési\nparaméterek változtatása"
    usecase (F2) as "Körvonalak kijelölése"
    usecase (F3) as "Kijelölt körvonalak törlése"
    usecase (F4) as "Kijelölt körvonalak mentése"
}

actor :Felhasználó: as User2

User2 --> (F1)
User2 --> (F2)
User2 --> (F3)
User2 --> (F4)

@enduml