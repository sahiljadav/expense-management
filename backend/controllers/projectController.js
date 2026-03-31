const prisma = require('../prismaClient');

const createProject = async (req, res) => {
  try {
    const { ProjectName, ProjectStartDate, ProjectEndDate, ProjectDetail, Budget } = req.body;
    
    if (!ProjectName) {
      return res.status(400).json({ message: "Project Name is required" });
    }

    // Safe Date Parsing
    let startDate = null;
    let endDate = null;
    try {
      if (ProjectStartDate) {
        const d = new Date(ProjectStartDate);
        if (isNaN(d.getTime())) throw new Error("Invalid Start Date");
        startDate = d;
      }
      if (ProjectEndDate) {
        const d = new Date(ProjectEndDate);
        if (isNaN(d.getTime())) throw new Error("Invalid End Date");
        endDate = d;
      }
    } catch (dateError) {
      return res.status(400).json({ message: dateError.message });
    }

    console.log("Creating project for UserID:", req.user.id);

    // Verify User exists to avoid Foreign Key violation
    const userExists = await prisma.user.findUnique({
      where: { UserID: parseInt(req.user.id) }
    });

    if (!userExists) {
      console.error("UserID not found in User table:", req.user.id);
      return res.status(401).json({ 
        message: "Your session is invalid (User not found). Please log out and log in again.",
        error: "FOREIGN_KEY_VIOLATION_ID_MISMATCH"
      });
    }

    const newProject = await prisma.project.create({
      data: {
        ProjectName,
        ProjectStartDate: startDate,
        ProjectEndDate: endDate,
        ProjectDetail: ProjectDetail || "",
        Description: ProjectDetail || "", 
        Budget: Budget ? parseFloat(Budget) : 0,
        UserID: parseInt(req.user.id)
      }
    });

    res.status(201).json({
      ...newProject,
      id: newProject.ProjectID.toString(),
      name: newProject.ProjectName,
      spent: 0,
      Budget: newProject.Budget ? parseFloat(newProject.Budget) : 0
    });
  } catch (error) {
    console.error("Create Project Error:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

const getProjects = async (req, res) => {
  try {
    const projects = await prisma.project.findMany({
      where: { IsActive: true },
      include: {
        _count: {
          select: { Expenses: true, Incomes: true }
        },
        Expenses: {
          select: { Amount: true }
        }
      },
      orderBy: { Created: 'desc' }
    });

    // Calculate spent amount for each project
    const projectsWithSpent = projects.map(p => {
      const spent = p.Expenses.reduce((sum, e) => sum + parseFloat(e.Amount), 0);
      const { Expenses, ...rest } = p;
      return {
        ...rest,
        id: p.ProjectID.toString(),
        name: p.ProjectName,
        spent,
        Budget: p.Budget ? parseFloat(p.Budget) : 0
      };
    });

    res.json(projectsWithSpent);
  } catch (error) {
    res.status(500).json({ message: "Error fetching projects", error: error.message });
  }
};

const updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const { ProjectName, ProjectStartDate, ProjectEndDate, ProjectDetail, Budget, IsActive } = req.body;
    
    const data = {};
    if (ProjectName !== undefined) data.ProjectName = ProjectName;
    if (ProjectDetail !== undefined) {
      data.ProjectDetail = ProjectDetail;
      data.Description = ProjectDetail; 
    }
    if (Budget !== undefined) data.Budget = parseFloat(Budget);
    if (IsActive !== undefined) data.IsActive = IsActive;

    // Safe Date Parsing for Update
    try {
      if (ProjectStartDate !== undefined) {
        if (ProjectStartDate) {
          const d = new Date(ProjectStartDate);
          if (isNaN(d.getTime())) throw new Error("Invalid Start Date");
          data.ProjectStartDate = d;
        } else {
          data.ProjectStartDate = null;
        }
      }
      if (ProjectEndDate !== undefined) {
        if (ProjectEndDate) {
          const d = new Date(ProjectEndDate);
          if (isNaN(d.getTime())) throw new Error("Invalid End Date");
          data.ProjectEndDate = d;
        } else {
          data.ProjectEndDate = null;
        }
      }
    } catch (dateError) {
      return res.status(400).json({ message: dateError.message });
    }

    const project = await prisma.project.update({
      where: { ProjectID: parseInt(id) },
      data
    });

    res.json({
      ...project,
      id: project.ProjectID.toString(),
      name: project.ProjectName,
      Budget: project.Budget ? parseFloat(project.Budget) : 0
    });
  } catch (error) {
    console.error("Update Project Error:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.project.update({
      where: { ProjectID: parseInt(id) },
      data: { IsActive: false }
    });
    res.json({ message: "Project deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting project", error: error.message });
  }
};

module.exports = { createProject, getProjects, updateProject, deleteProject };
