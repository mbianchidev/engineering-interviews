# ZeroTier Backend Engineering Interview - Matteo Bianchi
Hello team! 
Thank you for giving me this opportunity to apply to ZeroTier.

## Objective (you can skip it, it's your own readme)

Write a basic web service which receives ZeroTier Central [event hooks](https://docs.zerotier.com/webhooks) and then logs them to a database. The service should also expose an HTTP endpoint which allows a client to search for stored events by network, device, or user ID as appropriate.

To generate event hooks for your service to capture, you'll need to log in to an account on [Central](https://my.zerotier.com) that has an active paid subscripion. (We'll provide access details for you with a pre-provisioned account via email.) You'll also need to [download and install ZeroTier](https://www.zerotier.com/download/) onto one or more devices. You can use a laptop, cloud VM, or even mobile device as a host.

After that, you'll need to make changes to your network(s) that trigger an event; these can include creating a network, joining it from a new device, or changing the configuration for an existing member device.

You should implement the service in Go; for persistence we recommend SQLite, but any durable store is fine. A full automated test harness isn't required but we would like to see your thoughts (and if relevant, some initial code) about your approach to testing this kind of system.

To help keep the project within the 1-2 hour target, please include some notes describing the changes and improvements you would make in taking this from prototype to production-ready quality.

## Commands
```
docker build -t zerotier-webhook-service .
docker run -d -p 8080:8080 --name zerotier-webhook-service zerotier-webhook-service
```

```
curl -X POST http://localhost:8080/event -H "Content-Type: application/json" -d '{
  "hookd_id": "test_hookd_id",
  "org_id": "test_org_id",
  "hook_type": "test_hook_type"
}'
```
