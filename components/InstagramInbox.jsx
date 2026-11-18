
"use client";

import { useEffect, useRef, useState } from "react";

const COLORS = {
  green: "#173B30",
  muted: "#77766F",
  border: "#E4D9C6",
  ivory: "#F8F5EF",
  cream: "#FFFCF7",
};

function formatDate(value) {
  if (!value) return "Not available";

  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "Not available"
    : date.toLocaleString();
}

export default function InstagramInbox() {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedId, setSelectedId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [messagesError, setMessagesError] = useState("");

  const requestRef = useRef(0);

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

  async function openConversation(conversationId) {
    // Clicking an open conversation closes it.
    if (selectedId === conversationId) {
      requestRef.current += 1;
      setSelectedId(null);
      setMessages([]);
      setMessagesError("");
      setMessagesLoading(false);
      return;
    }

    const requestId = ++requestRef.current;

    setSelectedId(conversationId);
    setMessages([]);
    setMessagesError("");
    setMessagesLoading(true);

    try {
      const params = new URLSearchParams({
        conversation_id: conversationId,
      });

      const response = await fetch(
        `/api/admin/instagram-messages?${params.toString()}`,
        {
          method: "GET",
          cache: "no-store",
          credentials: "same-origin",
        }
      );

      if (!response.ok) {
        throw new Error(
          "Unable to load conversation messages."
        );
      }

      const result = await response.json();

      if (
        result.read_only !== true ||
        result.conversation_id !== conversationId ||
        !Array.isArray(result.messages)
      ) {
        throw new Error(
          "Unexpected Instagram messages response."
        );
      }

      // Ignore an older response if another
      // conversation was selected meanwhile.
      if (requestRef.current !== requestId) return;

      setMessages(result.messages);
    } catch (err) {
      if (requestRef.current !== requestId) return;

      setMessagesError(
        err.message || "Messages are unavailable."
      );
    } finally {
      if (requestRef.current === requestId) {
        setMessagesLoading(false);
      }
    }
  }

  return (
    <section
      style={{
        padding: "28px",
        background: COLORS.ivory,
        borderRadius: "18px",
        color: COLORS.green,
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
            background: COLORS.cream,
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
              color: COLORS.muted,
              maxWidth: "420px",
              margin: "0 auto",
              lineHeight: 1.6,
            }}
          >
            Instagram conversations will appear
            here when test data is available.
          </p>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gap: "12px",
          }}
        >
          {conversations.map((conversation) => {
            const isSelected =
              selectedId === conversation.id;

            return (
              <article
                key={conversation.id}
                style={{
                  background: "#FFFFFF",
                  border: `1px solid ${
                    isSelected
                      ? "#B99A62"
                      : COLORS.border
                  }`,
                  borderRadius: "12px",
                  overflow: "hidden",
                }}
              >
                <button
                  type="button"
                  aria-expanded={isSelected}
                  aria-controls={
                    `instagram-messages-${conversation.id}`
                  }
                  onClick={() =>
                    openConversation(conversation.id)
                  }
                  style={{
                    width: "100%",
                    padding: "18px",
                    background: "transparent",
                    border: 0,
                    color: COLORS.green,
                    cursor: "pointer",
                    textAlign: "left",
                    font: "inherit",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      flexWrap: "wrap",
                      gap: "8px",
                    }}
                  >
                    <strong>
                      Instagram contact ·{" "}
                      {conversation.instagram_sender_id}
                    </strong>

                    <span
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                      }}
                    >
                      <span
                        style={{
                          textTransform: "capitalize",
                          fontSize: "13px",
                        }}
                      >
                        {conversation.status}
                      </span>

                      <span aria-hidden="true">
                        {isSelected ? "▲" : "▼"}
                      </span>
                    </span>
                  </div>

                  <p
                    style={{
                      color: COLORS.muted,
                      fontSize: "13px",
                      marginBottom: 0,
                    }}
                  >
                    Last message:{" "}
                    {formatDate(
                      conversation.last_message_at
                    )}
                  </p>
                </button>

                {isSelected && (
                  <div
                    id={
                      `instagram-messages-${conversation.id}`
                    }
                    style={{
                      borderTop:
                        "1px solid #E7DFD0",
                      padding: "20px",
                      background: COLORS.cream,
                    }}
                  >
                    {messagesLoading ? (
                      <p role="status">
                        Loading messages...
                      </p>
                    ) : messagesError ? (
                      <div role="alert">
                        <p>{messagesError}</p>

                        <button
                          type="button"
                          onClick={() => {
                            requestRef.current += 1;
                            setSelectedId(null);
                            openConversation(
                              conversation.id
                            );
                          }}
                        >
                          Try again
                        </button>
                      </div>
                    ) : messages.length === 0 ? (
                      <p style={{ color: COLORS.muted }}>
                        No messages in this conversation.
                      </p>
                    ) : (
                      <div
                        aria-label="Conversation messages"
                        style={{
                          display: "grid",
                          gap: "14px",
                        }}
                      >
                        {messages.map((message) => {
                          const outgoing =
                            message.direction ===
                            "outgoing";

                          return (
                            <div
                              key={message.id}
                              style={{
                                display: "flex",
                                justifyContent:
                                  outgoing
                                    ? "flex-end"
                                    : "flex-start",
                              }}
                            >
                              <div
                                style={{
                                  maxWidth: "85%",
                                  padding:
                                    "13px 16px",
                                  borderRadius: "14px",
                                  background: outgoing
                                    ? "#E7EDE7"
                                    : "#F0EBE2",
                                  color: COLORS.green,
                                  overflowWrap:
                                    "anywhere",
                                  whiteSpace:
                                    "pre-wrap",
                                }}
                              >
                                <div>
                                  {message.message_text ||
                                    `[${message.message_type}]`}
                                </div>

                                <p
                                  style={{
                                    margin:
                                      "8px 0 0",
                                    fontSize: "11px",
                                    color: COLORS.muted,
                                  }}
                                >
                                  {outgoing
                                    ? "Outgoing"
                                    : "Incoming"}
                                  {" · "}
                                  {formatDate(
                                    message.sent_at
                                  )}
                                </p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    <p
                      style={{
                        marginTop: "20px",
                        marginBottom: 0,
                        fontSize: "12px",
                        color: COLORS.muted,
                      }}
                    >
                      🔒 Read-only conversation.
                      Sending and replying are disabled.
                    </p>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      )}

      <p
        style={{
          fontSize: "12px",
          color: COLORS.muted,
          marginTop: "22px",
          borderTop: "1px solid #E7DFD0",
          paddingTop: "14px",
        }}
      >
        Development preview only. Sending,
        replying and automatic message storage
        are currently disabled.
      </p>
    </section>
  );
}
