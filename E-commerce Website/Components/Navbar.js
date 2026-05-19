import {Link} from "react-router-dom";

function Navbar({ cart }) {
    return (
        <nav className="navbar">
            <h2>Online Storet</h2>
            <div>
                <Link to="/">Home</Link>
                <Link to="/cart">Cart ({cart.length})</Link>
            </div>
        </nav>
    );

}

export default Navbar;
