import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import { createLogger } from '../../utils/logger'
import { CreateTodoRequest } from '../../requests/CreateTodoRequest'
import * as uuid from 'uuid'
import { getUserId } from '../utils'
import { createTodo } from "../../dataLayer/todoRepository";

const logger = createLogger('todo')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    console.log('Processing event, create todo: ', event)
   
    const todoId = uuid.v4()
    const userId = getUserId(event)
    const parsedBody: CreateTodoRequest = JSON.parse(event.body)
  
    const item = await createTodo(userId,todoId,parsedBody)

    logger.info('New Item added : ',item)

    return {
      statusCode: 201,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({
        item: item})
    }
    
}
