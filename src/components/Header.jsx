import React from "react";
import foxIcon from "../assets/fox-icon.png";
import "../styles/Header.css";

export default function Header() {
  return (
    <header className="header">
      <img src={foxIcon} alt="Fox Icon" className="fox-icon" />
      <h1>Foxx Wireless Dashboard</h1>
    </header>
  );
}
