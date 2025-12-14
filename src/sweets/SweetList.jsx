import { useEffect, useState } from "react";
import api from "../api/axios";

const SweetList = () => {
  const [sweets, setSweets] = useState([]);

  useEffect(() => {
    api.get("/api/sweets")
      .then(res => setSweets(res.data))
      .catch(() => alert("Unauthorized"));
  }, []);

  return (
    <div>
      <h2>Sweets</h2>
      {sweets.map(s => (
        <div key={s.id}>
          <h4>{s.name}</h4>
          <p>{s.category} - ₹{s.price}</p>
          <p>Qty: {s.quantity}</p>
        </div>
      ))}
    </div>
  );
};

export default SweetList;
