const express = require("express");
const fs = require("fs");
const path = require("path");
const app = express();

app.get("/files", (req, res) => {
  
  fs.readdir(path.join(__dirname,'./files/'), (err, data) => {
    if (err) {
      console.log(`Error`, err);
    } else {
      res.json({
        "All files": data,
      });
    }
  });
});

app.get("/files/:filename",(req,res) => {
    const filepath = path.join(__dirname,'./files/',req.params.filename)
    fs.readFile(filepath, 'utf-8',(err,data) =>{
        if(err){
            return res.status(404).send('File not found')
        }
        res.send(data)
    })
})

app.use((req,res)=>{
    res.status(404).send('Route not found')
})




app.listen(3000);
