const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const jwtPassword = "123456";

mongoose.connect(
"mongodb+srv://zaidbadgujar:halamadrid@cluster0.utvbocc.mongodb.net/user_app"
)

const User = mongoose.model("User",{
    name:String,
    username:String,
    password:String
})

const app = express();
app.use(express.json());

async function UserExits(username,password){
    let existUser = false;
    const findUser = await User.findOne({username:username,password:password});
    if(findUser){
        existUser = true;
    }
    return existUser
}

async function getAllUsers(username){
    const users = await User.find();
    const filterTheUser =  users.filter((item) => item.username !== username)
    return filterTheUser
}

app.post('/signup',async (req,res)=>{
    const username = req.body.username;
    const password = req.body.password;
    const name = req.body.name;

    const existingUser = await User.findOne({username:username})
    if(existingUser){
    return res.status(400).send("Username already there")
    }

    const user = new User({
        username:username,
        password:password,
        name:name
    })
    user.save();
    res.json({
        "msg": "User Created"
    })
})

app.post('/signin', async (req,res)=>{
    const username = req.body.username;
    const password = req.body.password;
   const userExists = await UserExits(username,password)
    if(!userExists){
        return res.status(403).json({
            msg:"User is not in db"
        })
    }

    const token = jwt.sign({username:username},jwtPassword);
    return res.json({
        token
    })
})

app.get('/users',async (req,res)=>{
    const token = req.headers.authorization;
    try{
        const decoded = jwt.verify(token,jwtPassword)
        const username = decoded.username;
        const users = await getAllUsers(username)
        res.json({
            users
        })
        
    }catch(err){
        return res.json({
            msg:'Invalid Token'
        })
    }
})

app.listen(3000)