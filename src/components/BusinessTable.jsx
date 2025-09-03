import React from "react";
import "../styles/BusinessTable.css";

export default function BusinessTable({ businesses, editBusiness, deleteBusiness }) {
  const dayOptions = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const timeOptions = ["Morning", "Afternoon", "All Day"];

  return (
    <table className="business-table">
      <thead>
        <tr>
          <th>Business</th>
          <th>Address</th>
          <th>City</th>
          <th>State</th>
          <th>Contact</th>
          <th>Phone</th>
          <th>Notes</th>
          <th>Permission</th>
          <th>Days</th>
          <th>Times</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {businesses.map(b => (
          <tr key={b.id}>
            <td>{b.name}</td>
            <td>{b.address}</td>
            <td>{b.city}</td>
            <td>{b.state}</td>
            <td>{b.contact_name}</td>
            <td>{b.phone}</td>
            <td>{b.notes}</td>
            <td>{b.permission}</td>
            <td>
              {dayOptions.map(day => <input key={day} type="checkbox" checked={b.days?.includes(day)} readOnly />)}
            </td>
            <td>
              {timeOptions.map(time => <input key={time} type="checkbox" checked={b.times?.includes(time)} readOnly />)}
            </td>
            <td>
              <button onClick={() => editBusiness(b)}>Edit</button>
              <button onClick={() => deleteBusiness(b.id)}>Delete</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
