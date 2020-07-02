import { CustomAuthorizerEvent, CustomAuthorizerResult } from 'aws-lambda'
import 'source-map-support/register'

import { verify, decode } from 'jsonwebtoken'
import { createLogger } from '../../utils/logger'
//import Axios from 'axios'
import { Jwt } from '../../auth/Jwt'
import { JwtPayload } from '../../auth/JwtPayload'

const cert = `-----BEGIN CERTIFICATE-----
MIIDHzCCAgegAwIBAgIJJfl3FGwj/5MUMA0GCSqGSIb3DQEBCwUAMC0xKzApBgNV
BAMTImRldi1zZXJ2aWNlY29uc2VpbHNobS51cy5hdXRoMC5jb20wHhcNMjAwNjMw
MTg1OTAwWhcNMzQwMzA5MTg1OTAwWjAtMSswKQYDVQQDEyJkZXYtc2VydmljZWNv
bnNlaWxzaG0udXMuYXV0aDAuY29tMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIB
CgKCAQEAqmTPksnyomQXl4ym3ldCIjFQxfcsHeAzOsG5jQPV17RPLRVNHFM8fRz+
Y5gMJryJLiS5fWJ+355n3rx/FH6aqrsJWK40Zh0L5h05OG98fQ/MhR6WqxFQZCQz
V7FiFfZS3uFYBD0ncJD07iWslGBfGyfpuSOlU59L7NfJpq5hDBMChhdeVwgiSkDw
6Zo3wTIMPYpsu39GMFb8hnbeH0ClZANnVesvAnEqp5KLQ5fuPhp96UiBXT2EScUt
DcV4u9LyXiPSWwM+MwPQSq1n+SjSulrirtoW2Q2xU1CBUWSfhy/TTcOuVNknHn76
N+NjO9J8JAx5NDJruv6MDRdG4xSi/wIDAQABo0IwQDAPBgNVHRMBAf8EBTADAQH/
MB0GA1UdDgQWBBReqLzmAJczP3VkCl+fesKSmtfXxTAOBgNVHQ8BAf8EBAMCAoQw
DQYJKoZIhvcNAQELBQADggEBAH9JGnhUQD0vU3ChQqHO5bfI8IvcKtjE1W9izmNy
V+UieqF1O5AhK9XqtxMAlM3VlJZcpV+xc7GQGpwnwskmLmU8CHdCQ76Pdoj8Q6/4
yAfT483sj/y+paZ9yVp/K/kncSLckURRZIV8HfWa/f4zbF9K8IsVukQZV/QAJKYA
/H65MEUV822jbfvAUVUMcLE6veV7CQQEAqc4KzdmS3zbt7iFrwkmZPba+LTjc1JC
UflFu8yoMHbW63JDWVKGYo/AXSCXV4xgGGU01sj/K2Xulc1kYSBYlYP8I13zXsCR
PYgBWRGkaNbHMLS8jcNOXItSSat9r10c0lW4xuJnGI2glb4=
-----END CERTIFICATE-----`

const logger = createLogger('auth')
// to verify JWT token signature.
// To get this URL you need to go to an Auth0 page -> Show Advanced Settings -> Endpoints -> JSON Web Key Set
//const jwksUrl = 'https://dev-serviceconseilshm.us.auth0.com/.well-known/jwks.json'

export const handler = async (
  event: CustomAuthorizerEvent
): Promise<CustomAuthorizerResult> => {
  console.log('Processing event, auth: ', event)
  logger.info('Authorizing a user', event.authorizationToken)
  try {
    const decodedJwt = await verifyToken(event.authorizationToken)
    return {
      principalId: decodedJwt.sub,
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Allow',
            Resource: '*'
          }
        ]
      }
    }
  } catch (e) {
    logger.info('User was authorized',  event.authorizationToken)
    logger.error('User not authorized', { error: e.message })

    return {
      principalId: 'user',
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Allow',
            Resource: '*'
          }
        ]
      }
    }
  }
}

async function verifyToken(authHeader: string): Promise<JwtPayload> {
  const token = getToken(authHeader)
  verify(token, cert,{ algorithms: ['RS256'] } )

  // You should implement it similarly to how it was implemented for the exercise for the lesson 5
  // You can read more about how to do this here: https://auth0.com/blog/navigating-rs256-and-jwks/
  const jwt: Jwt = decode(token, { complete: true }) as Jwt
  return jwt.payload
}

function getToken(authHeader: string): string {
  if (!authHeader) throw new Error('No authentication header')

  if (!authHeader.toLowerCase().startsWith('bearer '))
    throw new Error('Invalid authentication header')

  const split = authHeader.split(' ')
  const token = split[1]

  return token
}
