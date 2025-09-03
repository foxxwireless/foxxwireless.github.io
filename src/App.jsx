import React from "react";
import Background from "./components/Background";
import Header from "./components/Header";
import Drawer from "./components/Drawer";
import Table from "./components/Table";
import "./styles/App.css";

export default function App() {
  return (
    <div className="app">
      <Background />
      <Header />
      <Drawer />
      <main className="main-content">
        <Table />
      </main>
    </div>
  );
}
