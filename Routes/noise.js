const noise = require("../Controller/noisecontrolller");

let router = require("express").Router();

// Create a new Tutorial
router.post("/add", noise.create);

// Retrieve all noise
router.get("/all", noise.findAlls);

// Retrieve a single Tutorial with id
router.get("/all/:id", noise.findOne);

// Update a Tutorial with id
router.put("/put/:id", noise.update);

// Delete a Tutorial with id
router.delete("/delete/:id", noise.delete);

// Delete all noise
router.delete("/delete", noise.deleteAll);

module.exports = router
