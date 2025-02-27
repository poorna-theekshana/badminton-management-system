import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import StoreCard from "../components/StoreCard";

const StorePage = () => {
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

  return (
    <div className="container-fluid" style={{ marginTop: "120px" }}>
      <Navbar />
      <div className="container mt-5">
        <h2 className="mb-3 text-center">🏸 Badminton Equipment Store</h2>
        <p className="text-muted text-center pt-2 p-3" >
          These items are for <strong>display only</strong>. To purchase, visit
          the store at the court or reserve an item by calling.
        </p>
        <hr /> 
        <div className="row">
          {items.map((item) => (
            <div className="col-md-3 mb-4" key={item._id}>
              <StoreCard item={item} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StorePage;
