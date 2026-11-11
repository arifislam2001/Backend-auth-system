const mongoose = require("mongoose");
const taskSchema = require("../model/taskSchema");
const userModel = require("../model/UserModel");

const isValidDeadline = (deadline) => {
  if (typeof deadline !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(deadline)) {
    return false;
  }

  const [year, month, day] = deadline.split("-").map(Number);
  const parsedDeadline = new Date(`${deadline}T00:00:00.000Z`);

  if (
    Number.isNaN(parsedDeadline.getTime()) ||
    parsedDeadline.getUTCFullYear() !== year ||
    parsedDeadline.getUTCMonth() + 1 !== month ||
    parsedDeadline.getUTCDate() !== day
  ) {
    return false;
  }

  const now = new Date();
  const today = [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, "0"),
    String(now.getDate()).padStart(2, "0"),
  ].join("-");

  return deadline >= today;
};

const createtask = async (req, res) => {
  const { title, description, deadline, status, assignedPerson } = req.body;

  if (typeof title !== "string" || !title.trim()) {
    return res.status(400).json({
      success: false,
      message: "task title is required",
    });
  }

  if (title.trim().length > 30) {
    return res.status(400).json({
      success: false,
      message: "task title max length 30",
    });
  }

  if (description !== undefined && description !== null && typeof description !== "string") {
    return res.status(400).json({
      success: false,
      message: "task description must be a string",
    });
  }

  if (typeof description === "string" && description.length > 500) {
    return res.status(400).json({
      success: false,
      message: "task description max length 500",
    });
  }

  if (deadline !== undefined && deadline !== null && deadline !== "" && !isValidDeadline(deadline)) {
    return res.status(400).json({
      success: false,
      message: "deadline must be a valid date (YYYY-MM-DD) and cannot be before today",
    });
  }

  if (
    assignedPerson !== undefined &&
    assignedPerson !== null &&
    typeof assignedPerson !== "string"
  ) {
    return res.status(400).json({
      success: false,
      message: "assignedPerson must be a string or null",
    });
  }

  try {
    const assignedValue = assignedPerson?.trim() || null;

    if (assignedValue) {
      if (!mongoose.isValidObjectId(assignedValue)) {
        return res.status(400).json({
          success: false,
          message: "assignedPerson is not a valid user id",
        });
      }
      if (!(await userModel.exists({ _id: assignedValue }))) {
        return res.status(404).json({
          success: false,
          message: "assigned user not found",
        });
      }
    }

    const task = await taskSchema.create({
      title: title.trim(),
      description,
      deadline: deadline || undefined,
      status,
      assignedPerson: assignedValue,
      creator: req.user.id,
    });

    return res.status(201).json({
      success: true,
      message: "task create successfully",
      data: task,
    });
  } catch (error) {
    console.error("Task creation failed:", error);

    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    return res.status(500).json({
      success: false,
      message: "task create failed",
    });
  }
};

const getTask = async (req, res) => {
  try {
    // admin সব Task দেখবে, বাকিরা শুধু নিজের তৈরি বা নিজের নামে assign করা
    const filter =
      req.user.role === "admin"
        ? {}
        : { $or: [{ creator: req.user.id }, { assignedPerson: req.user.id }] };

    const tasks = await taskSchema.find(filter).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: "task get successfully",
      length: tasks.length,
      data: tasks,
    });
  } catch (error) {
    console.error("Task fetch failed:", error);
    return res.status(500).json({
      success: false,
      message: "task fetch failed",
    });
  }
};

module.exports = { createtask, getTask };