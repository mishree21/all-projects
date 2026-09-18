function FoodCard({item}) {
    return (
        <div className="food-card">
            <img src={item.image} alt={item.name} />

            <h2>{item.name}</h2>
            <p>₹ {item.price}</p>

            <button>Add to Cart</button>
        </div>
    );
}
export default FoodCard;
