import { APIGatewayProxyEvent } from "aws-lambda";
import { parseUserId } from "../auth/utils";
import * as AWS  from 'aws-sdk';
import { TodoItem } from "../models/TodoItem";

const todoTable = process.env.TODOS_TABLE
const userIdIndex = process.env.USER_ID_INDEX
const docClient = new AWS.DynamoDB.DocumentClient()
/**
 * Get a user id from an API Gateway event
 * @param event an event from API Gateway
 *
 * @returns a user id from a JWT token
 */
export function getUserId(event: APIGatewayProxyEvent): string {
  const authorization = event.headers.Authorization
  const split = authorization.split(' ')
  const jwtToken = split[1]

  return parseUserId(jwtToken)
}

export async function  getTodoById(userId:string,todoId:string ): Promise<TodoItem> {
  const results = await docClient.query({
    TableName : todoTable,
    IndexName : userIdIndex,
    KeyConditionExpression: 'todoId = :todoId and userId = :userId',
    ExpressionAttributeValues: {
        ':todoId': todoId,
        ':userId': userId
    }
  }).promise()
  return results.Items[0] as TodoItem
}