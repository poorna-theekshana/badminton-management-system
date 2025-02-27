import React from "react";
import "./StoreCard.css"; // Import styles

const StoreCard = ({ item }) => {
  return (
    <div className="store-card">
      {/* Stock Badge (Top Right Corner) */}
      <span
        className={`stock-badge ${
          item.quantity > 0 ? "in-stock" : "out-of-stock"
        }`}
      >
        {item.quantity > 0 ? "In Stock" : "Out of Stock"}
      </span>

      {/* Product Image */}
      <div className="store-card-img">
        <img
          src={
            item.image
              ? `http://localhost:5000${item.image}`
              : "/placeholder.jpg"
          }
          alt={item.name}
        />
      </div>

      {/* Product Details */}
      <div className="store-card-body">
        <h5 className="store-card-title">{item.name}</h5>
        <p className="store-card-description">{item.description}</p>
        <p className="store-card-price">Rs.{item.price.toFixed(2)}</p>
      </div>
    </div>
  );
};

export default StoreCard;
