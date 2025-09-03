import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import Button from "./Button";

function VendorForm({ vendor, onClose, onSaved }) {
  const [formData, setFormData] = useState({
    name: "",
    contact: "",
    phone: "",
    last_setup_date: "",
    day: "",
    time: "",
    permission: "Yes",
    notes: "",
  });

  useEffect(() => {
    if (vendor) setFormData({ ...vendor });
  }, [vendor]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (vendor) {
      // Update
      const { error } = await supabase
        .from("vendors")
        .update(formData)
        .eq("id", vendor.id);
      if (error) console.error(error);
    } else {
      // Insert
      const { error } = await supabase.from("vendors").insert([formData]);
      if (error) console.error(error);
    }

    onSaved();
    onClose();
  };

  return (
    <div className="vendor-form-backdrop">
      <form className="vendor-form" onSubmit={handleSubmit}>
        <h2>{vendor ? "Edit Vendor" : "Add Vendor"}</h2>

        <input
          type="text"
          name="name"
          placeholder="Vendor Name"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="contact"
          placeholder="Contact Name"
          value={formData.contact}
          onChange={handleChange}
        />

        <input
          type="text"
          name="phone"
          placeholder="Phone"
          value={formData.phone}
          onChange={handleChange}
        />

        <input
          type="date"
          name="last_setup_date"
          placeholder="Last Setup Date"
          value={formData.last_setup_date}
          onChange={handleChange}
        />

        <input
          type="text"
          name="day"
          placeholder="Day"
          value={formData.day}
          onChange={handleChange}
        />

        <input
          type="text"
          name="time"
          placeholder="Time"
          value={formData.time}
          onChange={handleChange}
        />

        <label>
          Permission:
          <select
            name="permission"
            value={formData.permission}
            onChange={handleChange}
          >
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        </label>

        <textarea
          name="notes"
          placeholder="Notes"
          value={formData.notes}
          onChange={handleChange}
        />

        <div className="vendor-form-buttons">
          <Button text="Cancel" type="secondary" onClick={onClose} />
          <Button text={vendor ? "Update" : "Add"} type="primary" />
        </div>
      </form>
    </div>
  );
}

export default VendorForm;
