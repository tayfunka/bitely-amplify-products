# Bitely Amplify Products

This project demonstrates a simple React application for CRUD operations on products using AWS Amplify, API Gateway, DynamoDB, and Lambda functions. The project allows users to create, read, update, and delete products.

## Project Overview

-   **Live Demo:** [Bitely Amplify Products](https://main.de60h1f5li8h.amplifyapp.com/)
-   **REST API Endpoint:** [https://oqdw2svwid.execute-api.eu-north-1.amazonaws.com/dev/products](https://oqdw2svwid.execute-api.eu-north-1.amazonaws.com/dev/products)

## Features

-   **Create Product:** Add a new product with name, price, and category.
-   **Read Products:** View a list of products and click for detailed information.
-   **Update Product:** Modify product details such as name, price, and category.
-   **Delete Product:** Remove a product from the list.

## Getting Started

1. Clone the repository:

    ```bash
    git clone <https://github.com/tayfunka/bitely-amplify-products.git>
    ```

2. Install dependencies:

    ```bash
    cd <https://github.com/tayfunka/bitely-amplify-products.git>
    npm install
    ```

3. Run the application locally:

    ```bash
    npm start
    ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Postman Collection

For testing the REST API, you can use the provided Postman collection. Download the collection file: [bitely-amplify-products.postman_collection.json](link-to-your-github-repo).

## AWS Services Used

-   **Amplify:** Configured for the front-end deployment.
-   **API Gateway:** Manages the REST API endpoint.
-   **DynamoDB:** Stores product data.
-   **Lambda Functions:** Handle CRUD operations on products.

## Folder Structure

-   `amplify`: Amplify configuration and backend resources.

    -   `backend`: Backend configurations.
        -   `api`: API Gateway configurations.
        -   `function`: Lambda function code.
            -   `src`: Lambda function source code.
        -   `storage`: Storage configurations.

-   `src`: React application source code.
    -   `index.js`: Main entry point for the React application.
