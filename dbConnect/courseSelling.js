const express = require("express");
const mongoose = require("mongoose");
const app = express();
app.use(express.json());

mongoose.connect(
  "mongodb+srv://zaidbadgujar:halamadrid@cluster0.utvbocc.mongodb.net/course_app",
);

const Counter = mongoose.model("Counter",{
    _id:String,
    seq:Number
})

const Admin = mongoose.model("Admin", {
  username: String,
  password: String,
});
const Course = mongoose.model("Course", {
  id: Number,
  title: String,
  description: String,
  price: Number,
});

const User = mongoose.model("User",{
  username: String,
  password: String,
  CourseBought: Array,
});

async function getNextCourseId() {
  const counter = await Counter.findOneAndUpdate(
    { _id: "courseId" },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );
  return counter.seq;
}


async function adminMiddleware(req, res, next) {
  const username = req.headers.username;
  const password = req.headers.password;
  const existingAdmin = await Admin.findOne({
    username: username,
    password: password,
  });
  if (!existingAdmin) {
    return res.status(403).json({
      msg: "First created admin Id",
    });
  } else {
    next();
  }
}

async function userMiddleware(req, res, next) {
  const username = req.headers.username;
  const password = req.headers.password;
  const existingAdmin = await User.findOne({
    username: username,
    password: password,
  });
  if (!existingAdmin) {
    return res.status(403).json({
      msg: "User not there",
    });
  } else {
    next();
  }
}

app.use(express.json());

app.post("/admin/signup/", async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  const existingAdmin = await Admin.findOne({ username: username });
  if (existingAdmin) {
    return res.status(403).json({
      msg: "Admin already there",
    });
  } else {
    const admin = new Admin({
      username: username,
      password: password,
    });
    admin.save();
    res.json({
      msg: "Admin created successfully",
    });
  }
});

app.post("/admin/courses", adminMiddleware, async (req, res) => {
  const title = req.body.title;
  const description = req.body.description;
  const price = req.body.price;

const couseId = await getNextCourseId();

  const newCourse = new Course({
    id: couseId,
    title: title,
    description: description,
    price: price,
  });
  await newCourse.save();
 
  res.json({
    msg: "Course created successfully",
  });
});

app.get("/admin/courses", adminMiddleware, async (req, res) => {
  const Array = await Course.find();
  res.json({
    msg: Array,
  });
});

app.post("/users/signup", async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.json(403).json({
      msg: "Enter valid credentails",
    });
  }

  const user = new User({
    username: username,
    password: password,
  });
  await user.save();
  res.json({
    msg: "User created successfully",
  });
});

app.get("/users/courses", userMiddleware, async (req, res) => {
  const allCourses = await Course.find();
  res.json({
    Courses: allCourses,
  });
});

app.post("/users/courses/:courseId", userMiddleware, async (req, res) => {
  const id = req.params.courseId;
  const username = req.body.username;

  const courseArr = await Course.find();

  const filter = courseArr.filter((item) => item.id === Number(id));
  await User.updateOne({ username: username }, { CourseBought: filter });

  res.json({
    msg: "Course purchased successfully",
  });
});

app.get("/users/purchasedCourses", userMiddleware, async (req, res) => {
  const username = req.body.username;
  const UserArr = await User.find();
  const filter = UserArr.filter((item) => item.username == username);
  res.json({
    msg: filter[0].CourseBought
  });
});

app.listen(3000);
