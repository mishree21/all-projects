import { useState, useRef } from "react";
import products from "./data/products";
import ProductCard from "./components/ProductCard";
import "./App.css";

import { FaEye, FaEyeSlash } from "react-icons/fa";

function App() {
  // ================= STATES =================
  const [page, setPage] = useState("home");
  const [searchTerm, setSearchTerm] = useState("");

  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [orders, setOrders] = useState([]);

  // ================= CHECKOUT STATES =================
  const [showCheckout, setShowCheckout] = useState(false);

  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [pincode, setPincode] = useState("");
  const [phone, setPhone] = useState("");

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [selectedProduct, setSelectedProduct] = useState(null);

  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );

  // ================= REFS =================
  const phonesRef = useRef(null);
  const accessoriesRef = useRef(null);
  const electronicsRef = useRef(null);
  const fashionRef = useRef(null);

  // ================= LOGIN =================
  const login = () => {
    if (username === "admin@gmail.com" && password === "1234") {
      const loggedInUser = { username };

      setUser(loggedInUser);

      localStorage.setItem(
        "user",
        JSON.stringify(loggedInUser)
      );
    } else {
      alert("Invalid Email or Password");
    }
  };

  const logout = () => {
    setUser(null);

    localStorage.removeItem("user");

    setPage("home");
  };

  // ================= CART =================
  const addToCart = (product) => {
    setCart((prev) => [...prev, product]);

    alert(`${product.name} added to cart`);
  };

  const removeFromCart = (index) => {
    setCart((prev) =>
      prev.filter((_, i) => i !== index)
    );
  };

  const totalAmount = cart.reduce(
    (sum, item) => sum + item.price,
    0
  );

  // ================= PLACE ORDER =================
  const placeOrder = () => {
    if (
      address === "" ||
      city === "" ||
      pincode === "" ||
      phone === ""
    ) {
      alert("Please fill all delivery details");

      return;
    }

    const today = new Date();

    const deliveryDate = new Date(
      today.setDate(today.getDate() + 5)
    );

    const formattedDate =
      deliveryDate.toDateString();

    const orderData = cart.map((item) => ({
      ...item,

      deliveryDetails: {
        address,
        city,
        pincode,
        phone,
      },

      deliveryDate: formattedDate,
    }));

    setOrders((prev) => [...prev, ...orderData]);

    setCart([]);

    setShowCheckout(false);

    setAddress("");
    setCity("");
    setPincode("");
    setPhone("");

    alert("Order Placed Successfully 🎉");

    setPage("orders");
  };

  // ================= CANCEL ORDER =================
  const cancelOrder = (index) => {
    setOrders((prev) =>
      prev.filter((_, i) => i !== index)
    );

    alert("Order Cancelled");
  };

  // ================= WISHLIST =================
  const toggleWishlist = (product) => {
    const exists = wishlist.find(
      (item) => item.id === product.id
    );

    if (exists) {
      setWishlist((prev) =>
        prev.filter((item) => item.id !== product.id)
      );
    } else {
      setWishlist((prev) => [...prev, product]);
    }
  };

  const isWishlisted = (id) =>
    wishlist.some((item) => item.id === id);

  // ================= PRODUCT PAGE =================
  const openProduct = (product) => {
    setSelectedProduct(product);

    setPage("product");
  };

  const scrollToSection = (ref) => {
    ref.current?.scrollIntoView({
      behavior: "smooth",
    });
  };

  // ================= LOGIN SCREEN =================
  if (!user) {
    return (
      <div className="login-wrapper">
        <div className="login-card">
          <h1 className="login-title">
            Welcome Back 👋
          </h1>

          <p className="login-subtitle">
            Login to continue shopping
          </p>

          <input
            type="email"
            placeholder="Enter Email"
            className="login-input"
            value={username}
            onChange={(e) =>
              setUsername(e.target.value)
            }
          />

          <div className="password-box">
            <input
              type={
                showPassword ? "text" : "password"
              }
              placeholder="Enter Password"
              className="login-input"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
            />

            <span
              className="eye-icon"
              onClick={() =>
                setShowPassword(!showPassword)
              }
            >
              {showPassword ? (
                <FaEyeSlash />
              ) : (
                <FaEye />
              )}
            </span>
          </div>

          <button
            className="login-btn"
            onClick={login}
          >
            Login
          </button>
        </div>
      </div>
    );
  }

  // ================= MAIN UI =================
  return (
    <div>
      {/* ================= HEADER ================= */}

      <div className="header">
        <h1 onClick={() => setPage("home")}>
          Online Store
        </h1>

        <div className="nav-buttons">
          <button
            onClick={() => setPage("home")}
          >
            Home
          </button>

          <button
            onClick={() => setPage("cart")}
          >
            Cart ({cart.length})
          </button>

          <button
            onClick={() => setPage("wishlist")}
          >
            Wishlist ({wishlist.length})
          </button>

          <button
            onClick={() => setPage("orders")}
          >
            Orders ({orders.length})
          </button>

          <button onClick={logout}>
            Logout
          </button>
        </div>
      </div>

      {/* ================= HOME ================= */}

      {page === "home" && (
        <>
          {/* SEARCH */}

          <div className="search-bar">
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) =>
                setSearchTerm(e.target.value)
              }
            />
          </div>

          {/* CATEGORIES */}

          <div className="categories">
            <button
              onClick={() =>
                scrollToSection(phonesRef)
              }
            >
              Phones
            </button>

            <button
              onClick={() =>
                scrollToSection(accessoriesRef)
              }
            >
              Accessories
            </button>

            <button
              onClick={() =>
                scrollToSection(electronicsRef)
              }
            >
              Electronics
            </button>

            <button
              onClick={() =>
                scrollToSection(fashionRef)
              }
            >
              Fashion
            </button>
          </div>

          {/* ADS */}

          <div className="ads-container">
            <div className="ad-card">
              <img
                src="https://sm.mashable.com/mashable_in/photo/default/8cover_kjga.jpg"
                alt="sale"
              />

              <h3>
                Big Electronics Sale is Live Now!
                🔥
              </h3>
            </div>
          </div>

          {/* PHONES */}

          <div ref={phonesRef}>
            <h2 className="category-title">
              Phones
            </h2>

            <div className="products">
              {products
                .filter(
                  (item) =>
                    item.category.toLowerCase() ===
                      "phones" &&
                    item.name
                      .toLowerCase()
                      .includes(
                        searchTerm.toLowerCase()
                      )
                )
                .map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    addToCart={addToCart}
                    openProduct={openProduct}
                    addToWishlist={toggleWishlist}
                    isWishlisted={isWishlisted}
                  />
                ))}
            </div>
          </div>

          {/* ACCESSORIES */}

          <div ref={accessoriesRef}>
            <h2 className="category-title">
              Accessories
            </h2>

            <div className="products">
              {products
                .filter(
                  (item) =>
                    item.category.toLowerCase() ===
                      "accessories" &&
                    item.name
                      .toLowerCase()
                      .includes(
                        searchTerm.toLowerCase()
                      )
                )
                .map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    addToCart={addToCart}
                    openProduct={openProduct}
                    addToWishlist={toggleWishlist}
                    isWishlisted={isWishlisted}
                  />
                ))}
            </div>
          </div>

          {/* ELECTRONICS */}

          <div ref={electronicsRef}>
            <h2 className="category-title">
              Electronics
            </h2>

            <div className="products">
              {products
                .filter(
                  (item) =>
                    item.category.toLowerCase() ===
                      "electronics" &&
                    item.name
                      .toLowerCase()
                      .includes(
                        searchTerm.toLowerCase()
                      )
                )
                .map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    addToCart={addToCart}
                    openProduct={openProduct}
                    addToWishlist={toggleWishlist}
                    isWishlisted={isWishlisted}
                  />
                ))}
            </div>
          </div>

          {/* FASHION */}

          <div ref={fashionRef}>
            <h2 className="category-title">
              Fashion
            </h2>

            <div className="products">
              {products
                .filter(
                  (item) =>
                    item.category.toLowerCase() ===
                      "fashion" &&
                    item.name
                      .toLowerCase()
                      .includes(
                        searchTerm.toLowerCase()
                      )
                )
                .map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    addToCart={addToCart}
                    openProduct={openProduct}
                    addToWishlist={toggleWishlist}
                    isWishlisted={isWishlisted}
                  />
                ))}
            </div>
          </div>
        </>
      )}

      {/* ================= CART ================= */}

      {page === "cart" && (
        <div className="cart-page">
          <h2>Shopping Cart</h2>

          {cart.length === 0 ? (
            <p>Cart is Empty</p>
          ) : (
            <>
              {cart.map((item, index) => (
                <div
                  key={index}
                  className="cart-item"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                  />

                  <div>
                    <h3>{item.name}</h3>

                    <p>₹{item.price}</p>
                  </div>

                  <button
                    onClick={() =>
                      removeFromCart(index)
                    }
                  >
                    Remove
                  </button>
                </div>
              ))}

              <h2>Total: ₹{totalAmount}</h2>

              <button
                className="place-order-btn"
                onClick={() =>
                  setShowCheckout(true)
                }
              >
                Proceed To Checkout
              </button>
            </>
          )}
        </div>
      )}

      {/* ================= CHECKOUT ================= */}

      {showCheckout && (
        <div className="checkout-overlay">
          <div className="checkout-box">
            <h2>Delivery Details</h2>

            <input
              type="text"
              placeholder="Full Address"
              value={address}
              onChange={(e) =>
                setAddress(e.target.value)
              }
            />

            <input
              type="text"
              placeholder="City"
              value={city}
              onChange={(e) =>
                setCity(e.target.value)
              }
            />

            <input
              type="text"
              placeholder="Pincode"
              value={pincode}
              onChange={(e) =>
                setPincode(e.target.value)
              }
            />

            <input
              type="text"
              placeholder="Phone Number"
              value={phone}
              onChange={(e) =>
                setPhone(e.target.value)
              }
            />

            <button
              className="confirm-btn"
              onClick={placeOrder}
            >
              Confirm Order
            </button>

            <button
              className="close-btn"
              onClick={() =>
                setShowCheckout(false)
              }
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* ================= ORDERS ================= */}

      {page === "orders" && (
        <div className="cart-page">
          <h2>My Orders</h2>

          {orders.length === 0 ? (
            <p>No Orders Yet</p>
          ) : (
            orders.map((item, index) => (
              <div
                key={index}
                className="cart-item"
              >
                <img
                  src={item.image}
                  alt={item.name}
                />

                <div>
                  <h3>{item.name}</h3>

                  <p>₹{item.price}</p>

                  <p>
                    Delivery Date:{" "}
                    {item.deliveryDate}
                  </p>

                  <p>
                    Address:{" "}
                    {
                      item.deliveryDetails
                        .address
                    }
                    ,{" "}
                    {
                      item.deliveryDetails.city
                    }{" "}
                    -{" "}
                    {
                      item.deliveryDetails
                        .pincode
                    }
                  </p>

                  <p>
                    Phone:{" "}
                    {
                      item.deliveryDetails.phone
                    }
                  </p>

                  <div className="order-buttons">
                    <button className="ordered-btn">
                      Ordered
                    </button>

                    <button
                      className="cancel-btn"
                      onClick={() =>
                        cancelOrder(index)
                      }
                    >
                      Cancel Order
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* ================= WISHLIST ================= */}

      {page === "wishlist" && (
        <div className="wishlist-page">
          <h2>Wishlist</h2>

          <div className="products">
            {wishlist.length === 0 ? (
              <p>Wishlist is Empty</p>
            ) : (
              wishlist.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  addToCart={addToCart}
                  openProduct={openProduct}
                  addToWishlist={toggleWishlist}
                  isWishlisted={isWishlisted}
                />
              ))
            )}
          </div>
        </div>
      )}

      {/* ================= PRODUCT DETAILS ================= */}

      {page === "product" &&
        selectedProduct && (
          <div className="product-detail">
            <button
              className="back-btn"
              onClick={() =>
                setPage("home")
              }
            >
              ⬅ Back
            </button>

            <div className="product-detail-card">
              <img
                src={selectedProduct.image}
                alt={selectedProduct.name}
              />

              <div className="product-info">
                <h1>
                  {selectedProduct.name}
                </h1>

                <h2>
                  ₹{selectedProduct.price}
                </h2>

                <button
                  className="add-btn"
                  onClick={() =>
                    addToCart(selectedProduct)
                  }
                >
                  Add To Cart
                </button>
              </div>
            </div>
          </div>
        )}
    </div>
  );
}

export default App;
