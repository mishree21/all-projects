import products  from "../data/products";
import ProductCard from "../components/ProductCard";

function Home({ addToCart }){
    return (
        <div className="products">
            {products.map((product) => (
                <ProductCard
                 key={product.id}
                 product={product}
                 addToCart={addToCart}
                /> 
            ))}
        </div>
        
    );
}


export default Home;
