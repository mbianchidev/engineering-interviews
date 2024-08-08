package main

import (
    "log"
    "net/http"
    "zerotier-webhook-service/db"
    "zerotier-webhook-service/handlers"
)

func main() {
    db.InitDB()
    defer db.CloseDB()

    http.HandleFunc("/event", handlers.EventHandler)
    http.HandleFunc("/search", handlers.SearchHandler)
    log.Fatal(http.ListenAndServe(":8080", nil))
		log.Println("Server started on port 8080")
}
