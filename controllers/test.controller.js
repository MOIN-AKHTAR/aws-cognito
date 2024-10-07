const AmazonCognitoIdentity = require('amazon-cognito-identity-js');
const axios= require("axios")
const jwkToPem = require('jwk-to-pem');
const jwt = require('jsonwebtoken');
const {userPool}= require("../config/user.pool")

exports.signUp = (req) => {
    const {email,password,role,permission}=req.body;
    const attributeList = [
      new AmazonCognitoIdentity.CognitoUserAttribute({ Name: 'email', Value: email }),
      new AmazonCognitoIdentity.CognitoUserAttribute({ Name: 'custom:role', Value: role }),
      new AmazonCognitoIdentity.CognitoUserAttribute({ Name: 'custom:permission', Value: permission })
    ];
  
    return new Promise((resolve, reject)=>{
        userPool.signUp(email, password, attributeList, [], (err, result) => {
            if (err) {
              console.error('Error signing up:', err);
              return reject({
                success: false,
                error: err?.message || err
              })
            }
            const cognitoUser = result.user;
            return resolve({
                 success: true,
                 message: `User signed up successfully ${cognitoUser.getUsername()}`
            })
          });
    })
  };

  exports.confirmSignUp = (req) => {
    const userData = {
      Username: req.body.userName,
      Pool: userPool
    };
  
    const cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
  
    return new Promise((resolve,reject)=>{
        cognitoUser.confirmRegistration(req.body.confirmationCode, true, (err, result) => {
            if (err) {
              console.error('Error signing up:', err);
              return reject({
                success: false,
                error: err?.message || err
              })
            }
            return resolve({
                success: true,
                message: `Confirmed account successfully!!!`
            })
          });
    })
  };


exports.login=(req)=>{
    const {userName,password}= req.body;
    console.log("USER NAME", userName)
    var authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails({
        Username : userName,
        Password : password,
    });
    var userData = {
        Username : userName,
        Pool : userPool
    };
    var cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
    return new Promise((resolve,reject)=>{
        return cognitoUser.authenticateUser(authenticationDetails, {
            onSuccess: function (result) {
                console.log('access token + ' + result.getAccessToken().getJwtToken());
                console.log('id token + ' + result.getIdToken().getJwtToken());
                console.log('refresh token + ' + result.getRefreshToken().getToken());
    
                return resolve({
                    success: true,
                    tokens:{
                        idToken: result.getIdToken().getJwtToken(),
                        accessToken: result.getAccessToken().getJwtToken(),
                        refreshToken: result.getRefreshToken().getToken()
                    }
                })
            },
            onFailure: function(err) {
                console.log(err);
                return reject({
                    success: false,
                    error: err?.message || err
                })
            },
    
        });
    })
}

exports.forgotPassword = async (body) => {
  const { userName } = body
  return new Promise((resolve, reject) => {
      const userData = {
          Username: userName,
          Pool: userPool,
      }
      const cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData)
      cognitoUser.forgotPassword({
          onSuccess: (data) => {
              resolve({
                  success: true,
                  data,
              })
          },
          onFailure: (err) => {
              reject({
                  success: true,
                  err,
              })
          },
      })
  })
}


exports.resetPassword = async (body) => {
  const { code, password, userName } = body
  return new Promise((resolve, reject) => {
      const userData = {
          Username: userName,
          Pool: userPool,
      }
      const cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData)
      cognitoUser.confirmPassword(code, password, {
          onSuccess: (data) => {
              resolve({
                  success: true,
                  data,
              })
          },
          onFailure: (err) => {
              console.log(err)
              reject({
                  success: true,
                  err,
              })
          },
      })
  })
}