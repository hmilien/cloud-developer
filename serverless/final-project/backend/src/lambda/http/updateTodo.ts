import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest'
import { createLogger } from '../../utils/logger'
import * as AWS  from 'aws-sdk'
import { getUserId, getTodoById} from '../utils'

const docClient = new AWS.DynamoDB.DocumentClient()
const todoTable = process.env.TODOS_TABLE
const logger = createLogger('todo')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const todoId = event.pathParameters.todoId
  const item: UpdateTodoRequest = JSON.parse(event.body)
  const userId= getUserId(event)

  const todoItem = await getTodoById(userId,todoId)

  await docClient.update({
    TableName: todoTable,
    Key:{ "userId": userId, "createdAt":todoItem.createdAt},
    ExpressionAttributeNames: {"#N": "name"},
    UpdateExpression: "set #N = :name, dueDate:duedate, done:done",
    ExpressionAttributeValues: {
        ":name": item.name,
        ":dueDate": item.dueDate,
        ":done": item.done
    },
    ReturnValues: "UPDATED_NEW"
    
  }).promise()

  logger.info('todos updated for todo id: ',todoId)

  return {
    statusCode: 202,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({
      items:item
    })
  }
}
