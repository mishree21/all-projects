import { useState } from "react";
import products from "../data/products";
import ProductCard from "../components/ProductCard";

function Products() {

  const [selectedCategory, setSelectedCategory] =
    useState("");

  const [selectedSubcategory, setSelectedSubcategory] =
    useState("");

  // FILTER PRODUCTS

  const filteredProducts = products.filter((item) => {

    // CATEGORY FILTER
    if (
      selectedCategory &&
      item.category !== selectedCategory
    ) {
      return false;
    }

    // SUBCATEGORY FILTER
    if (
      selectedSubcategory &&
      item.subcategory !== selectedSubcategory
    ) {
      return false;
    }

    return true;
  });

  return (
    <div>

      <h1>Products</h1>

      {/* CATEGORY BUTTONS */}

      <div className="categories">

        <button
          onClick={() => {
            setSelectedCategory("");
            setSelectedSubcategory("");
          }}
        >
          All
        </button>

        <button
          onClick={() => {
            setSelectedCategory("Accessories");
            setSelectedSubcategory("");
          }}
        >
          Accessories
        </button>

        <button
          onClick={() => {
            setSelectedCategory("Shoes");
            setSelectedSubcategory("");
          }}
        >
          Shoes
        </button>

      </div>

      {/* SUBCATEGORY BUTTONS */}

      {selectedCategory === "Accessories" && (

        <div className="subcategories">

          <button
            onClick={() =>
              setSelectedSubcategory("Watch")
            }
          >
            Watch
          </button>

          <button
            onClick={() =>
              setSelectedSubcategory("Bracelet")
            }
          >
            Bracelet
          </button>

          <button
            onClick={() =>
              setSelectedSubcategory("Earrings")
            }
          >
            Earrings
          </button>

        </div>
      )}

      {/* PRODUCTS */}

      <div className="products">

        {filteredProducts.map((item) => (

          <ProductCard
            key={item.id}
            product={item}
          />

        ))}

      </div>

    </div>
  );
}

export default Products;
