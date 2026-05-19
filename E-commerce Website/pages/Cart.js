function Cart({ cart, removeFromCart }) {
  const total = cart.reduce(
    (acc, item) => acc + item.price,
    0
  );

  return (
    <div className="container">
      <h1>Your Cart</h1>

      {cart.length === 0 ? (
        <h2>Cart is Empty</h2>
      ) : (
        cart.map((item, index) => (
          <div className="cart-item" key={index}>
            <img src={item.image} alt="" />

            <div>
              <h3>{item.name}</h3>
              <p>₹{item.price}</p>
            </div>

            <button
  className="remove-btn"
  onClick={() => removeFromCart(index)}
>
  Remove
</button>
          </div>
        ))
      )}

      <h2>Total: ₹{total}</h2>
    </div>
  );
}

export default Cart;
