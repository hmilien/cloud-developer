import 'source-map-support/register'
import * as AWS  from 'aws-sdk'
import { createLogger } from '../../utils/logger'
import { getUserId} from '../utils'
import { getTodoById } from "../../dataLayer/todoRepository";

const logger = createLogger('todo')

const docClient = new AWS.DynamoDB.DocumentClient()
const todoTable = process.env.TODOS_TABLE

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  console.log('Processing event, delete todo: ', event)
  
  const todoId = event.pathParameters.todoId
  const userId= getUserId(event)
  
  const item = await getTodoById(userId,todoId)

  console.log('Processing Query for delete: ', item)

  await docClient.delete({
    TableName: todoTable,
    Key:{ "userId": userId, "createdAt":item.createdAt}
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

