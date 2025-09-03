import React from "react";
import "../styles/Button.css";

export default function Button({ text, onClick, type = "primary" }) {
  return (
    <button className={`btn ${type}`} onClick={onClick}>
      {text}
    </button>
  );
}
