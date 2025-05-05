import { DynamoDBClient, GetItemCommand, ScanCommand } from "@aws-sdk/client-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

export async function getEmpl(event: APIGatewayProxyEvent, ddbClient: DynamoDBClient): Promise<APIGatewayProxyResult> {
  try {
    if (event.queryStringParameters && ('id' in event.queryStringParameters)) {
      const emplId = event.queryStringParameters['id']!;
      const getItemResponse = await ddbClient.send(new GetItemCommand({
        TableName: process.env.TABLE_NAME,
        Key: {
          'id': { S: emplId }
        }
      }));

      if (getItemResponse.Item) {
        const unmarshalledItem = unmarshall(getItemResponse.Item);
        return {
          statusCode: 200,
          body: JSON.stringify(unmarshalledItem)
        };
      } else {
        return {
          statusCode: 404,
          body: JSON.stringify({ message: 'Item not found' })
        };
      }
    } else {
      const scanResponse = await ddbClient.send(new ScanCommand({
        TableName: process.env.TABLE_NAME
      }));

      const items = scanResponse.Items?.map(item => unmarshall(item)) ?? [];

      return {
        statusCode: 200,
        body: JSON.stringify(items)
      };
    }
  } catch (error) {
    console.error('Error in getEmpl:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal server error' })
    };
  }
}