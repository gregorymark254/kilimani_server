const router = require("express").Router()
const Vote = require("../Models/vote")

//Adding data to mongodb
router.post("/vote", async (req, res) => {
  // Validate request
  if (!req.body.votequestion) {
    res.status(400).send({ message: "Content can not be empty!" });
    return;
  }

  // Create a votes
  const votes = new Vote({
    votequestion: req.body.votequestion
    message: req.body.message
  });

  // Save votes in the database
  votes.save(votes)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Tutorial."
      });
    });
});

//Get all votes
router.get('/all', (req, res) =>{
  const votequestion = req.query.votequestion;
  let condition = votequestion ? { votequestion: { $regex: new RegExp(votequestion), $options: "i" } } : {};

  Vote.find(condition)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving Vote."
      });
    });
})

//Get votes by ID
router.get('/all/:id', (req, res) =>{
  const id = req.params.id;

  Vote.findById(id)
    .then(data => {
      if (!data)
        res.status(404).send({ message: "No found votes with id " + id });
      else res.send(data);
    })
    .catch(err => {
      res
        .status(500)
        .send({ message: "Error retrieving votes with id=" + id });
    });
})

// Updating votes
router.post('/update/:id', (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: "Data to update can not be empty!"
    });
  }

  const id = req.params.id;

  Vote.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot update votes with id=${id}. Maybe votes was not found!`
        });
      } else res.send({ message: "votes was updated successfully." });
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating votes with id=" + id
      });
    });
})


// Deleting votes
router.delete('/delete/:id', (req, res) => {
  const id = req.params.id;

  Vote.findByIdAndRemove(id, { useFindAndModify: false })
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot delete votes with id=${id}. Maybe votes was not found!`
        });
      } else {
        res.send({
          message: "votes was deleted successfully!"
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete votes with id=" + id
      });
    });
})

module.exports = router;