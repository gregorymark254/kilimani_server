const router = require("express").Router()
const Events = require("../Models/events")


//Adding data to mongodb
router.post("/events", async (req, res) => {
  // Validate request
  if (!req.body.title) {
    res.status(400).send({ message: "Content can not be empty!" });
    return;
  }

  // Create a event
  const event = new Events({
    title: req.body.title,
    image: req.body.image,
    date: req.body.date,
    location: req.body.location,
    about: req.body.about
  });

  // Save event in the database
  event.save(event)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the events."
      });
    });
});

//Get all event
router.get('/all', (req, res) =>{
  const title = req.query.title;
  let condition = title ? { title: { $regex: new RegExp(title), $options: "i" } } : {};

  Events.find(condition)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving Events."
      });
    });
})

//Get event by ID
router.get('/all/:id', (req, res) =>{
  const id = req.params.id;

  Events.findById(id)
    .then(data => {
      if (!data)
        res.status(404).send({ message: "No found event with id " + id });
      else res.send(data);
    })
    .catch(err => {
      res
        .status(500)
        .send({ message: "Error retrieving event with id=" + id });
    });
})

// Updating event
router.post('/update/:id', (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: "Data to update can not be empty!"
    });
  }

  const id = req.params.id;

  Events.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot update event with id=${id}. Maybe event was not found!`
        });
      } else res.send({ message: "event was updated successfully." });
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating event with id=" + id
      });
    });
})


// Deleting event
router.delete('/delete/:id', (req, res) => {
  const id = req.params.id;

  Events.findByIdAndRemove(id, { useFindAndModify: false })
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot delete event with id=${id}. Maybe event was not found!`
        });
      } else {
        res.send({
          message: "event was deleted successfully!"
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete event with id=" + id
      });
    });
})

module.exports = router;