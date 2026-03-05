```mermaid
erDiagram
    MACHINE ||--o{ SENSOR : "has"
    SENSOR ||--o{ READING : "records"
    SENSOR ||--o{ ALERT : "triggers"
    MACHINE ||--o{ WORK_ORDER : "requires"
    TECHNICIAN ||--o{ WORK_ORDER : "assigned"
    WORK_ORDER ||--o{ SPARE_PART_USAGE : "uses"
    INVENTORY ||--o{ SPARE_PART_USAGE : "stocks"
    SUPPLIER ||--o{ INVENTORY : "supplies"
    FACILITY ||--o{ MACHINE : "houses"
    DEPARTMENT ||--o{ TECHNICIAN : "manages"
    MACHINE ||--o{ MAINTENANCE_PLAN : "follows"
    WORK_ORDER ||--o{ ALERT : "resolves"

    MACHINE {
        int id PK
        string serial_num
        string status
    }
    SENSOR {
        int id PK
        string type
    }
    READING {
        int id PK
        float val
        datetime ts
    }
    ALERT {
        int id PK
        string level
    }
    WORK_ORDER {
        int id PK
        string prio
    }
    TECHNICIAN {
        int id PK
        string name
    }
    SPARE_PART_USAGE {
        int id PK
        int qty
    }
    INVENTORY {
        int id PK
        string part_name
    }
    SUPPLIER {
        int id PK
        string vendor
    }
    FACILITY {
        int id PK
        string bldg
    }
    DEPARTMENT {
        int id PK
        string dname
    }
    MAINTENANCE_PLAN {
        int id PK
        int freq
    }