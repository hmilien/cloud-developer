import * as AWS  from 'aws-sdk';
import { TodoItem } from "../models/TodoItem";
import { UpdateTodoRequest } from "../requests/UpdateTodoRequest";
import { CreateTodoRequest } from '../requests/CreateTodoRequest';

const todoTable = process.env.TODOS_TABLE
const userIdIndex = process.env.USER_ID_INDEX
const docClient = new AWS.DynamoDB.DocumentClient()

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
  
  export async function  setAttachmentUrl(userId: string, todoId: string, attachmentUrl:string){
    const item = await getTodoById(userId, todoId)
    item.attachmentUrl = attachmentUrl;
    await docClient.update({
      TableName: todoTable,
      Key:{ "userId": userId, "createdAt":item.createdAt},
      UpdateExpression: "set attachmentUrl = :attachmentUrl",
      ExpressionAttributeValues: {
          ":attachmentUrl":  item.attachmentUrl
      },
      ReturnValues: "UPDATED_NEW"
    }).promise()
  
    console.log('Url attached: ', attachmentUrl)
  }

  export async function  deleteTodo(userId:string,todoId:string ) {
    const item = await getTodoById(userId,todoId)
    console.log('Processing Query for delete: ', item)
    await docClient.delete({
      TableName: todoTable,
      Key:{ "userId": userId, "createdAt":item.createdAt}
    }).promise()
  }

  export async function updateTodo(userId:string, todoId, item:UpdateTodoRequest){
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
  }

  export async function createTodo(userId:string,todoId:string, request:CreateTodoRequest): Promise<TodoItem>{
    const item = {
        todoId: todoId,
        userId: userId,
        createdAt: new Date().toLocaleTimeString(),
        ...request
      }

     await docClient.put({
        TableName: todoTable,
        Item: item
      }).promise()

      return item as TodoItem
  }

  export async function getTodos(userId:string):Promise<TodoItem[]>{

    const result = await docClient.query({
        TableName : todoTable,
        IndexName : userIdIndex,
        KeyConditionExpression: 'userId = :userId',
        ExpressionAttributeValues: {
            ':userId': userId
        }
    }).promise()

    if(result.Items.length > 0)
        return result.Items as TodoItem[]
    else
        return[]
  }