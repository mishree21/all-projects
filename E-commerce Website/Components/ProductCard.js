import { FaHeart, FaRegHeart } from "react-icons/fa";

function ProductCard({
  product,
  addToCart,
  addToWishlist,
  openProduct,
  isWishlisted,
}) {
  return (
    <div className="card">

      {/* ❤️ HEART ICON */}
      <div
        className="wishlist-heart"
        onClick={() => addToWishlist(product)}
      >
        {isWishlisted(product.id) ? (
          <FaHeart color="red" />
        ) : (
          <FaRegHeart />
        )}
      </div>

      {/* PRODUCT IMAGE */}
      <img
        src={product.image}
        alt={product.name}
        onClick={() => openProduct(product)}
      />

      <h3>{product.name}</h3>

      <p>₹{product.price}</p>

      <button className="card-btn" onClick={() => addToCart(product)}>
        Add to Cart
      </button>

      <button className="card-btn secondary" onClick={() => openProduct(product)}>
        View Details
      </button>

    </div>
  );
}

export default ProductCard;
