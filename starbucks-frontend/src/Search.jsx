import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "./css/Menu.css"; // Reusing Menu styles for consistency

const Search = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // Get search query from URL
  const query = new URLSearchParams(location.search).get("q") || "";

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        // Fetch all products
        const response = await axios.get("http://localhost:4500/api/products");
        setProducts(response.data);
        setError(null);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Failed to load products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    if (query.trim() === "") {
      setFilteredProducts(products);
    } else {
      const lowerQuery = query.toLowerCase();
      const filtered = products.filter((product) =>
        product.name.toLowerCase().includes(lowerQuery)
      );
      setFilteredProducts(filtered);
    }
  }, [query, products]);

  const addToCart = async (product) => {
    if (!token) {
      alert("Please login to add items to cart.");
      navigate("/login");
      return;
    }

    try {
      await axios.post(
        "http://localhost:4500/add-to-cart",
        {
          productId: product._id,
          image: product.image,
          title: product.name,
          price: product.price,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert(`${product.name} added to cart!`);
    } catch (error) {
      console.error(error);
      alert("Error adding item to cart");
    }
  };

  if (loading) {
    return (
      <div className="Herosection_1">
        <div className="container text-center mt-5">
          <div className="spinner-border text-success" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="Herosection_1">
      <div className="container">
        <h3 className="mt-5 pt-3 text-success head fw-bold h3">
          {query ? `Search Results for "${query}"` : "All Products"}
        </h3>

        {filteredProducts.length === 0 ? (
          <div className="alert alert-danger text-center mt-5 fw-bold">
            No products found.
          </div>
        ) : (
          <div id="products3" className="mt-4">
            {filteredProducts.map((item) => (
              <div key={item._id} className="box2">
                <div className="img-box1">
                  <img className="images1" src={item.image} alt={item.name} />
                </div>
                <div className="bottom">
                  <h2>{item.name}</h2>
                  <h4>{item.description}</h4>
                  <h3>₹{item.price}.00</h3>
                  <button className="btn4" onClick={() => addToCart(item)}>
                    Add Item
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;
