import React from "react";
import Button from "./Button";

export default function VendorTable({ vendors, setEditingVendor, setShowForm, deleteVendor }) {
  return (
    <table className="vendor-table">
      <thead>
        <tr>
          <th>Name</th>
          <th>Contact</th>
          <th>Phone</th>
          <th>Last Setup</th>
          <th>Permission</th>
          <th>Best Days</th>
          <th>Best Times</th>
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
            <td>{v.best_days?.join(", ")}</td>
            <td>{v.best_times?.join(", ")}</td>
            <td>{v.notes}</td>
            <td>
              <Button
                text="Edit"
                type="primary"
                onClick={() => { setEditingVendor(v); setShowForm(true); }}
              />
              <Button text="Delete" type="secondary" onClick={() => deleteVendor(v.id)} />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
