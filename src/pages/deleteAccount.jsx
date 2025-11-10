import React from "react";

const DeleteAccount = () => {
  return (
    <div
      style={{
        fontFamily:
          "Inter, system-ui, Segoe UI, Roboto, Helvetica Neue, Arial",
        lineHeight: 1.6,
        color: "#222",
        margin: 0,
        padding: "24px",
        background: "#f7f9fc",
      }}
    >
      <div
        style={{
          maxWidth: "800px",
          margin: "28px auto",
          background: "#fff",
          borderRadius: "8px",
          boxShadow: "0 6px 18px rgba(20,30,50,0.06)",
          padding: "28px",
        }}
      >
        <h1 style={{ fontSize: "22px", margin: "0 0 10px" }}>
          How to deactivate your TrackInventory account
        </h1>
        <p style={{ color: "#6b7280", fontSize: "14px" }}>
          This page explains how you can deactivate your account, what data is
          deleted or retained, and how to reactivate it. Published by{" "}
          <strong>TrackInventory</strong>.
        </p>

        <h2>In-app deactivation (recommended)</h2>
        <p>To deactivate your account within the app, follow these steps:</p>
        <ol>
          <li>Open the <strong>TrackInventory</strong> app on your device.</li>
          <li>Go to <strong>Account Management</strong>.</li>
          <li>
            Select <strong>Deactivate Account</strong> and follow the
            on-screen steps to confirm.
          </li>
        </ol>

        <div
          style={{
            background: "#fff9e6",
            borderLeft: "4px solid #ffd24a",
            padding: "12px",
            margin: "12px 0",
            borderRadius: "4px",
          }}
        >
          <strong>Important:</strong> Your account will be deactivated
          immediately and scheduled for permanent deletion after{" "}
          <strong>30 days</strong>. You can reactivate it anytime within this
          30-day period by simply logging in again. After 30 days, all data
          associated with your account will be permanently deleted and cannot be
          recovered.
        </div>

        <h2>Request deactivation by email</h2>
        <p>
          If you cannot access the app, email our support team including your
          registered email or phone number and a short request:
        </p>
        <p>
          <code
            style={{
              background: "#f4f6fb",
              padding: "2px 6px",
              borderRadius: "4px",
            }}
          >
            smartstock33@gmail.com
          </code>
        </p>
        <p style={{ color: "#6b7280", fontSize: "13px" }}>
          Example subject line:{" "}
          <code
            style={{
              background: "#f4f6fb",
              padding: "2px 6px",
              borderRadius: "4px",
            }}
          >
            Request to deactivate my TrackInventory account
          </code>
        </p>

        <h2>What happens after deactivation</h2>
        <ul>
          <li>
            Your account credentials and user profile become inaccessible.
          </li>
          <li>
            Uploaded files and associated data are removed within 30–90 days.
          </li>
          <li>
            You can reactivate by logging in again within 30 days of
            deactivation.
          </li>
        </ul>

        <h2>What data we may retain</h2>
        <p style={{ color: "#6b7280", fontSize: "13px" }}>
          In some cases, we retain limited data for legal or operational
          reasons:
        </p>
        <ul>
          <li>
            Aggregated or anonymized analytics data (non-identifiable) — kept
            indefinitely.
          </li>
          <li>
            Transaction logs or records to meet legal requirements — kept up to{" "}
            <strong>90 days</strong>.
          </li>
        </ul>

        <h2>If you change your mind</h2>
        <p>
          You can contact us at{" "}
          <a href="mailto:smartstock33@gmail.com">
            smartstock33@gmail.com
          </a>{" "}
          within 7 days to cancel your deactivation request.
        </p>

        <p style={{ marginTop: "18px" }}>
          <a
            href="mailto:smartstock33@gmail.com?subject=Request%20to%20deactivate%20my%20TrackInventory%20account"
            style={{
              display: "inline-block",
              padding: "10px 14px",
              borderRadius: "6px",
              background: "#0b74de",
              color: "#fff",
              textDecoration: "none",
            }}
          >
            Request account deactivation
          </a>
        </p>

        <footer
          style={{
            marginTop: "20px",
            color: "#6b7280",
            fontSize: "13px",
          }}
        >
          <div>This page was last updated: <strong>November 2025</strong></div>
        </footer>
      </div>
    </div>
  );
};

export default DeleteAccount;
