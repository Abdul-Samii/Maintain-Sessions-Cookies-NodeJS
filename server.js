const express = require("express")
const session = require("express-session")
const mongoose = require("mongoose")
const mongoDBSession = require("connect-mongodb-session")(session)
const UserModel = require("./models/User")
const app = express()

mongoURI = "mongodb://localhost:27017/AuthDB";
//connection
mongoose.connect(mongoURI,{
    useNewUrlParser : true,
    useUnifiedTopology:true
}).then(res=>{
    console.log("Connected!")
});

const store = new mongoDBSession({
    uri:mongoURI,
    collection:'mySessions',
})


//middlware
app.use(express.json());
app.use(session({
    secret: 'key that will sign cookie',
    resave:false,
    saveUninitialized:false,
    store:store,
}))

const isAuth = (req,res,next)=>{
    if(req.session.isAuth)
    {
        next()
    }
    else{
        res.json("You are not authenticated");
    }
}

app.get("/",isAuth,(req,res)=>{
    // req.session.isAuth = true;
    // console.log(req.session)
    // console.log(req.sessionID)
    res.json("hi");
})

app.get("/cookies",(req,res)=>{
    req.session.isAuth = true;
    console.log(req.session)
    console.log(req.sessionID)
    res.json("OK")
})

//register
app.post("/register",isAuth,(req,res)=>{
   
    const user = new UserModel(req.body);
    user.save();
    res.status(200).json(user);
})

app.listen(5000, console.log("Server is running..."));