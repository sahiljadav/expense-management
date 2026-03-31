const bcrypt = require('bcryptjs');
const prisma = require('../prismaClient');

// Get all users (People)
const getPeople = async (req, res) => {
  try {
    const people = await prisma.people.findMany({
      include: {
        _count: {
          select: { Expenses: true, Incomes: true }
        }
      }
    });
    // Remove passwords before sending to frontend
    const safePeople = people.map(p => {
      const { Password, ...rest } = p;
      return {
        ...rest,
        id: p.PeopleID.toString(),
        name: p.PeopleName,
        email: p.Email,
        mobile: p.MobileNo,
        role: "user", // Default role for People/Employees
        isActive: p.IsActive,
        created: p.Created
      };
    });
    res.json(safePeople);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Create new user (People)
const createPerson = async (req, res) => {
  try {
    const { PeopleName, Email, Password, MobileNo, Description, IsActive } = req.body;
    
    // Check if email exists
    const existingPerson = await prisma.people.findUnique({ where: { Email } });
    if (existingPerson) return res.status(400).json({ message: "Email already exists" });

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(Password, salt);

    const newPerson = await prisma.people.create({
      data: {
        PeopleName,
        Email,
        Password: hashedPassword,
        MobileNo,
        Description,
        IsActive: IsActive !== undefined ? IsActive : true,
        UserID: req.user.id // the admin who created this user
      }
    });

    const { Password: _, ...personResponse } = newPerson;
    res.status(201).json({ message: "User created successfully", user: personResponse });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Update user (People)
const updatePerson = async (req, res) => {
  try {
    const { id } = req.params;
    const { PeopleName, Email, MobileNo, Description, IsActive, Password } = req.body;

    const dataToUpdate = {
      PeopleName,
      Email,
      MobileNo,
      Description,
      IsActive
    };

    if (Password) {
      const salt = await bcrypt.genSalt(10);
      dataToUpdate.Password = await bcrypt.hash(Password, salt);
    }

    const updatedPerson = await prisma.people.update({
      where: { PeopleID: parseInt(id) },
      data: dataToUpdate
    });

    const { Password: _, ...personResponse } = updatedPerson;
    res.json({ message: "User updated successfully", user: personResponse });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Delete user (People)
const deletePerson = async (req, res) => {
  try {
    const { id } = req.params;

    // Optional: check if there are linked expenses/incomes and prevent delete or cascade
    
    await prisma.people.delete({
      where: { PeopleID: parseInt(id) }
    });

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    // Check if it's a foreign key constraint error
    if (error.code === 'P2003') {
        return res.status(400).json({ message: "Cannot delete user because they have associated expenses or incomes. Please deactivate instead." });
    }
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { getPeople, createPerson, updatePerson, deletePerson };
