import 'source-map-support/register'
import * as AWS  from 'aws-sdk'
import { createLogger } from '../../utils/logger'
import { getUserId } from '../utils'
const logger = createLogger('todo')

const docClient = new AWS.DynamoDB.DocumentClient()
const todoTable = process.env.TODOS_TABLE
const userIdIndex = process.env.USER_ID_INDEX

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  console.log('Processing event, delete todo: ', event)
  
  const todoId = event.pathParameters.todoId
  const userId= getUserId(event)
  
  const results = await docClient.query({
    TableName : todoTable,
    IndexName : userIdIndex,
    KeyConditionExpression: 'todoId = :todoId and userId = :userId',
    ExpressionAttributeValues: {
        ':todoId': todoId,
        ':userId': userId
    }
  }).promise()

  console.log('Processing Query for delete: ', results)

  await docClient.delete({
    TableName: todoTable,
    Key:{ "userId": userId, "createdAt":results.Items[0].createdAt}
  }).promise()

  logger.info('Todo deleted : ',todoId)

  return {
    statusCode: 202,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: `Todo ${todoId} deleted`
  }
}

