export const config = {
  "dev": {
    "username": "postgres",
    "password": "lv51xs99",
    "database": "udagram",
    "host": "udagram.cqqcnqe0l1lk.us-east-1.rds.amazonaws.com",
    "dialect": "postgres",
    "aws_region": "us-east-1",
    "aws_profile": "default",
    "aws_media_bucket": "udagrambuckethm"
  },
  "prod": {
    "username": "",
    "password": "",
    "database": "udagram_prod",
    "host": "",
    "dialect": "postgres"
  },
  "jwt":{
    "secret": "helloworld"
  }
}
