import "dotenv/config";
import axios from "axios";

const HUBSPOT_API_BASE = "https://api.hubapi.com";
const CONTACTS_ENDPOINT = "/crm/v3/objects/contacts";
const TOKEN_ENV_VAR = "HUBSPOT_ACCESS_TOKEN";

/**
 * Fetches the first 10 contacts from HubSpot CRM.
 * Auth: Bearer token from HUBSPOT_ACCESS_TOKEN (see .env.example).
 */
async function fetchContacts() {
  const token = process.env[TOKEN_ENV_VAR];

  if (!token) {
    console.error(
      `Missing ${TOKEN_ENV_VAR}. Copy .env.example to .env and set your Private App access token.`
    );
    process.exitCode = 1;
    return;
  }

  try {
    const response = await axios.get(
      `${HUBSPOT_API_BASE}${CONTACTS_ENDPOINT}`,
      {
        params: { limit: 10 },
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    const contacts = response.data?.results ?? [];
    console.log(`Fetched ${contacts.length} contact(s):\n`);
    console.log(JSON.stringify(contacts, null, 2));
  } catch (error) {
    handleRequestError(error);
    process.exitCode = 1;
  }
}

/**
 * Logs useful Axios/HTTP error details without exposing the access token.
 */
function handleRequestError(error) {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status;
    const hubspotMessage =
      error.response?.data?.message ||
      error.response?.data?.category ||
      error.message;

    if (status === 401) {
      console.error(
        "Unauthorized (401): the access token is missing, invalid, or lacks crm.objects.contacts.read scope."
      );
      return;
    }

    if (status === 429) {
      console.error(
        "Rate limited (429): too many requests. Wait and try again later."
      );
      return;
    }

    if (status) {
      console.error(`HubSpot API error (${status}): ${hubspotMessage}`);
      return;
    }

    // Network / timeout / DNS failures (no HTTP response)
    console.error(`Request failed: ${error.message}`);
    return;
  }

  console.error(`Unexpected error: ${error?.message ?? String(error)}`);
}

fetchContacts();
