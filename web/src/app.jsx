import React, {useEffect, useState} from "react";

export default function App() {
    const [items, setItems] = useState([]);
    const [source, setSource] = useState("");
    const [name, setName] = useState("");
    const [error, setError] = useState("");


async function load() {
    setError("");
    const response = await fetch("/api/items");
    const json = await response.json();

    if (!response.ok) {
        setError(json.error || "Failed");
        return;
    }
    setSource(json.source);
    setItems(json.items);
}
async function add() {
    setError("");
    const response = await fetch("/api/items", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({name}),
    });
    const json = await response.json();
    
    if (!response.ok) {
        setError(json.error || "Failed");
        return;
    }
    setName("");
    await load();
}

useEffect(() => {
    load();
}, []);

return (
    <div style={{ fontFamily: "system-ui", padding: 24, maxWidth: 720, margin: "0 auto" }}>
      <h1>Multi-service Docker App</h1>

      <p>
        Data source: <b>{source || "..."}</b>
      </p>

      <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="New item name"
          style={{ flex: 1, padding: 8 }}
        />
        <button onClick={add} style={{ padding: "8px 12px" }}>
          Add
        </button>
        <button onClick={load} style={{ padding: "8px 12px" }}>
          Refresh
        </button>
      </div>

      {err ? <p style={{ color: "crimson" }}>{err}</p> : null}

      <ul>
        {items.map((x) => (
          <li key={x._id}>{x.name}</li>
        ))}
      </ul>
    </div>
  );

}