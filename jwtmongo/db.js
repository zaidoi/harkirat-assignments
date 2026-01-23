const mongoose = require('mongoose')

const Counter = mongoose.model("Counter",{
    _id:String,
    seq:Number
})

const AdminSchema = new mongoose.Schema({
    username:String,
    password:String
})

const UserSchema = new mongoose.Schema({
    username:String,
    password:String,
    coursepurchased:Array
})

const CourseSchema = new mongoose.Schema({
    id:Number,
    title:String,
    description:String,
    price:Number
})

async function getNextCourseId() {
  const counter = await Counter.findOneAndUpdate(
    { _id: "courseId" },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );
  return counter.seq;
}


const Admin = mongoose.model("Admin",AdminSchema);
const User = mongoose.model("User",UserSchema);
const Course = mongoose.model("Course",CourseSchema)

module.exports = {Admin,User,Course,getNextCourseId}