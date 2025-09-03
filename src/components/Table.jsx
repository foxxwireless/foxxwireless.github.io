import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import Button from "./Button";
import VendorForm from "./VendorForm";
import "../styles/Table.css";

export default function Table() {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingVendor, setEditingVendor] = useState(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchVendors();
  }, []);

  async function fetchVendors() {
    setLoading(true);
    const { data, error } = await supabase.from("vendors").select("*");
    if (error) console.error(error);
    else setVendors(data);
    setLoading(false);
  }

  async function deleteVendor(id) {
    if (window.confirm("Are you sure you want to delete this vendor?")) {
      const { error } = await supabase.from("vendors").delete().eq("id", id);
      if (error) console.error(error);
      else fetchVendors();
    }
  }

  return (
    <div className="table-container">
      <div style={{ marginBottom: "1rem" }}>
        <Button
          text="Add Vendor"
          type="primary"
          onClick={() => {
            setEditingVendor(null);
            setShowForm(true);
          }}
        />
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="vendor-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Contact</th>
              <th>Phone</th>
              <th>Last Setup Date</th>
              <th>Permission</th>
              <th>Notes</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {vendors.map((v) => (
              <tr key={v.id}>
                <td>{v.name}</td>
                <td>{v.contact}</td>
                <td>{v.phone}</td>
                <td>{v.last_setup_date}</td>
                <td>{v.permission ? "Yes" : "No"}</td>
                <td>{v.notes}</td>
                <td>
                  <Button
                    text="Edit"
                    type="primary"
                    onClick={() => {
                      setEditingVendor(v);
                      setShowForm(true);
                    }}
                  />
                  <Button text="Delete" type="secondary" onClick={() => deleteVendor(v.id)} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {showForm && (
        <VendorForm
          vendor={editingVendor}
          onClose={() => setShowForm(false)}
          onSaved={fetchVendors}
        />
      )}
    </div>
  );
}
