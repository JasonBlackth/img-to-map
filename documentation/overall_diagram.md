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

actor :Felhasználó: as User

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