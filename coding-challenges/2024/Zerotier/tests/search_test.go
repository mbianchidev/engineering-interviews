package tests

import (
    "net/http"
    "net/http/httptest"
    "testing"
    "zerotier-webhook-service/db"
    "zerotier-webhook-service/handlers"
)

func TestSearchHandler(t *testing.T) {
    db.InitDB()
    defer db.CloseDB()

    req, _ := http.NewRequest("GET", "/search?network=test_org_id", nil)
    rr := httptest.NewRecorder()
    handler := http.HandlerFunc(handlers.SearchHandler)

    handler.ServeHTTP(rr, req)

    if status := rr.Code; status != http.StatusOK {
        t.Errorf("handler returned wrong status code: got %v want %v",
            status, http.StatusOK)
    }

    // Further assertions can be added to check the response body
}
