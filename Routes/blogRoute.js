const router = require("express").Router()
const Blog = require("../Models/blog")

//Adding data to mongodb
router.post("/blog", async (req, res) => {
  // Validate request
  if (!req.body.subject) {
    res.status(400).send({ message: "Content can not be empty!" });
    return;
  }

  // Create a blogs
  const blogs = new Blog({
    subject: req.body.subject,
    description: req.body.description
  });

  // Save blogs in the database
  blogs.save(blogs)
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

// POST a reply to a specific comment in a blog
router.post("/blogs/:id", async (req, res) => {
  const id = req.params.id;

  try {
    const blog = await Blog.findById(id);

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    if (!req.body.text) {
      return res.status(400).json({ message: "Comment text is required" });
    }

    const newComment = {
      text: req.body.text,
    };

    blog.comments.push(newComment);

    // Save the updated blog with the new comment
    const updatedBlog = await blog.save();

    res.status(201).json(updatedBlog);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Route to get all comments for all blog posts
router.get('/blogs/comments', async (req, res) => {
  try {
    // Find all comments
    const comments = await Blog.find();

    res.json(comments);
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).json({ message: 'Error fetching comments' });
  }
});

//Get all blogs
router.get('/all', (req, res) =>{
  const subject = req.query.subject;
  let condition = subject ? { subject: { $regex: new RegExp(subject), $options: "i" } } : {};

  Blog.find(condition)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving Blog."
      });
    });
})

//Get blogs by ID
router.get('/all/:id', (req, res) =>{
  const id = req.params.id;

  Blog.findById(id)
    .then(data => {
      if (!data)
        res.status(404).send({ message: "No found blogs with id " + id });
      else res.send(data);
    })
    .catch(err => {
      res
        .status(500)
        .send({ message: "Error retrieving blogs with id=" + id });
    });
})

// Updating blogs
router.post('/update/:id', (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: "Data to update can not be empty!"
    });
  }

  const id = req.params.id;

  Blog.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot update blogs with id=${id}. Maybe blogs was not found!`
        });
      } else res.send({ message: "blogs was updated successfully." });
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating blogs with id=" + id
      });
    });
})


// Deleting blogs
router.delete('/delete/:id', (req, res) => {
  const id = req.params.id;

  Blog.findByIdAndRemove(id, { useFindAndModify: false })
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot delete blogs with id=${id}. Maybe blogs was not found!`
        });
      } else {
        res.send({
          message: "blogs was deleted successfully!"
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete blogs with id=" + id
      });
    });
})

module.exports = router;