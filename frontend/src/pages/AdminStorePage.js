import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import ItemCard from "../components/ItemCard";

const AdminStorePage = () => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/items");
      const data = await response.json();
      setItems(data);
    } catch (error) {
      console.error("Error fetching items:", error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;

    try {
      const response = await fetch(`http://localhost:5000/api/items/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete item");
      }

      setItems(items.filter((item) => item._id !== id));
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  const handleUpdateQuantity = async (id, newQuantity) => {
    try {
      const response = await fetch(`http://localhost:5000/api/items/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity: newQuantity }),
      });

      if (!response.ok) {
        throw new Error("Failed to update quantity");
      }

      // Update state only if the backend update was successful
      setItems(
        items.map((item) =>
          item._id === id ? { ...item, quantity: newQuantity } : item
        )
      );
      alert("Quantity updated successfully");
    } catch (error) {
      console.error("Error updating quantity:", error);
    }
  };

  return (
    <div className="container-fluid">
      <Navbar />
      <div className="row">
        <div className="col-md-2">
          <Sidebar />
        </div>
        <div className="col-md-10 p-4" style={{ marginTop: "88px" }}>
          <h2>📦 Manage Store Items</h2>
          {items.map((item) => (
            <ItemCard
              key={item._id}
              item={item}
              handleUpdateQuantity={handleUpdateQuantity}
              handleDelete={handleDelete}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminStorePage;
