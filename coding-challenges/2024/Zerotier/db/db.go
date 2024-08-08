package db

import (
    "database/sql"
    "log"
    "zerotier-webhook-service/models"
    _ "github.com/glebarez/go-sqlite"
)

var db *sql.DB

func InitDB() {
    var err error
    db, err = sql.Open("sqlite", "./events.db")
    if err != nil {
        log.Fatal(err)
    }

    sqlStmt := `
    CREATE TABLE IF NOT EXISTS events (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        hookd_id TEXT,
        org_id TEXT,
        hook_type TEXT,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    );
    `
    _, err = db.Exec(sqlStmt)
    if err != nil {
        log.Fatal(err)
    }
}

func CloseDB() {
    db.Close()
}

func StoreEvent(event models.Event) error {
    log.Printf("Storing event: %+v\n", event)
    _, err := db.Exec("INSERT INTO events (hookd_id, org_id, hook_type) VALUES (?, ?, ?)",
        event.HookdID, event.OrgID, event.HookType)
    return err
}

func SearchEvents(network, device, userID string) ([]models.Event, error) {
    log.Printf("Searching events: network=%s, device=%s, userID=%s\n", network, device, userID)
    query := "SELECT hookd_id, org_id, hook_type, timestamp FROM events WHERE 1=1"
    var args []interface{}

    if network != "" {
        query += " AND org_id = ?"
        args = append(args, network)
    }
    if device != "" {
        query += " AND hookd_id = ?"
        args = append(args, device)
    }
    if userID != "" {
        query += " AND hook_type = ?"
        args = append(args, userID)
    }

    rows, err := db.Query(query, args...)
    if err != nil {
        return nil, err
    }
    defer rows.Close()

    var events []models.Event
    for rows.Next() {
        var event models.Event
        var timestamp string
        if err := rows.Scan(&event.HookdID, &event.OrgID, &event.HookType, &timestamp); err != nil {
            return nil, err
        }
        events = append(events, event)
    }

    return events, nil
}