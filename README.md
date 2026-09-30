# HubSpot CRM Contacts

Small Node.js script that fetches the first 10 contacts from HubSpot CRM via the Contacts API.

## What it does

- Loads `HUBSPOT_ACCESS_TOKEN` from a local `.env` file (via `dotenv`)
- Sends an async `GET` request with Axios to  
  `https://api.hubapi.com/crm/v3/objects/contacts?limit=10`
- Sends the token as `Authorization: Bearer <token>`
- Prints the contact results as JSON
- Handles common API errors (401, 429, and other HTTP/network failures) without crashing unsafely or logging the token

## Setup

1. Create a [HubSpot Private App](https://developers.hubspot.com/docs/api/private-apps) with at least the `crm.objects.contacts.read` scope, then copy its access token.

2. Copy the example env file and add your token:

   ```bash
   cp .env.example .env
   ```

   Edit `.env`:

   ```
   HUBSPOT_ACCESS_TOKEN=your-token-here
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

## Run

```bash
npm start
```

## Notes

- Never commit a real token. `.env` is gitignored; use `.env.example` as the template.
- ESM (`"type": "module"`) is used throughout.
