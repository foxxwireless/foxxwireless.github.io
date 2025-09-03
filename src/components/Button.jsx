import React from "react";

function Button({ text, type = "primary", onClick }) {
  return (
    <button
      className={type === "primary" ? "primary" : "secondary"}
      onClick={onClick}
    >
      {text}
    </button>
  );
}

export default Button;
