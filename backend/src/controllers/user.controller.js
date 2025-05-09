import User from "../models/user.model.js"
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    
    // 1. Basic validation
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // 2. Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({status:400, message: 'User already exists with this email', });
    }

    // 3. Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. Create new user
    const newUser = new User({
      username,
      email,
      password: hashedPassword
    });

    await newUser.save();

    // 5. Generate token (optional)
    console.log(process.env.JWT_SECRET);
    
    const token = jwt.sign(
      { userId: newUser._id, email: newUser.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // 6. Respond
    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email
      },
      token
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

//login user

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
    
        // 1. Basic validation
        if (!email || !password) {
        return res.status(400).json({ message: 'All fields are required' });
        }
    
        // 2. Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
        }
    
        // 3. Check password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
        return res.status(401).json({ message: 'Invalid credentials' });
        }
    
        // 4. Generate token
        const token = jwt.sign(
        { userId: user._id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
        );
    
        // 5. Respond
        res.status(200).json({
        message: 'User logged in successfully',
        user: {
            id: user._id,
            username: user.username,
            email: user.email
        },
        token
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error' });
    }
    }

// get user controller

const getUser = async (req, res) => {
    try {
        // Check if the authorization header exists
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ message: "Unauthorized: No token provided" });
        }

        // Extract and verify token
        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.userId;

        // Validate the user
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json({
            message: "User retrieved successfully",
            user: user,
        });
    } catch (error) {
        console.error("User retrieval error:", error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
}





export {register,login,getUser}