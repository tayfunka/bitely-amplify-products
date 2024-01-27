import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { v4 as uuidv4 } from "uuid";
import {
    DeleteItemCommand,
    GetItemCommand,
    PutItemCommand,
    ScanCommand,
} from "@aws-sdk/client-dynamodb";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";

const REGION = "eu-north-1";
const ddbClient = new DynamoDBClient({ region: REGION });

export const handler = async (event) => {
    console.log(`EVENT: ${JSON.stringify(event)}`);

    let body;
    try {
        switch (event.httpMethod) {
            case "GET":
                if (event.pathParameters != null) {
                    body = await getProduct(event.pathParameters.id);
                } else {
                    body = await getAllProducts();
                }
                break;

            case "POST":
                body = await createProduct(event);
                break;

            case "DELETE":
                body = await deleteProduct(event.pathParameters.id);
                break;

            default:
                throw new Error(`Unsupported route: ${event.httpMethod}`);
        }
        console.log(body);

        return {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "*",
            },
            body: JSON.stringify({
                message: `Successfully finished operation: "${event.httpMethod}"`,
                body: body,
            }),
        };
    } catch (error) {
        console.error(error);
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: "Failed to perform operation.",
                errorMsg: error.message,
                errorStack: error.stack,
            }),
        };
    }
};

const getProduct = async (productId) => {
    try {
        const params = {
            TableName: process.env.DYNAMODB_TABLE_NAME,
            Key: marshall({ id: productId }),
        };

        const { Item } = await ddbClient.send(new GetItemCommand(params));
        return Item ? unmarshall(Item) : {};
    } catch (error) {
        console.log(error);
        throw error;
    }
};

const getAllProducts = async () => {
    try {
        const params = {
            TableName: process.env.DYNAMODB_TABLE_NAME,
        };

        const { Items } = await ddbClient.send(new ScanCommand(params));
        return Items ? Items.map((item) => unmarshall(item)) : {};
    } catch (error) {
        console.log(error);
        throw error;
    }
};

const createProduct = async (event) => {
    try {
        console.log(`createProduct function. event: ${event}`);
        const productRequest = JSON.parse(event.body);
        const productId = uuidv4();
        productRequest.id = productId;

        const params = {
            TableName: process.env.DYNAMODB_TABLE_NAME,
            Item: marshall(productRequest || {}),
        };

        const createProduct = await ddbClient.send(new PutItemCommand(params));
        return createProduct;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

const deleteProduct = async (productId) => {
    try {
        const params = {
            TableName: process.env.DYNAMODB_TABLE_NAME,
            Key: marshall({ id: productId }),
        };

        const deleteResult = await ddbClient.send(
            new DeleteItemCommand(params)
        );
        return deleteResult;
    } catch (error) {
        console.error(error);
        throw error;
    }
};