const express = require("express");
const pulpitController = require("../controllers/PulpitController.js");
const pulpitRouter = express.Router();

pulpitRouter.get("/", pulpitController.getPulpits);
pulpitRouter.post("/create", pulpitController.addPulpit);
pulpitRouter.put("/update", pulpitController.updatePulpit);
pulpitRouter.delete("/delete", pulpitController.deletePulpit);

module.exports = pulpitRouter;