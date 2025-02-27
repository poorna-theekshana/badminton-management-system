import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import "bootstrap/dist/css/bootstrap.min.css";

const AddItem = () => {
  const [item, setItem] = useState({
    name: "",
    description: "",
    price: "",
    quantity: "",
    image: null,
  });

  const handleChange = (e) => {
    setItem({ ...item, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setItem({ ...item, image: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();

    formData.append("name", item.name);
    formData.append("description", item.description);
    formData.append("price", parseFloat(item.price)); // Convert to number
    formData.append("quantity", parseInt(item.quantity, 10)); // Convert to integer
    if (item.image) {
      formData.append("image", item.image);
    }

    try {
      const response = await fetch("http://localhost:5000/api/items", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to add item");
      }

      alert("Item added successfully!");
      console.log("Item added:", data);
    } catch (error) {
      console.error("Error adding item:", error);
      alert("Failed to add item");
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
          <h2 className="mb-4">➕ Add New Item</h2>
          <form
            onSubmit={handleSubmit}
            encType="multipart/form-data"
            className="p-4 border rounded bg-light"
            style={{ maxWidth: "600px" }}
          >
            <div className="mb-3">
              <input
                type="text"
                name="name"
                className="form-control"
                onChange={handleChange}
                placeholder="Item Name"
                required
              />
            </div>

            <div className="mb-3">
              <textarea
                name="description"
                className="form-control"
                onChange={handleChange}
                placeholder="Description"
                required
              />
            </div>

            <div className="mb-3">
              <input
                type="number"
                name="price"
                className="form-control"
                onChange={handleChange}
                placeholder="Price"
                required
              />
            </div>

            <div className="mb-3">
              <input
                type="number"
                name="quantity"
                className="form-control"
                onChange={handleChange}
                placeholder="Quantity"
                required
              />
            </div>

            <div className="mb-3">
              <input
                type="file"
                name="image"
                className="form-control"
                onChange={handleImageChange}
              />
            </div>

            <button type="submit" className="btn btn-primary w-100">
              Add Item
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddItem;
