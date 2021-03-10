const express = require("express");
const facultyController = require("../controllers/facultyController.js");
const facultyRouter = express.Router();

facultyRouter.get("/", facultyController.getFaculties);
facultyRouter.post("/create", facultyController.addFaculty);
facultyRouter.put("/update", facultyController.updateFaculty);
facultyRouter.delete("/delete", facultyController.deleteFaculty);

module.exports = facultyRouter;