import 'source-map-support/register'
import { createLogger } from '../../utils/logger'
import { getUserId} from '../utils'
import { deleteTodo } from "../../dataLayer/todoRepository";
import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'

const logger = createLogger('todo')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  console.log('Processing event, delete todo: ', event)
    
  const todoId = event.pathParameters.todoId
  const userId= getUserId(event)

  await deleteTodo(userId,todoId)

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

