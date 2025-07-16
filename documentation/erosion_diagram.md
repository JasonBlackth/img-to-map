@startuml

left to right direction


package "Erode Coastlines" as ErodeCoastlines{
    usecase (E1) as "Partvonal\nautomatikus\njavítása"
    usecase (E2) as "Fjordok\nlétrehozása"
    usecase (E3) as "Kis szigetek\nlétrehozása"
    usecase (E4) as "Partvonal\njavítása adott\nterületen"
    usecase (E5) as "Töredezettség\nállítása"
    usecase (E6) as "Kiegyenlítés"
    usecase (E7) as "Egyenetlenebbé\ntétel"
    
}

actor :Felhasználó: as User3

User3 --> (E1)
User3 --> (E2)
User3 --> (E3)
User3 --> (E4)
User3 --> (E5)
User3 --> (E6)
User3 --> (E7)

@enduml