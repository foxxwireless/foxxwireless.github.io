import React from "react";
import Button from "./Button";

function VendorTable({ vendors, setEditingVendor, setShowForm, deleteVendor }) {
  return (
    <table className="vendor-table">
      <thead>
        <tr>
          <th>Name</th>
          <th>Contact</th>
          <th>Phone</th>
          <th>Last Setup Date</th>
          <th>Day</th>
          <th>Time</th>
          <th>Permission</th>
          <th>Notes</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {vendors.map((vendor) => (
          <tr key={vendor.id}>
            <td>{vendor.name}</td>
            <td>{vendor.contact}</td>
            <td>{vendor.phone}</td>
            <td>{vendor.last_setup_date}</td>
            <td>{vendor.day}</td>
            <td>{vendor.time}</td>
            <td>{vendor.permission}</td>
            <td>{vendor.notes}</td>
            <td>
              <Button
                text="Edit"
                type="secondary"
                onClick={() => {
                  setEditingVendor(vendor);
                  setShowForm(true);
                }}
              />
              <Button
                text="Delete"
                type="secondary"
                onClick={() => deleteVendor(vendor.id)}
              />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default VendorTable;
