import { useState } from "react";
import "./App.css";

import foods from "./data/foodData";

import {
  FaShoppingCart,
  FaPlus,
  FaMinus,
} from "react-icons/fa";

function App() {

  // ================= LOGIN =================
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // ================= APP STATES =================
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);

  // ================= ORDER =================
  const [page, setPage] = useState("home");
  const [order, setOrder] = useState(null);

  const [address, setAddress] = useState("");
  const [location, setLocation] = useState("");

  const [deliveryTime, setDeliveryTime] = useState(0);
  const [orderStatus, setOrderStatus] = useState("Preparing 🍳");

  const [error, setError] = useState("");

  // ================= LOGIN =================
  const handleLogin = (e) => {
    e.preventDefault();
    const userData = { username };
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  // ================= FILTER =================
  const filteredFoods = foods.filter((item) => {
    const matchesSearch = item.name
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesCategory =
      category === "All" || item.category === category;

    return matchesSearch && matchesCategory;
  });

  // ================= CART =================
  const addToCart = (item) => {
    const existing = cart.find((c) => c.id === item.id);

    if (existing) {
      setCart(
        cart.map((c) =>
          c.id === item.id
            ? { ...c, quantity: c.quantity + 1 }
            : c
        )
      );
    } else {
      setCart([...cart, { ...item, quantity: 1 }]);
    }
  };

  const increaseQty = (id) => {
    setCart(
      cart.map((item) =>
        item.id === id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  };

  const decreaseQty = (id) => {
    setCart(
      cart
        .map((item) =>
          item.id === id
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const categories = [
    "All",
    "Burger",
    "Pizza",
    "Snacks",
    "Drinks",
    "Sandwich",
    "Dessert",
  ];

  // ================= LOGIN PAGE =================
  if (!user) {
    return (
      <div className="login-container">
        <form className="login-box" onSubmit={handleLogin}>
          <h2>🍔 FoodieExpress Login</h2>

          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit">Login</button>
        </form>
      </div>
    );
  }

  // ================= ORDER PAGE =================
  if (page === "order") {
    return (
      <div className="orders-page">

        <h1>📦 Order Details</h1>

        {order && (
          <div className="order-box">

            <h3>🧾 Customer Info</h3>
            <p><b>User:</b> {user.username}</p>
            <p><b>Address:</b> {address}</p>
            <p><b>Location:</b> {location}</p>

            <hr />

            <h3>🍔 Items</h3>
            {order.items.map((item) => (
              <p key={item.id}>
                {item.name} × {item.quantity} = ₹{item.price * item.quantity}
              </p>
            ))}

            <h3>💰 Total: ₹{order.total}</h3>

            <h3>🚚 Delivery Time</h3>
            <p style={{ color: "green", fontWeight: "bold" }}>
              {deliveryTime} - {deliveryTime + 10} minutes
            </p>

            <h3>📍 Tracking Status</h3>
            <p style={{ fontSize: "18px", fontWeight: "bold" }}>
              {orderStatus}
            </p>

            <div className="track-bar">
              <div className={orderStatus.includes("Preparing") ? "active" : ""}>
                🍳 Preparing
              </div>
              <div className={orderStatus.includes("On the way") ? "active" : ""}>
                🚴 On the way
              </div>
              <div className={orderStatus.includes("Delivered") ? "active" : ""}>
                🎉 Delivered
              </div>
            </div>

            <button
              className="back-btn"
              onClick={() => {
                setPage("home");
                setOrder(null);
                setOrderStatus("Preparing 🍳");
              }}
            >
              Back to Home
            </button>

          </div>
        )}

      </div>
    );
  }

  // ================= MAIN APP =================
  return (
    <div className="app">

      {/* HEADER */}
      <header className="header">
        <h1>🍔 FoodieExpress</h1>

        <div className="header-right">

          <input
            type="text"
            placeholder="Search food..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <span style={{ color: "white" }}>
            Hi, {user.username}
          </span>

          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>

          <button
            className="cart-btn"
            onClick={() => setShowCart(true)}
          >
            <FaShoppingCart />
            <span>{cart.length}</span>
          </button>

        </div>
      </header>

      {/* CATEGORY */}
      <div className="categories">
        {categories.map((cat) => (
          <button
            key={cat}
            className={category === cat ? "active" : ""}
            onClick={() => setCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* FOOD */}
      <div className="food-container">
        {filteredFoods.map((item) => (
          <div className="food-card" key={item.id}>
            <img src={item.image} alt={item.name} />
            <h2>{item.name}</h2>
            <p>{item.category}</p>
            <h3>₹ {item.price}</h3>

            <button onClick={() => addToCart(item)}>
              Add to Cart
            </button>
          </div>
        ))}
      </div>

      {/* CART */}
      {showCart && (
        <div className="cart-overlay" onClick={() => setShowCart(false)}>
          <div className="cart-panel" onClick={(e) => e.stopPropagation()}>

            <h2>Your Cart</h2>

            {/* ADDRESS VALIDATION */}
            <input
              type="text"
              placeholder="Enter Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />

            <input
              type="text"
              placeholder="Enter Phone no"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />

            {error && <p style={{ color: "red" }}>{error}</p>}

            {cart.map((item) => (
              <div className="cart-item" key={item.id}>
                <p>{item.name}</p>
                <p>₹{item.price * item.quantity}</p>

                <div className="qty-buttons">
                  <button onClick={() => decreaseQty(item.id)}>
                    <FaMinus />
                  </button>

                  <span>{item.quantity}</span>

                  <button onClick={() => increaseQty(item.id)}>
                    <FaPlus />
                  </button>
                </div>
              </div>
            ))}

            <h3>Total: ₹{total}</h3>

            <button
              className="checkout-btn"
              onClick={() => {

                // VALIDATION
                if (!address || !location) {
                  setError("Please enter address and location!");
                  return;
                }

                setError("");

                const randomTime = Math.floor(Math.random() * 30) + 15;

                setDeliveryTime(randomTime);

                const newOrder = {
                  items: cart,
                  total: total,
                };

                setOrder(newOrder);

                setCart([]);
                setShowCart(false);
                setPage("order");

                // TRACKING
                setOrderStatus("Preparing 🍳");

                setTimeout(() => {
                  setOrderStatus("On the way 🚴");
                }, 4000);

                setTimeout(() => {
                  setOrderStatus("Delivered 🎉");
                }, 9000);
              }}
            >
              Place Order
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
export default App;