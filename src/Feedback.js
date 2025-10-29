import React, { useState } from "react";
import axios from "axios";
function Feedback() {
  const [text, setText] = useState('');
  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    await axios.post(
      "/api/feedback/",
      { text },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setText(""); alert("Feedback sent");
  };
  return (
    <form className="container mt-4" onSubmit={handleSubmit}>
      <h2>Feedback</h2>
      <textarea className="form-control mb-2" value={text} onChange={e=>setText(e.target.value)} placeholder="Your feedback or suggestions..."/>
      <button className="btn btn-warning" type="submit">Submit</button>
    </form>
  );
}
export default Feedback;
