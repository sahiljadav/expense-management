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
      { id: role === 'admin' ? user.UserID : user.PeopleID, role },
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

const signup = async (req, res) => {
  try {
    const { UserName, EmailAddress, Password, MobileNo } = req.body;
    
    // Check if user exists in User or People table
    const existingAdmin = await prisma.user.findUnique({ where: { EmailAddress } });
    const existingUser = await prisma.people.findUnique({ where: { Email: EmailAddress } });
    
    if (existingAdmin || existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(Password, salt);

    // Find the first admin to associate this new person with
    let firstAdmin = await prisma.user.findFirst();
    
    // If no admin exists, make THIS user the admin
    if (!firstAdmin) {
      const newAdmin = await prisma.user.create({
        data: {
          UserName,
          EmailAddress,
          Password: hashedPassword,
          MobileNo: MobileNo || '0000000000'
        }
      });
      
      const token = jwt.sign(
        { id: newAdmin.UserID, role: 'admin' },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
      );

      return res.status(201).json({
        message: "First admin created successfully",
        token,
        user: {
          id: newAdmin.UserID,
          name: newAdmin.UserName,
          email: newAdmin.EmailAddress,
          role: 'admin'
        }
      });
    }

    // Create person (regular user) associated with the found admin
    const newPerson = await prisma.people.create({
      data: {
        PeopleName: UserName,
        Email: EmailAddress,
        Password: hashedPassword,
        MobileNo,
        UserID: firstAdmin.UserID,
        IsActive: true
      }
    });


    // Generate token for auto-login after signup
    const token = jwt.sign(
      { id: newPerson.PeopleID, role: 'user' },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.status(201).json({
      message: "Registration successful",
      token,
      user: {
        id: newPerson.PeopleID,
        name: newPerson.PeopleName,
        email: newPerson.Email,
        role: 'user'
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { registerAdmin, login, signup };
