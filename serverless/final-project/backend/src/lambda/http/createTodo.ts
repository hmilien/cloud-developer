import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import * as AWS  from 'aws-sdk'
import { createLogger } from '../../utils/logger'
import { CreateTodoRequest } from '../../requests/CreateTodoRequest'
import * as uuid from 'uuid'
import { getUserId } from '../utils'

const logger = createLogger('todo')
const docClient = new AWS.DynamoDB.DocumentClient()
const todoTable = process.env.TODOS_TABLE

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    console.log('Processing event, create todo: ', event)
   
    const todoId = uuid.v4()
    const parsedBody: CreateTodoRequest = JSON.parse(event.body)

    if (!parsedBody.name){
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true
        },
        body: "name is required"
      }
    }
     
    const item = {
      todoId: todoId,
      userId: getUserId(event),
      createdAt: new Date().toLocaleTimeString(),
      ...parsedBody
    }

    console.log('Processing event, Item: ', item)

    await docClient.put({
      TableName: todoTable,
      Item: item
    }).promise()

   

    logger.info('New Item added : ',item)

    return {
      statusCode: 201,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({
        items: item})
    }
    
}
