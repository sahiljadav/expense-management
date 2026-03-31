const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../prismaClient');

// Admin User Register
const registerAdmin = async (req, res) => {
  try {
    const { UserName, EmailAddress, Password, MobileNo, ProfileImage } = req.body;
    
    // Check if user exists
    const existingUser = await prisma.user.findUnique({ where: { EmailAddress } });
    if (existingUser) return res.status(400).json({ message: "Email already exists" });

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(Password, salt);

    // Create user
    const newUser = await prisma.user.create({
      data: {
        UserName,
        EmailAddress,
        Password: hashedPassword,
        MobileNo,
        ProfileImage
      }
    });

    res.status(201).json({ message: "Admin registered successfully", userId: newUser.UserID });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// General Login (checks both Admin/User and Employee/People)
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // First check Admin (User table)
    let user = await prisma.user.findUnique({ where: { EmailAddress: email } });
    let role = 'admin';

    // If not admin, check People
    if (!user) {
      user = await prisma.people.findUnique({ where: { Email: email } });
      role = 'user';
    }

    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.Password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      { id: user.UserID || user.PeopleID, role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user.UserID || user.PeopleID,
        name: user.UserName || user.PeopleName,
        email: user.EmailAddress || user.Email,
        role
      }
    });

  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { registerAdmin, login };
