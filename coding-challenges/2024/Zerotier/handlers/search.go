package handlers

import (
    "encoding/json"
    "net/http"
    "zerotier-webhook-service/db"
)

func SearchHandler(w http.ResponseWriter, r *http.Request) {
    network := r.URL.Query().Get("network")
    device := r.URL.Query().Get("device")
    userID := r.URL.Query().Get("user_id")

    events, err := db.SearchEvents(network, device, userID)
    if err != nil {
        http.Error(w, err.Error(), http.StatusInternalServerError)
        return
    }

    if err := json.NewEncoder(w).Encode(events); err != nil {
        http.Error(w, err.Error(), http.StatusInternalServerError)
    }
}
