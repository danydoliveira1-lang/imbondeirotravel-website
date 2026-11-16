
"use client";

import { useEffect, useState } from "react";

export default function InstagramInbox() {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadConversations() {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        "/api/admin/instagram-inbox",
        {
          method: "GET",
          cache: "no-store",
          credentials: "same-origin",
        }
      );

      if (!response.ok) {
        throw new Error(
          "Unable to load Instagram conversations."
        );
      }

      const result = await response.json();

      if (
        result.read_only !== true ||
        !Array.isArray(result.conversations)
      ) {
        throw new Error(
          "Unexpected Instagram Inbox response."
        );
      }

      setConversations(result.conversations);
    } catch (err) {
      setError(
        err.message || "Instagram Inbox is unavailable."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadConversations();
  }, []);

  return (
    <section
      style={{
        padding: "28px",
        background: "#F8F5EF",
        borderRadius: "18px",
        color: "#173B30",
        border: "1px solid #E7DFD0",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "12px",
          marginBottom: "24px",
        }}
      >
        <div>
          <h2 style={{ margin: 0 }}>
            Instagram Inbox
          </h2>

          <p
            style={{
              marginTop: "8px",
              color: "#6D756F",
            }}
          >
            Imbondeiro Travel · Command Centre
          </p>
        </div>

        <span
          style={{
            padding: "8px 14px",
            borderRadius: "20px",
            background: "#E7EDE7",
            color: "#285643",
            fontSize: "13px",
            fontWeight: 600,
          }}
        >
          Read-only · Development
        </span>
      </div>

      {loading ? (
        <p role="status">
          Loading Instagram conversations...
        </p>
      ) : error ? (
        <div role="alert">
          <p>{error}</p>

          <button
            type="button"
            onClick={loadConversations}
          >
            Try again
          </button>
        </div>
      ) : conversations.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: "48px 20px",
            border: "1px dashed #D5C5A8",
            borderRadius: "14px",
            background: "#FFFCF7",
          }}
        >
          <div
            aria-hidden="true"
            style={{
              fontSize: "36px",
              marginBottom: "12px",
            }}
          >
            ✉
          </div>

          <h3 style={{ marginBottom: "10px" }}>
            No Instagram conversations yet
          </h3>

          <p
            style={{
              color: "#77766F",
              maxWidth: "420px",
              margin: "0 auto",
              lineHeight: 1.6,
            }}
          >
            Instagram conversations will appear
            here once message storage has been
            enabled and tested.
          </p>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gap: "12px",
          }}
        >
          {conversations.map((conversation) => (
            <article
              key={conversation.id}
              style={{
                background: "#FFFFFF",
                border: "1px solid #E4D9C6",
                borderRadius: "12px",
                padding: "18px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                  gap: "8px",
                }}
              >
                <strong>
                  Instagram contact ·{" "}
                  {conversation.instagram_sender_id}
                </strong>

                <span>
                  {conversation.status}
                </span>
              </div>

              <p
                style={{
                  color: "#77766F",
                  fontSize: "13px",
                  marginBottom: 0,
                }}
              >
                Last message:{" "}
                {conversation.last_message_at
                  ? new Date(
                      conversation.last_message_at
                    ).toLocaleString()
                  : "Not available"}
              </p>
            </article>
          ))}
        </div>
      )}

      <p
        style={{
          fontSize: "12px",
          color: "#77766F",
          marginTop: "22px",
          borderTop: "1px solid #E7DFD0",
          paddingTop: "14px",
        }}
      >
        Development preview only. Sending,
        replying and message storage are
        currently disabled.
      </p>
    </section>
  );
}
