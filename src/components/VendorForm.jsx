import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import Button from "./Button";
import "../styles/VendorForm.css";

export default function VendorForm({ vendor, onClose, onSaved }) {
  const [name, setName] = useState(vendor?.name || "");
  const [contact, setContact] = useState(vendor?.contact || "");
  const [phone, setPhone] = useState(vendor?.phone || "");
  const [lastSetup, setLastSetup] = useState(vendor?.last_setup_date || "");
  const [permission, setPermission] = useState(vendor?.permission || false);
  const [notes, setNotes] = useState(vendor?.notes || "");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (vendor) {
      // Update
      const { error } = await supabase
        .from("vendors")
        .update({ name, contact, phone, last_setup_date: lastSetup, permission, notes })
        .eq("id", vendor.id);
      if (error) console.error(error);
    } else {
      // Add
      const { error } = await supabase
        .from("vendors")
        .insert([{ name, contact, phone, last_setup_date: lastSetup, permission, notes }]);
      if (error) console.error(error);
    }

    onSaved();
    onClose();
  };

  return (
    <div className="vendor-form-backdrop">
      <form className="vendor-form" onSubmit={handleSubmit}>
        <h2>{vendor ? "Edit Vendor" : "Add Vendor"}</h2>
        <input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required />
        <input placeholder="Contact" value={contact} onChange={(e) => setContact(e.target.value)} />
        <input placeholder="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
        <input
          type="date"
          placeholder="Last Setup Date"
          value={lastSetup}
          onChange={(e) => setLastSetup(e.target.value)}
        />
        <select value={permission} onChange={(e) => setPermission(e.target.value === "true")}>
          <option value="true">Yes</option>
          <option value="false">No</option>
        </select>
        <textarea placeholder="Notes" value={notes} onChange={(e) => setNotes(e.target.value)} />
        <div className="vendor-form-buttons">
          <Button text="Save" type="primary" />
          <Button text="Cancel" type="secondary" onClick={onClose} />
        </div>
      </form>
    </div>
  );
}
