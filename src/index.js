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
            console.error("Error getting the data", error);
        }
    };

    const getProduct = async (productId) => {
        try {
            const response = await fetch(`${endPoint}${path}/${productId}`);
            const data = await response.json();
            setSelectedProduct(data.body);
        } catch (error) {
            console.error("Error getting the product", error);
        }
    };

    const createProduct = async () => {
        try {
            if (!formState.name || !formState.price) return;
            const product = { ...formState };
            const response = await fetch(endPoint + path, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(product),
            });
            if (response.ok) {
                setProducts([...products, product]);
                setFormState(initialState);
                getProducts();
            } else {
                console.error("Error creating the product");
            }
        } catch (error) {}
    };

    const deleteProduct = async (productId) => {
        try {
            const response = await fetch(`${endPoint}${path}/${productId}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (response.ok) {
                // Remove the deleted product from the local state
                setProducts(
                    products.filter((product) => product.id !== productId)
                );

                // Clear the selected product
                setSelectedProduct(null);

                // Trigger a refresh of the products list
                getProducts();
            } else {
                console.error("Error deleting the product");
            }
        } catch (error) {
            console.error("Error deleting the product", error);
        }
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
                    <button onClick={getProduct} style={styles.button}>
                        Detail
                    </button>
                </div>
            ))}

            {selectedProduct && (
                <div style={styles.selectedProduct}>
                    <h3>Selected Product Details</h3>
                    <p>ID: {selectedProduct.id}</p>
                    <p>Name: {selectedProduct.name}</p>
                    <p>Price: {selectedProduct.price}</p>
                    <p>Category: {selectedProduct.category}</p>
                    <button
                        onClick={() => deleteProduct(selectedProduct.id)}
                        style={styles.button}
                    >
                        DELETE
                    </button>
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
    product: {
        marginBottom: 2,
        cursor: "pointer",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
    },
    input: {
        border: "none",
        backgroundColor: "#ddd",
        margin: "10px",
        padding: 8,
        fontSize: 18,
    },
    productName: { fontSize: 20, fontWeight: "bold" },
    productPrice: { marginBottom: 0 },
    button: {
        cursor: "pointer",
        backgroundColor: "black",
        color: "white",
        outline: "none",
        fontSize: 18,
        padding: "12px 12px",
        margin: "12px",
    },
    selectedProduct: {
        marginBottom: 15,
        border: "solid",
    },
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);

reportWebVitals();

export default App;
