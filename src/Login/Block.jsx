import React from "react";
import "./Block.css";

export default function Block() {
  return (
    <div className="block-page">
      <div className="block-card">
        <h1>🚫 Access Denied</h1>
        <p>Your account has been blocked by the admin.</p>
        <p>Please contact support for more information.</p>
      </div>
    </div>
  );
}
