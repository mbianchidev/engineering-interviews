package models

type Event struct {
    HookdID  string `json:"hookd_id"`
    OrgID    string `json:"org_id"`
    HookType string `json:"hook_type"`
}
