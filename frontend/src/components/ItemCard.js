import React, { useState } from "react";

const ItemCard = ({ item, handleUpdateQuantity, handleDelete }) => {
  const [newQuantity, setNewQuantity] = useState(item.quantity);

  return (
    <div className="card shadow-sm p-3 mb-3">
      <div className="row g-0 align-items-center">
        <div className="col-md-2">
          <img
            src={`http://localhost:5000${item.image}`}
            alt={item.name}
            className="img-fluid rounded"
            style={{ width: "80px", height: "80px", objectFit: "cover" }}
          />
        </div>
        <div className="col-md-6">
          <h5 className="mb-1">{item.name}</h5>
          <p className="mb-1 text-muted">
            ${item.price.toFixed(2)} | {item.quantity} in stock
          </p>
        </div>
        <div className="col-md-2">
          <input
            type="number"
            min="0"
            className="form-control"
            value={newQuantity}
            onChange={(e) => setNewQuantity(e.target.value)}
          />
        </div>
        <div className="col-md-2 text-end">
          <button
            className="btn btn-sm btn-success me-2"
            onClick={() => handleUpdateQuantity(item._id, newQuantity)}
          >
            Save
          </button>
          <button
            className="btn btn-sm btn-danger"
            onClick={() => handleDelete(item._id)}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default ItemCard;
