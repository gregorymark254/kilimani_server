const db = require("../Models/index");
const Noise = db.noise;
const Op = db.Sequelize.Op;

// Create and Save a new Noise
exports.create = (req, res) => {
  // Validate request
  if (!req.body.noise) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
    return;
  }

  // Create a Noise
  const booking = {
    noise: req.body.noise,
  };

  // Save Noise in the database
  Noise.create(booking)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message : err.message || "Some error occurred while creating the Noise."
      });
    });
};

// Retrieve all Noise from the database.
exports.findAlls = (req, res) => {
  const noise = req.query.noise;
  const condition = noise ? { noise: { [Op.like]: `%${noise}%` } } : null;

  Noise.findAll({ where: condition })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({message : err.message || "Some error occurred while retrieving Noise."
      });
    });
};

// Find a single Noise with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  Noise.findByPk(id)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({ message: "Error retrieving Noise with id=" + id
      });
    });
};

// Update a Noise by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;

  Noise.update(req.body, {
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({message: "Noise was updated successfully."
        });
      } else {
        res.send({ message: `Cannot update Noise with id=${id}. Maybe Noise was not found or req.body is empty!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({ message: "Error updating Noise with id=" + id
      });
    });
};

// Delete a Noise with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  Noise.destroy({
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({ message: "Noise was deleted successfully!"
        });
      } else {
        res.send({ message: `Cannot delete Noise with id=${id}. Maybe Noise was not found!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({ message: "Could not delete Noise with id=" + id
      });
    });
};

// Delete all Noise from the database.
exports.deleteAll = (req, res) => {
  Noise.destroy({
    where: {},
    truncate: false
  })
    .then(nums => {res.send({ message: `${nums} Noise were deleted successfully!` });
    })
    .catch(err => {
      res.status(500).send({ message: err.message || "Some error occurred while removing all Noise."
      });
    });
};