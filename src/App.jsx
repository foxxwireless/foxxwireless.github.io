import React, { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";
import VendorForm from "./components/VendorForm";
import VendorTable from "./components/VendorTable";
import Button from "./components/Button";
import logo from "./assets/fox-icon.png"; // Import fox-icon
import "./styles/App.css";

function App() {
  const [vendors, setVendors] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingVendor, setEditingVendor] = useState(null);

  const fetchVendors = async () => {
    const { data, error } = await supabase.from("vendors").select("*");
    if (error) console.error(error);
    else setVendors(data);
  };

  useEffect(() => {
    fetchVendors();
  }, []);

  const deleteVendor = async (id) => {
    if (window.confirm("Are you sure you want to delete this vendor?")) {
      const { error } = await supabase.from("vendors").delete().eq("id", id);
      if (error) console.error(error);
      else fetchVendors();
    }
  };

  const handleSaved = () => {
    fetchVendors();
    setEditingVendor(null);
  };

  return (
    <div className="app">
      <header>
        <div className="logo-container">
          <img src={logo} alt="Foxx Icon" />
          <h1>Foxx Wireless Locations</h1>
        </div>
        <Button text="Add Vendor" type="primary" onClick={() => setShowForm(true)} />
      </header>

      <VendorTable
        vendors={vendors}
        setEditingVendor={setEditingVendor}
        setShowForm={setShowForm}
        deleteVendor={deleteVendor}
      />

      {showForm && (
        <VendorForm
          vendor={editingVendor}
          onClose={() => { setShowForm(false); setEditingVendor(null); }}
          onSaved={handleSaved}
        />
      )}
    </div>
  );
}

export default App;
