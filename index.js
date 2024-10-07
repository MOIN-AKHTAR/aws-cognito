require("dotenv").config({
    path: ".env"
})
const express= require("express");
const app = express();
const {signUp,confirmSignUp,login,validateToken,forgotPassword,resetPassword}= require("./controllers/user.controller")

app.use(express.json({limit: "10mb"}))
app.post("/signup", signUp);
app.post("/login", login);
app.post("/confirm-signup", confirmSignUp);
app.get("/verify-token",validateToken)
app.post("/forgot-password",forgotPassword)
app.post("/reset-password",resetPassword)


app.listen(4000,()=>{
    console.log("Running server on port 4000")
})