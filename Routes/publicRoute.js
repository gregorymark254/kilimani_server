const router = require("express").Router()
const Public = require("../Models/public")

//Adding data to mongodb
router.post("/public", async (req, res) => {
  // Validate request
  if (!req.body.title) {
    res.status(400).send({ message: "Content can not be empty!" });
    return;
  }

  // Create a publicPost
  const publicPost = new Public({
    radio: req.body.radio,
    title: req.body.title,
    message: req.body.message
  });

  // Save publicPost in the database
  publicPost.save(publicPost)
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

// POST a reply to a specific comment in a publicpost
router.post("/public/:id", async (req, res) => {
  const id = req.params.id;

  try {
    const publicpost = await Public.findById(id);

    if (!publicpost) {
      return res.status(404).json({ message: "Public not found" });
    }

    if (!req.body.reply) {
      return res.status(400).json({ message: "Comment reply is required" });
    }

    const newComment = {
      reply: req.body.reply,
    };

    publicpost.comments.push(newComment);

    // Save the updated publicpost with the new comment
    const updatedBlog = await publicpost.save();

    res.status(201).json(updatedBlog);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Route to get all comments for all publicpost posts
router.get('/public/comments', async (req, res) => {
  try {
    // Find all comments for all publicpost posts
    const publicposts = await Public.find().populate('comments');
    const comments = publicposts.flatMap(publicpost => publicpost.comments);

    res.json(comments);
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).json({ message: 'Error fetching comments' });
  }
});

// Route to like a public post
router.post("/publicposts/like/:id", async (req, res) => {
  const postId = req.params.id;

  try {
    const publicPost = await Public.findById(postId);

    if (!publicPost) {
      return res.status(404).json({ message: "Public post not found" });
    }

    // Increment the likes count
    publicPost.likes += 1;

    // Save the updated public post
    await publicPost.save();

    res.json({ message: "Liked the public post", likes: publicPost.likes });
  } catch (error) {
    console.error("Error liking public post:", error);
    res.status(500).json({ message: "Error liking public post" });
  }
});

// Route to reduce a like on a public post
router.post("/publicposts/reducelike/:id", async (req, res) => {
  const postId = req.params.id;

  try {
    const publicPost = await Public.findById(postId);

    if (!publicPost) {
      return res.status(404).json({ message: "Public post not found" });
    }

    // Ensure likes count is greater than 0 before reducing
    if (publicPost.likes > 0) {
      // Reduce the likes count by 1
      publicPost.likes -= 1;

      // Save the updated public post
      await publicPost.save();

      res.json({ message: "Reduced a like on the public post", likes: publicPost.likes });
    } else {
      res.status(400).json({ message: "No likes to reduce" });
    }
  } catch (error) {
    console.error("Error reducing like on public post:", error);
    res.status(500).json({ message: "Error reducing like on public post" });
  }
});

//Get all publicPost
router.get('/all', (req, res) =>{
  const title = req.query.title;
  let condition = title ? { title: { $regex: new RegExp(title), $options: "i" } } : {};

  Public.find(condition)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving Public."
      });
    });
})

//Get publicPost by ID
router.get('/all/:id', (req, res) =>{
  const id = req.params.id;

  Public.findById(id)
    .then(data => {
      if (!data)
        res.status(404).send({ message: "No found publicPost with id " + id });
      else res.send(data);
    })
    .catch(err => {
      res
        .status(500)
        .send({ message: "Error retrieving publicPost with id=" + id });
    });
})

// Updating publicPost
router.post('/update/:id', (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: "Data to update can not be empty!"
    });
  }

  const id = req.params.id;

  Public.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot update publicPost with id=${id}. Maybe publicPost was not found!`
        });
      } else res.send({ message: "publicPost was updated successfully." });
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating publicPost with id=" + id
      });
    });
})

// Deleting publicPost
router.delete('/delete/:id', (req, res) => {
  const id = req.params.id;

  Public.findByIdAndRemove(id, { useFindAndModify: false })
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot delete publicPost with id=${id}. Maybe publicPost was not found!`
        });
      } else {
        res.send({
          message: "publicPost was deleted successfully!"
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete publicPost with id=" + id
      });
    });
})

module.exports = router;