@startuml

left to right direction

package Preprocess{
    usecase (P1) as "Zajcsökkentés beállítása"
    usecase (P2) as "Kontrasztarányok beállítása"
    usecase (P3) as "Kontraszt középpontjának\nmódosítása"
    usecase (P4) as "Szürkeárnyalatos kép\nelőnézete"
}

actor :Felhasználó: as User1


User1 --> (P1)
User1 --> (P2)
User1 --> (P3)
User1 --> (P4)

@enduml