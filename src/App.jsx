import React, { useState, useEffect } from "react";
import { supabase } from "./supabaseClient";
import "./styles/App.css";

function App() {
  const [businessName, setBusinessName] = useState("");
  const [address, setAddress] = useState("");
  const [contactName, setContactName] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [permission, setPermission] = useState(true); // true = Yes
  const [days, setDays] = useState([]);
  const [times, setTimes] = useState([]);
  const [businesses, setBusinesses] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const dayOptions = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const timeOptions = ["Morning", "Afternoon", "All Day"];

  useEffect(() => {
    fetchBusinesses();
  }, []);

  const fetchBusinesses = async () => {
    const { data, error } = await supabase
      .from("businesses")
      .select("*")
      .order("id", { ascending: true });
    if (!error) setBusinesses(data);
  };

  const handleDayChange = (day) => {
    setDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const handleTimeChange = (time) => {
    setTimes((prev) =>
      prev.includes(time) ? prev.filter((t) => t !== time) : [...prev, time]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const businessData = {
      name: businessName,
      address,
      contact_name: contactName,
      phone,
      notes,
      permission: permission ? "Yes" : "No",
      days,
      times,
    };

    let error;
    if (editingId) {
      ({ error } = await supabase
        .from("businesses")
        .update(businessData)
        .eq("id", editingId));
    } else {
      ({ error } = await supabase.from("businesses").insert([businessData]));
    }

    if (error) {
      alert("Error: " + error.message);
    } else {
      resetForm();
      fetchBusinesses();
    }
  };

  const handleEdit = (b) => {
    setBusinessName(b.name);
    setAddress(b.address);
    setContactName(b.contact_name);
    setPhone(b.phone);
    setNotes(b.notes);
    setPermission(b.permission === "Yes");
    setDays(b.days || []);
    setTimes(b.times || []);
    setEditingId(b.id);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this business?")) {
      const { error } = await supabase.from("businesses").delete().eq("id", id);
      if (error) alert("Error: " + error.message);
      else fetchBusinesses();
    }
  };

  const resetForm = () => {
    setBusinessName("");
    setAddress("");
    setContactName("");
    setPhone("");
    setNotes("");
    setPermission(true);
    setDays([]);
    setTimes([]);
    setEditingId(null);
  };

  return (
    <div className="app-container">
      <h1>Foxx Wireless Locations</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Business Name"
          value={businessName}
          onChange={(e) => setBusinessName(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Contact Name"
          value={contactName}
          onChange={(e) => setContactName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        <input
          type="text"
          placeholder="Notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />

        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={permission}
            onChange={() => setPermission(!permission)}
          />
          Permission
        </label>

        <div className="checkbox-group">
          <label>Days:</label>
          {dayOptions.map((day) => (
            <label key={day}>
              <input
                type="checkbox"
                checked={days.includes(day)}
                onChange={() => handleDayChange(day)}
              />
              {day}
            </label>
          ))}
        </div>

        <div className="checkbox-group">
          <label>Times:</label>
          {timeOptions.map((time) => (
            <label key={time}>
              <input
                type="checkbox"
                checked={times.includes(time)}
                onChange={() => handleTimeChange(time)}
              />
              {time}
            </label>
          ))}
        </div>

        <button type="submit">{editingId ? "Update" : "Add"} Business</button>
        {editingId && <button type="button" onClick={resetForm}>Cancel</button>}
      </form>

<table>
  <thead>
    <tr>
      <th>Business</th>
      <th>Address</th>
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
    {businesses.map((b) => (
      <tr key={b.id}>
        <td>{b.name}</td>
        <td>{b.address}</td>
        <td>{b.contact_name}</td>
        <td>{b.phone}</td>
        <td>{b.notes}</td>
        <td>{b.permission}</td>
        <td>
          {dayOptions.map((day) => (
            <input
              type="checkbox"
              key={day}
              checked={b.days?.includes(day)}
              readOnly
            />
          ))}
        </td>
        <td>
          {timeOptions.map((time) => (
            <input
              type="checkbox"
              key={time}
              checked={b.times?.includes(time)}
              readOnly
            />
          ))}
        </td>
        <td>
          <button onClick={() => handleEdit(b)}>Edit</button>
          <button onClick={() => handleDelete(b.id)}>Delete</button>
        </td>
      </tr>
    ))}
  </tbody>
</table>
    </div>
  );
}

export default App;
