const AmazonCognitoIdentity =require('amazon-cognito-identity-js')
const { CognitoIdentityProviderClient } = require('@aws-sdk/client-cognito-identity-provider')

exports.cognitoClient =
    new CognitoIdentityProviderClient({
        region: process.env.REGION,
        credentials: {
            accessKeyId: process.env.ACCESS_KEY,
            secretAccessKey: process.env.SECRET_ACCESS_KEY,
        },
    })

exports.userPool = new AmazonCognitoIdentity.CognitoUserPool({
    UserPoolId: `${process.env.USER_POOL_ID}`,
    ClientId: `${process.env.CLIENT_ID}`,
})
