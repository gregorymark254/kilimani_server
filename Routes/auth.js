const router = require("express").Router()
const User = require("../Models/auths")
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')

//Register new user
router.post('/register', async (req, res) => {
  try {
    const { fullName, email, phone, password } = req.body;

    // Check if required fields are provided
    if (!fullName || !email || !phone || !password) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    // Check for duplicate email in the database
    const existingUser = await User.findOne({ email }).exec();
    if (existingUser) {
      return res.status(409).json({ message: 'Email already exists.' }); // Conflict
    }

    // Encrypt the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create and store the new user
    const newUser = new User({
      fullName,
      email,
      phone,
      password: hashedPassword,
    });

    await newUser.save();

    res.status(201).json({ success: `New user ${email} created!` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'An error occurred while processing your request.' });
  }
});


//Login user
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ message: 'Username and password are required.' });
    }

    const foundUser = await User.findOne({ email }).exec();
    
    if (!foundUser) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    // Evaluate password
    const match = await bcrypt.compare(password, foundUser.password);

    if (match) {
      const { email, isAdmin } = foundUser;

      // Create JWTs
      const accessToken = jwt.sign(
        {
          UserInfo: {
            email: email,
            isAdmin,
          },
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '1h' } // Increase expiration time if needed
      );

      const newRefreshToken = jwt.sign(
        { email },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: '24h' } // Increase expiration time if needed
      );

      // Saving refreshToken with the current user
      foundUser.refreshToken = newRefreshToken;

      try {
        await foundUser.save();
      } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Server error.' });
      }

      // Send authorization roles and access token to user
      res.json({ email, isAdmin, accessToken });
    } else {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});


//Getting all User accounts from mongo db
router.get("/users", async (req,res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({message: error.message});
  }
})


//Getting all User accounts from mongo db by ID
router.get('/users/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


//Updating User accounts from mongo db by ID
router.put('/users/update/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    const updateData = req.body;

    const updatedUser = await User.findByIdAndUpdate(userId, updateData, { new: true });

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});


//Deleting User accounts from mongo db by ID
router.delete('/users/delete/:id', async (req, res) => {
  try {
    const userId = req.params.id;

    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(deletedUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});


module.exports = router