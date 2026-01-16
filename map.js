const express = require('express')
const app = express();

function userMiddleware(req,res,next){
    const username = req.headers.username;
    const password = req.headers.password;

    if(username != 'zaid' || password != 'pass'){
        res.status(403).json({
            msg:"Incorrect Inputs"
        })
    }else{
        next();
    }
}

function kidneyMiddleware(req,res,next){
    const kidneyId = req.query.kidneyId;
    if(kidneyId != 1 && kidneyId != 2){
        res.status(403).json({
            msg:"Incorrect Inputs"
        })
    }else{
        next();
    }
}

app.get('/health-checkup',userMiddleware,kidneyMiddleware,(req,res)=>{
    
    res.send('Your kidney is healthy')
})

app.get('/heart-check',userMiddleware,(req,res)=>{
    res.send('Your heart is healthy')
})
app.use((req,res) => {
    res.send('Wrong url')
})
app.listen(3000)

if(!(username == 'zaid' && password == 'pass'))
if(username != 'zaid' || password != 'pass')