@startuml

left to right direction

package Preprocess{
    usecase (P1) as "Zajcsökkentés\nbeállítása"
    usecase (P2) as "Kontrasztarányok\nbeállítása"
    usecase (P3) as "Kontraszt\nközéppontjának\nmódosítása"
    usecase (P4) as "Szürkeárnyalatos\nkép előnézete"
    usecase (P5) as "Fehéregyensúly\nmódosítása"
    usecase (P6) as "Színek korrigálása"
    usecase (P7) as "Geometriai\ntranszformációk\nhasználata"
}

actor :Felhasználó: as User1


User1 --> (P1)
User1 --> (P2)
User1 --> (P3)
User1 --> (P4)
User1 --> (P5)
User1 --> (P6)
User1 --> (P7)

@enduml