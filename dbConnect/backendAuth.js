const express = require('express');
const jwt = require('jsonwebtoken')
const jwtpassword = '123456';

const app = express();
app.use(express.json())
const ALL_USERS = [
    {
        username: "zaid@gmail.com",
        password: "halamadrid",
        name:"Zaid Badgujar"
    },
    {
        username:"faizan@gmail.com",
        password:"12345",
        name:"Faizan Gandhi"
    },
    {
        username:"arbz@gmail.com",
        password:"123456",
        name:"Arbaaz Khan"
    }
]

function userExists(username,password){
    for(let i = 0; i < ALL_USERS.length; i++){
        if(ALL_USERS[i].username == username && ALL_USERS[i].password == password){
            return true
        }
    }
    return false
}

app.post('/signin',(req,res)=>{
    const username = req.body.username;
    const password = req.body.password;

    if(!userExists(username,password)){
        return res.status(403).json({
            msg:'User doesnt exist in our in memory db'
        })
    }

    var token = jwt.sign({username:username},jwtpassword);
    return res.json({
        token,
    })
})

app.get('/users',(req,res)=>{
    const token = req.headers.authorization;
    try{
        const decoded = jwt.verify(token,jwtpassword);
        const username = decoded.username;
        res.json({
            users:ALL_USERS.filter((item) =>{
                if(item.username == username){
                    return false
                }else{
                    return true
                }
            })
        })

    }catch(err){
        res.json({
            msg:"Invalid token"
        })
    }

})

app.listen(3000)