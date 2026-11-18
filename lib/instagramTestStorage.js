
const APPROVED_DEV_URL =
  "https://suvgbddhdayufulbrxou.supabase.co";

export async function storeInstagramTestMessage({
  accountId,
  senderId,
  messageId,
  messageText,
}) {
  // Never permit this operation in Production.
  if (
    process.env.VERCEL_ENV !== "preview" ||
    process.env.VERCEL_GIT_COMMIT_REF !==
      "feature/africa-middle-east-map"
  ) {
    throw new Error(
      "Instagram test storage is restricted to Development Preview."
    );
  }

  // Separate opt-in switch. Not enabled yet.
  if (
    process.env.INSTAGRAM_TEST_STORAGE_ENABLED !== "true"
  ) {
    throw new Error(
      "Instagram test storage is disabled."
    );
  }

  const url = process.env.SUPABASE_DEV_URL;
  const key = process.env.SUPABASE_DEV_SERVICE_ROLE_KEY;

  if (
    !url ||
    !key ||
    url.replace(/\/$/, "") !== APPROVED_DEV_URL
  ) {
    throw new Error(
      "Invalid Instagram Development database configuration."
    );
  }

  // Only synthetic identifiers are accepted.
  if (
    accountId !== "imbondeiro-dev-test" ||
    typeof senderId !== "string" ||
    !/^test-sender-[a-zA-Z0-9-]+$/.test(senderId) ||
    senderId.length > 255 ||
    typeof messageId !== "string" ||
    !/^test-message-[a-zA-Z0-9-]+$/.test(messageId) ||
    messageId.length > 255 ||
    typeof messageText !== "string" ||
    !messageText.trim() ||
    messageText.length > 10000
  ) {
    throw new Error(
      "Only valid synthetic Instagram test messages are accepted."
    );
  }

  const response = await fetch(
    `${APPROVED_DEV_URL}/rest/v1/rpc/instagram_store_test_message`,
    {
      method: "POST",
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        p_account_id: accountId,
        p_sender_id: senderId,
        p_message_id: messageId,
        p_message_text: messageText,
      }),
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error(
      `Instagram test storage failed: ${response.status}`
    );
  }

  const result = await response.json();

  if (
    !Array.isArray(result) ||
    result.length !== 1 ||
    typeof result[0].was_duplicate !== "boolean"
  ) {
    throw new Error(
      "Unexpected Instagram test storage response."
    );
  }

  return result[0];
}
