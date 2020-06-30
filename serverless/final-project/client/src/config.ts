// TODO: Once your application is deployed, copy an API id here so that the frontend could interact with it
const apiId = '...'
export const apiEndpoint = `https://${apiId}.execute-api.us-east-1.amazonaws.com/dev`

export const authConfig = {
  // TODO: Create an Auth0 application and copy values from it into this map
  domain: 'dev-serviceconseilshm.us.auth0.com',
  clientId: 'QxwHBEHo3WRUV3bTJw26L5NMS7QG43eZ',
  callbackUrl: 'http://localhost:3000/callback'
}
