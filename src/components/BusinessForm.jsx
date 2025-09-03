import React, { useState, useEffect } from "react";
import { supabase } from "./supabaseClient";
import "./BusinessForm.css";

const dayOptions = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const timeOptions = ["Morning", "Afternoon", "All Day"];
const stateOptions = ["AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA","KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ","NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT","VA","WA","WV","WI","WY"];

export default function BusinessForm({ fetchBusinesses, editingBusiness, clearEditing }) {
  const [businessName, setBusinessName] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("AL");
  const [contactName, setContactName] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [permission, setPermission] = useState(true);
  const [days, setDays] = useState([]);
  const [times, setTimes] = useState([]);

  useEffect(() => {
    if (editingBusiness) {
      setBusinessName(editingBusiness.name);
      setAddress(editingBusiness.address);
      setCity(editingBusiness.city || "");
      setState(editingBusiness.state || "AL");
      setContactName(editingBusiness.contact_name);
      setPhone(editingBusiness.phone);
      setNotes(editingBusiness.notes);
      setPermission(editingBusiness.permission === "Yes");
      setDays(editingBusiness.days || []);
      setTimes(editingBusiness.times || []);
    }
  }, [editingBusiness]);

  const handleDayChange = (day) => {
    setDays(prev => prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]);
  };

  const handleTimeChange = (time) => {
    setTimes(prev => prev.includes(time) ? prev.filter(t => t !== time) : [...prev, time]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const businessData = {
      name: businessName,
      address,
      city,
      state,
      contact_name: contactName,
      phone,
      notes,
      permission: permission ? "Yes" : "No",
      days,
      times
    };

    let error;
    if (editingBusiness) {
      ({ error } = await supabase.from("businesses").update(businessData).eq("id", editingBusiness.id));
    } else {
      ({ error } = await supabase.from("businesses").insert([businessData]));
    }

    if (error) alert("Error: " + error.message);
    else {
      resetForm();
      fetchBusinesses();
      clearEditing();
    }
  };

  const resetForm = () => {
    setBusinessName("");
    setAddress("");
    setCity("");
    setState("AL");
    setContactName("");
    setPhone("");
    setNotes("");
    setPermission(true);
    setDays([]);
    setTimes([]);
  };

  return (
    <form className="business-form" onSubmit={handleSubmit}>
      <input type="text" placeholder="Business Name" value={businessName} onChange={e => setBusinessName(e.target.value)} required />
      <input type="text" placeholder="Address" value={address} onChange={e => setAddress(e.target.value)} required />
      <input type="text" placeholder="City" value={city} onChange={e => setCity(e.target.value)} required />
      <select value={state} onChange={e => setState(e.target.value)}>
        {stateOptions.map(s => <option key={s} value={s}>{s}</option>)}
      </select>
      <input type="text" placeholder="Contact Name" value={contactName} onChange={e => setContactName(e.target.value)} />
      <input type="text" placeholder="Phone" value={phone} onChange={e => setPhone(e.target.value)} />
      <input type="text" placeholder="Notes" value={notes} onChange={e => setNotes(e.target.value)} />

      <label>
        <input type="checkbox" checked={permission} onChange={() => setPermission(!permission)} />
        Permission
      </label>

      <div className="checkbox-group">
        <label>Days:</label>
        {dayOptions.map(day => (
          <label key={day}>
            <input type="checkbox" checked={days.includes(day)} onChange={() => handleDayChange(day)} />
            {day}
          </label>
        ))}
      </div>

      <div className="checkbox-group">
        <label>Times:</label>
        {timeOptions.map(time => (
          <label key={time}>
            <input type="checkbox" checked={times.includes(time)} onChange={() => handleTimeChange(time)} />
            {time}
          </label>
        ))}
      </div>

      <button type="submit">{editingBusiness ? "Update" : "Add"} Business</button>
      {editingBusiness && <button type="button" onClick={() => { resetForm(); clearEditing(); }}>Cancel</button>}
    </form>
  );
}
