const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const authRoutes = require('./routes/authRoutes');
const expenseRoutes = require('./routes/expenseRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const peopleRoutes = require('./routes/peopleRoutes');
const projectRoutes = require('./routes/projectRoutes');
const incomeRoutes = require('./routes/incomeRoutes');
const subCategoryRoutes = require('./routes/subCategoryRoutes');

const adminRoutes = require('./routes/adminRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();

const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:8080',
    'http://10.70.17.224:8080',
    'http://10.70.17.224:5173'
];

const corsOptions = {
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(null, true); // Fallback for dev: allow all for now if it's not in the list but logging warning
        }
    },
    credentials: true,
};


app.use(cors(corsOptions));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/user', userRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/people', peopleRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/subcategories', subCategoryRoutes);

// Generic routes
app.use('/api/expenses', expenseRoutes);
app.use('/api/incomes', incomeRoutes);

app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Expense Manager API is running' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
