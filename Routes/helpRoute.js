const router = require("express").Router()
const Helpsupport = require("../Models/help")

//Adding data to mongodb
router.post("/support", async (req, res) => {
  // Validate request
  if (!req.body.email) {
    res.status(400).send({ message: "Content can not be empty!" });
    return;
  }

  // Create a proposal
  const proposal = new Helpsupport({
    email: req.body.email,
    proposal: req.body.proposal,
    description: req.body.description,
    file: req.body.file
  });

  // Save proposal in the database
  proposal.save(proposal)
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

//Get all proposal
router.get('/all', (req, res) =>{
  const email = req.query.email;
  let condition = email ? { email: { $regex: new RegExp(email), $options: "i" } } : {};

  Helpsupport.find(condition)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving Helpsupport."
      });
    });
})

//Get proposal by ID
router.get('/all/:id', (req, res) =>{
  const id = req.params.id;

  Helpsupport.findById(id)
    .then(data => {
      if (!data)
        res.status(404).send({ message: "No found proposal with id " + id });
      else res.send(data);
    })
    .catch(err => {
      res
        .status(500)
        .send({ message: "Error retrieving proposal with id=" + id });
    });
})

// Updating proposal
router.post('/update/:id', (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: "Data to update can not be empty!"
    });
  }

  const id = req.params.id;

  Helpsupport.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot update proposal with id=${id}. Maybe proposal was not found!`
        });
      } else res.send({ message: "proposal was updated successfully." });
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating proposal with id=" + id
      });
    });
})


// Deleting proposal
router.delete('/delete/:id', (req, res) => {
  const id = req.params.id;

  Helpsupport.findByIdAndRemove(id, { useFindAndModify: false })
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot delete proposal with id=${id}. Maybe proposal was not found!`
        });
      } else {
        res.send({
          message: "proposal was deleted successfully!"
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete proposal with id=" + id
      });
    });
})

module.exports = router;