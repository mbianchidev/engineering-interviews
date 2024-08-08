package handlers

import (
    "encoding/json"
    "net/http"
    "zerotier-webhook-service/db"
    "zerotier-webhook-service/models"
)

func EventHandler(w http.ResponseWriter, r *http.Request) {
    var event models.Event
    if err := json.NewDecoder(r.Body).Decode(&event); err != nil {
        http.Error(w, err.Error(), http.StatusBadRequest)
        return
    }

    if err := db.StoreEvent(event); err != nil {
        http.Error(w, err.Error(), http.StatusInternalServerError)
        return
    }

    w.WriteHeader(http.StatusOK)
}
