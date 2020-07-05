import * as AWS  from 'aws-sdk';
import { TodoItem } from "../models/TodoItem";

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