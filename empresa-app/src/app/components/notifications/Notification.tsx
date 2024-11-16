"use client";

import React from "react";

interface NotificationProps {
  message: string;
  type: "success" | "error" | "warning";
  onClose: () => void;
}

export default function Notification({ message, type, onClose }: NotificationProps) {
  const getStyles = (type: string) => {
    switch (type) {
      case "success":
        return {
          backgroundColor: "#4CAF50", // Verde
          color: "#fff",
        };
      case "error":
        return {
          backgroundColor: "#F44336", // Vermelho
          color: "#fff",
        };
      case "warning":
        return {
          backgroundColor: "#FF9800", // Laranja
          color: "#fff",
        };
      default:
        return {};
    }
  };

  return (
    <div style={{ ...styles.container, ...getStyles(type) }}>
      <span style={styles.message}>{message}</span>
      <button style={styles.closeButton} onClick={onClose}>
        X
      </button>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px 20px",
    borderRadius: "5px",
    margin: "10px 0",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  },
  message: {
    flex: 1,
    fontSize: "16px",
  },
  closeButton: {
    background: "none",
    border: "none",
    color: "#fff",
    fontSize: "16px",
    cursor: "pointer",
  },
};
