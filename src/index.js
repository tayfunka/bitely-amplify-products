import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import "./App.css";
import reportWebVitals from "./reportWebVitals";

import { Amplify } from "aws-amplify";
import config from "./aws-exports";
Amplify.configure(config);

const initialState = { name: "", price: "", category: "" };
const endPoint = "https://oqdw2svwid.execute-api.eu-north-1.amazonaws.com/dev";
const path = "/products";

const App = () => {
    const [formState, setFormState] = useState(initialState);
    const [products, setProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);

    useEffect(() => {
        getProducts();
    }, []);

    function setInput(key, value) {
        setFormState({ ...formState, [key]: value });
    }

    const getProducts = async () => {
        try {
            const response = await fetch(endPoint + path);
            const data = await response.json();
            setProducts(data.body);
        } catch (error) {
            console.log("Error fetching the data", error);
        }
    };

    const getProduct = async (productId) => {
        try {
            const response = await fetch(`${endPoint}${path}/${productId}`);
            const data = await response.json();
            setSelectedProduct(data.body);
        } catch (error) {
            console.log("Error fetching the product", error);
        }
    };

    const createProduct = async () => {
        try {
            if (!formState.name || !formState.price) return;
            const product = { ...formState };
            setProducts([...products, product]);
            setFormState(initialState);
            const response = await fetch(endPoint + path, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(product),
            });
        } catch (error) {}
    };

    return (
        <div style={styles.container}>
            <h2>Bitely Products</h2>
            <input
                onChange={(event) => setInput("name", event.target.value)}
                style={styles.input}
                value={formState.name}
                placeholder="Name"
            />
            <input
                onChange={(event) => setInput("price", event.target.value)}
                style={styles.input}
                value={formState.price}
                placeholder="Price"
            />
            <input
                onChange={(event) => setInput("category", event.target.value)}
                style={styles.input}
                value={formState.category}
                placeholder="Category"
            />
            <button onClick={createProduct} style={styles.button}>
                Create Product
            </button>
            {products.map((product, index) => (
                <div
                    key={product.id ? product.id : index}
                    style={styles.product}
                    onClick={() => getProduct(product.id)}
                >
                    <p style={styles.productName}>{product.name}</p>
                    <hr />
                </div>
            ))}

            {selectedProduct && (
                <div style={styles.selectedProduct}>
                    <h3>Selected Product Details</h3>
                    <p>ID: {selectedProduct.id}</p>
                    <p>Name: {selectedProduct.name}</p>
                    <p>Price: {selectedProduct.price}</p>
                    <p>Category: {selectedProduct.category}</p>
                </div>
            )}
        </div>
    );
};
const styles = {
    container: {
        width: 400,
        margin: "0 auto",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: 20,
    },
    product: { marginBottom: 15, cursor: "pointer" },
    input: {
        border: "none",
        backgroundColor: "#ddd",
        marginBottom: 10,
        padding: 8,
        fontSize: 18,
    },
    productName: { fontSize: 20, fontWeight: "bold" },
    productPrice: { marginBottom: 0 },
    button: {
        backgroundColor: "black",
        color: "white",
        outline: "none",
        fontSize: 18,
        padding: "12px 0px",
    },
    selectedProduct: { marginBottom: 15 },
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);

reportWebVitals();

export default App;
