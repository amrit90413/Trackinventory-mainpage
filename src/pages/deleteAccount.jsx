import React from 'react';

const DeleteAccount = () => {
  return (
    <div style={{ fontFamily: 'Inter, system-ui, Segoe UI, Roboto, Helvetica Neue, Arial', lineHeight: 1.6, color: '#222', margin: 0, padding: '24px', background: '#f7f9fc' }}>
      <div style={{ maxWidth: '800px', margin: '28px auto', background: '#fff', borderRadius: '8px', boxShadow: '0 6px 18px rgba(20,30,50,0.06)', padding: '28px' }}>
        <h1 style={{ fontSize: '20px', margin: '0 0 8px' }}>How to deactivate your TrackInventory account</h1>
        <p style={{ color: '#6b7280', fontSize: '13px' }}>
          This page explains how a user can deactivate their account and what data will be removed or retained. It is published by <strong>TrackInventory</strong>.
        </p>

        <h2>In-app deactivation (recommended)</h2>
        <p>To deactivate your account from within the app, follow these steps:</p>
        <ol>
          <li>Open the <strong>TrackInventory</strong> app on your device.</li>
          <li>
            Go to  <strong>Account Management</strong>.
          </li>
          <li>Select <strong>Deactivate Account</strong> and follow the on-screen instructions to confirm.</li>
        </ol>

        <h2>Request deactivation by email</h2>
        <p>
          If you cannot access the app, send an email to our support team and include your account email/phone number and a brief request:
        </p>
        <p>
          <code style={{ background: '#f4f6fb', padding: '2px 6px', borderRadius: '4px' }}>smartstock33@gmail.com</code>
        </p>
        <p style={{ color: '#6b7280', fontSize: '13px' }}>
          Example subject line:{' '}
          <code style={{ background: '#f4f6fb', padding: '2px 6px', borderRadius: '4px' }}>
            Request to deactivate my TrackInventory account (user@example.com)
          </code>
        </p>

        <div
          style={{
            background: '#fff9e6',
            borderLeft: '4px solid #ffd24a',
            padding: '12px',
            margin: '12px 0',
            borderRadius: '4px',
          }}
        >
          <strong>Important:</strong> For security, we may ask you to verify account ownership before processing the deactivation (e.g., by replying from your
          registered email or providing your phone number).
        </div>

        <h2>What we deactivate and delete</h2>
        <p>When an account is deactivated, we will remove or restrict access to the following data associated with the account:</p>
        <ul>
          <li>Account credentials (email, phone number) and user profile information.</li>
          <li>Uploaded photos and documents linked to the account (unless required for compliance).</li>
          <li>Account-specific preferences and saved settings.</li>
          <li>Analytics events tied to the account identifier.</li>
        </ul>

        <h2>What we may retain</h2>
        <p style={{ color: '#6b7280', fontSize: '13px' }}>
          In some cases, we retain limited data after deactivation for legal, security, or operational reasons:
        </p>
        <ul>
          <li>Aggregated or anonymized analytics data that does not identify you (retained indefinitely).</li>
          <li>
            Transaction records or logs required to comply with legal obligations (retained for up to <strong>90 days</strong> or as required by law).
          </li>
        </ul>

        <h2>Retention period</h2>
        <p>
          After you request deactivation, we will process your request within <strong>30 days</strong>. Some content (such as cached copies or backups) may take up to{' '}
          <strong>90 days</strong> to be fully removed from all systems.
        </p>

        <h2>If you change your mind</h2>
        <p>
          If you deactivate your account, you may not be able to recover the data. Contact us at{' '}
          <code style={{ background: '#f4f6fb', padding: '2px 6px', borderRadius: '4px' }}>smartstock33@gmail.com</code> within 7 days and we will try to help.
        </p>

        <p>
          If you have any questions about deactivation or data retention, contact our support team at{' '}
          <a href="mailto:smartstock33@gmail.com">smartstock33@gmail.com</a>.
        </p>

        <p style={{ marginTop: '18px' }}>
          <a
            href="mailto:smartstock33@gmail.com?subject=Request%20to%20deactivate%20my%20TrackInventory%20account"
            style={{
              display: 'inline-block',
              padding: '10px 14px',
              borderRadius: '6px',
              background: '#0b74de',
              color: '#fff',
              textDecoration: 'none',
            }}
          >
            Request account deactivation
          </a>
        </p>

        <footer style={{ marginTop: '20px', color: '#6b7280', fontSize: '13px' }}>
          <div>This page was last updated: <strong>November 2025</strong></div>
        </footer>
      </div>
    </div>
  );
};

export default DeleteAccount;
