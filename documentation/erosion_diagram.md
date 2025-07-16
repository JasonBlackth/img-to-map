@startuml

left to right direction


package "Erode Coastlines" as ErodeCoastlines{
    usecase (E1) as "Partvonal automatikus\njavítása"
    usecase (E2) as "Fjordok létrehozása"
    usecase (E3) as "Kicsi szigetek létrehozása"
    usecase (E4) as "Partvonal javítása\nadott területen"
    usecase (E5) as "Kép letöltése"
}

actor :Felhasználó: as User3

User3 --> (E1)
User3 --> (E2)
User3 --> (E3)
User3 --> (E4)
User3 --> (E5)

@enduml