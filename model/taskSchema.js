const mongoose = require("mongoose");

const { Schema } = mongoose;

const taskSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,

    },
    deadline: {
      type: String,
    },
    status:{
        type : String,
        enum : ["todo" , "pending"  , "done" , "archieve"],
        default : "todo"
    },
    image :{
        type : String,
        default : null
    },
    assignedPerson :{
        type : String,
        default : null
    },
    creator :{
        type : String
    }
  },
  { timestamps: true },
);


const tashModel = mongoose.models.task || mongoose.model("task", taskSchema);

module.exports = tashModel