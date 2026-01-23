const { signJwt, verifyJwt, decodeJwt } = require("./jwt.js");
const { Admin, User, Course } = require("./db.js");
const { adminMiddleware, userMiddleware,getNextCourseId } = require("./middleware.js");
const express = require("express");
const mongoose = require("mongoose");
const app = express();
app.use(express.json());

mongoose.connect(
  "mongodb+srv://zaidbadgujar:////////@cluster0.utvbocc.mongodb.net/course_app2",
);

app.post("/admin/signup", async (req, res) => {
  const { username, password } = req.body;

  const admin = new Admin({
    username: username,
    password: password,
  });
  await admin.save();
  res.json({
    msg: "Admin created successfully",
  });
});

app.post("/admin/signin", async (req, res) => {
  const { username, password } = req.body;

  const token = await signJwt(username, password);

  res.json({
    token,
  });
});

app.post('/admin/courses',async (req,res)=>{
    const adminToken = req.headers.authorization;
    if(!verifyJwt(adminToken)){
       return res.json({
            msg:"Wrong Token"
        })
    }
    const {title,description,price} = req.body;
   const id = await getNextCourseId();
    const course = new Course({
        id:id,
        title:title,
        description:description,
        price:price
    });
    await course.save()
    res.json({
        msg:"Course created successfully",
        courseId:id
    })

})

app.get('/admin/courses',async(req,res)=>{
    const adminToken = req.headers.authorization;
    if(!verifyJwt(adminToken)){
       return res.json({
            msg:"Wrong Token"
        })
    }
    const courseArr = await Course.find();
    res.json({
        courses:courseArr
    })
})

app.post('/users/signup',async(req,res)=>{
    const { username, password } = req.body;
     const user = new User({
    username: username,
    password: password,
  });
  await user.save();
  res.json({
    msg: "User created successfully",
  });
})

app.post('/users/signin',userMiddleware,(req,res)=>{
    const { username, password } = req.body;

  const token = signJwt(username, password);

  res.json({
    token:token
  });
})

app.get('/users/courses',async (req,res)=>{
    const userToken = req.headers.authorization;
    if(!verifyJwt(userToken)){
        return res.json({
            msg:"Wrong Token"
        })
    }
    const courseArr = await Course.find();
    res.json({
        courses:courseArr
    })
})

app.post('/users/courses/:courseId',async (req,res)=>{
    const userToken = req.headers.authorization;
    const courseId = req.params.courseId;
    if(!verifyJwt(userToken)){
       return res.json({
            msg:"Wrong Token"
        })
    }
    const decoded = decodeJwt(userToken)
    if (!decoded) return res.status(401).json({ msg: "Invalid token" });
    const course = await Course.findOne({id:courseId});

    await User.updateOne({username:decoded.username},{$push:{coursepurchased:course}})
    res.json({
        msg:"Course purchased successfully"
    })

})
app.get('/users/purchasedCourses',async (req,res) =>{
    const userToken = req.headers.authorization;
    if(!verifyJwt(userToken)){
        return res.json({
            msg:"Wrong Token"
        })
    }
    const decoded = decodeJwt(userToken);
    if (!decoded) return res.status(401).json({ msg: "Invalid token" });
    const user = await User.findOne({username:decoded.username});
    res.json({
        purchasedCourses:user.coursepurchased
    })
})

app.listen(3000);
