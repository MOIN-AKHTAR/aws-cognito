const AmazonCognitoIdentity = require('amazon-cognito-identity-js');
const axios= require("axios")
const jwkToPem = require('jwk-to-pem');
const jwt = require('jsonwebtoken');
const {userPool}= require("../config/user.pool")
const {signUp: cgnitoSignUp,confirmSignUp:cognitoConfirmSignUp,login:cognitoLogin, forgotPassword:cognitoForgotPassword,resetPassword:cognitoResetPassword}= require("./test.controller")

exports.signUp = async (req,res) => {
  try {
      const result= await cgnitoSignUp(req)
      return res.status(200).json(result)
  } catch (error) {
    return res.status(400).json(error)
  }
  };

  exports.confirmSignUp = async (req, res) => {
    try {
       const result= await cognitoConfirmSignUp(req)
       return res.status(200).json(result)
    } catch (error) {
      return res.status(400).json(error)
    }
  };


  exports.login=async (req,res) =>{
 try {
     const result= await cognitoLogin(req);
     return res.status(200).json(result)
 } catch (error) {
  return res.status(400).json(error)
 }
}

exports.forgotPassword= async (req,res)=>{
    try {
        const result=await cognitoForgotPassword(req.body)
        return res.status(200).json(result)
    } catch (error) {
        return res.status(400).json(error)
    }
 }

 exports.resetPassword= async (req,res)=>{
    try {
        const result=await cognitoResetPassword(req.body)
        return res.status(200).json(result)
    } catch (error) {
        console.log(error)
        return res.status(400).json(error)
    }
 }
  
  

exports.validateToken= async (req,res)=> {
    const pems={}
    const { data } = await axios.get(`https://cognito-idp.${process.env.REGION}.amazonaws.com/${process.env.USER_POOL_ID}/.well-known/jwks.json`);
    const keys= data.keys;
    console.log(data)
    for(var i = 0; i < data.keys.length; i++) {
        //Convert each key to PEM
        var key_id = keys[i].kid;
        var modulus = keys[i].n;
        var exponent = keys[i].e;
        var key_type = keys[i].kty;
        var jwk = { kty: key_type, n: modulus, e: exponent};
        var pem = jwkToPem(jwk);
        pems[key_id] = pem;
    }

    console.log(pems)
    console.log("AUTHORIZATION =====> ")
    // console.log(req.headers.authorization)
    //validate the token
    var decodedJwt = jwt.decode(req.headers.authorization, {complete: true});
    if (!decodedJwt) {
        console.log("Not a valid JWT token");
        return res.status(400).json({
            success: false,
            message: "Not a valid JWT token"
        })
    }

    var kid = decodedJwt.header.kid;
    var pem = pems[kid];
    if (!pem) {
        console.log('Invalid token');
        return res.status(400).json({
            success: false,
            message: 'Invalid token'
        })
    }

    return res.status(200).json({
        success: true,
        data: decodedJwt
    })

    // jwt.verify(req.headers.authorization, pem, function(err, payload) {
    //     if(err) {
    //         return res.status(400).json({
    //             success: false,
    //             message: 'Invalid token'
    //         })
    //     } else {
    //         console.log("Valid Token.");
    //         console.log(payload);
    //         return res.status(200).json({
    //             success: true,
    //             payload
    //          })
    //     }
    // });
   
}
















// if (!error && response.statusCode === 200) {
//     pems = {};
//     var keys = body['keys'];

