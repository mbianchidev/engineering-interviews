package tests

import (
    "bytes"
    "encoding/json"
    "net/http"
    "net/http/httptest"
    "testing"
    "zerotier-webhook-service/db"
    "zerotier-webhook-service/handlers"
    "zerotier-webhook-service/models"
)

func TestEventHandler(t *testing.T) {
    db.InitDB()
    defer db.CloseDB()

    event := models.Event{
        HookdID:  "test_hookd_id",
        OrgID:    "test_org_id",
        HookType: "test_hook_type",
    }

    body, _ := json.Marshal(event)
    req, _ := http.NewRequest("POST", "/event", bytes.NewBuffer(body))
    rr := httptest.NewRecorder()
    handler := http.HandlerFunc(handlers.EventHandler)

    handler.ServeHTTP(rr, req)

    if status := rr.Code; status != http.StatusOK {
        t.Errorf("handler returned wrong status code: got %v want %v",
            status, http.StatusOK)
    }

    var count int
    err := db.QueryRow("SELECT COUNT(*) FROM events WHERE hookd_id = ? AND org_id = ? AND hook_type = ?",
        event.HookdID, event.OrgID, event.HookType).Scan(&count)
    if err != nil {
        t.Fatal(err)
    }
    if count != 1 {
        t.Errorf("expected 1 event, got %d", count)
    }
}
