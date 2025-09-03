import React, { useState, useEffect } from "react";
import { supabase } from "./supabaseClient";
import BusinessForm from "./components/BusinessForm";
import BusinessTable from "./components/BusinessTable";
import "./styles/App.css";

function App() {
  const [businesses, setBusinesses] = useState([]);
  const [editingBusiness, setEditingBusiness] = useState(null);

  useEffect(() => {
    fetchBusinesses();
  }, []);

  const fetchBusinesses = async () => {
    const { data, error } = await supabase.from("businesses").select("*").order("id", { ascending: true });
    if (!error) setBusinesses(data);
  };

  const editBusiness = (b) => setEditingBusiness(b);
  const clearEditing = () => setEditingBusiness(null);

  const deleteBusiness = async (id) => {
    if (window.confirm("Are you sure you want to delete this business?")) {
      const { error } = await supabase.from("businesses").delete().eq("id", id);
      if (error) alert("Error: " + error.message);
      else fetchBusinesses();
    }
  };

  return (
    <div className="app-container">
      <h1>Foxx Wireless Locations</h1>
      <BusinessForm fetchBusinesses={fetchBusinesses} editingBusiness={editingBusiness} clearEditing={clearEditing} />
      <BusinessTable businesses={businesses} editBusiness={editBusiness} deleteBusiness={deleteBusiness} />
    </div>
  );
}

export default App;
