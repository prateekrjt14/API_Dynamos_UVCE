// server.js

const crypto = require('crypto');
const express = require('express');
const session = require('express-session');
const db = require('./firebase');
const bodyParser = require('body-parser');
const attendanceRoutes = require('./routes/attendanceRoutes');
const taskRoutes = require('./routes/taskRoutes');
const methodOverride = require('method-override');
const marksRoutes = require('./routes/marksRoutes');
const expenseRoutes = require('./routes/expenseRoutes');
const path = require('path');
const { getSubjectsByUserId } = require('./models/attendanceModel');
const { getTasksByUserId } = require('./models/taskModel');
const { getMarksRecordsByUserId } = require('./models/marksModel');
const { getExpensesByUserId } = require('./models/expenseModel');
const secretKey = crypto.randomBytes(32).toString('hex');

const app = express();
const PORT = process.env.PORT || 5000;

app.set("view engine", "ejs");

// Middleware
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Set up session middleware
app.use(session({
    secret: secretKey,
    resave: false,
    saveUninitialized: true
}));

// Method override middleware setup
app.use(methodOverride('_method'));

// Serve static files (CSS, JavaScript, images) from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/tasks', taskRoutes);
app.use('/attendance', attendanceRoutes);
app.use('/marks', marksRoutes);
app.use('/expenses', expenseRoutes);

// Signup page
app.get('/signup', (req, res) => {
    res.render('signup');
});

// Login page
app.get('/login', (req, res) => {
    res.render('login');
});

// Route for about page
app.get('/about', (req, res) => {
    res.render('about');
});

app.get('/homepage',(req,res)=>{
    res.render('homepage');
});

// Signup Endpoint
app.post('/signup', async (req, res) => {
    const { email, password } = req.body;

    // Encrypt password
    const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');

    try {
        // Check if user already exists
        const userRef = db.collection('users').doc(email);
        const doc = await userRef.get();

        if (doc.exists) {
            return res.status(400).json({ error: 'User already exists' });
        }

        // Create new user
        await userRef.set({
            email,
            password: hashedPassword
        });

        // Redirect to login page after successful signup
        res.redirect('/login');

    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

  // Login endpoint
app.post('/login', async (req, res) => {
    const { email, password } = req.body;
  
    // Encrypt entered password
    const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');
  
    try {
      // Retrieve user from Firestore
      const userRef = db.collection('users').doc(email);
      const doc = await userRef.get();
  
      if (!doc.exists) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      const userData = doc.data();
  
      // Check if passwords match
      if (userData.password !== hashedPassword) {
        return res.status(401).json({ error: 'Incorrect password' });
      }
  
      // Render the homepage with user email
      req.session.userId = email;
      res.redirect('/homepage');
    } catch (error) {
      console.error('Error logging in:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  
app.get('/', async (req, res) => {
    try {
        res.render('index');
    } catch (error) {
        console.error('Error retrieving subjects:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Function to classify tasks as active or missed based on user ID
const classifyTasks = (userId, tasks) => {
    const currentDate = new Date();
    const activeTasks = [];
    const missedTasks = [];

    // Ensure tasks array and task objects have required properties
    if (!Array.isArray(tasks)) {
        throw new Error('Tasks must be an array.');
    }

    tasks.forEach(task => {
        // Ensure each task object has 'endDate' property
        if (!task || !task.endDate) {
            throw new Error('Invalid task format: endDate is missing.');
        }

        const endDate = new Date(task.endDate);
        if (endDate >= currentDate) {
            activeTasks.push(task);
        } else {
            missedTasks.push(task);
        }
    });

    return { activeTasks, missedTasks };
};

app.get('/attd', async (req, res) => {
    try {
        // Assuming userId is obtained from the session or request
        const userId = req.session.userId; // Replace with the actual userId
        const subjects = await getSubjectsByUserId(userId);
        res.render('attendanceLanding', { subjects });
    } catch (error) {
        console.error('Error retrieving subjects:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/ddln', async (req, res) => {
    try {
        const userId = req.session.userId; // Replace with the actual userId or username from the session or request

        // Retrieve tasks associated with the current user's userId
        const tasks = await getTasksByUserId(userId);

        // Classify tasks as active and missed
        const { activeTasks, missedTasks } = classifyTasks(userId, tasks);

        res.render('tasks', { activeTasks, missedTasks }); // Pass activeTasks and missedTasks to the template
    } catch (error) {
        console.error('Error in /ddln route:', error);
        res.status(500).send(`Internal Server Error: ${error.message}`);
    }
});

const marksModel = require('./models/marksModel');

// Route to fetch and render marks records
app.get('/scr', async (req, res) => {
    try {
        // Assuming userId is available in the request object
        const userId = req.session.userId; // Replace this with the actual way of getting userId
        
        // Fetch marks for the logged-in user
        const marks = await getMarksRecordsByUserId(userId);
        
        // Render the marks.ejs template with marks data
        res.render('marks', { marks });
    } catch (error) {
        console.error('Error fetching marks:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/exp', async (req, res) => {
    try {
        // Assuming userId is obtained from the session or request
        const userId = req.session.userId; // Replace with the actual way of getting userId
        
        // Fetch expenses for the logged-in user
        const expenses = await getExpensesByUserId(userId);
        
        // Calculate the total amount
        const totalAmount = expenses.reduce((total, expense) => total + parseFloat(expense.amount), 0);
        
        // Calculate category-wise total amount
        const categoryWiseTotal = {};
        expenses.forEach(expense => {
            if (categoryWiseTotal[expense.category]) {
                categoryWiseTotal[expense.category] += parseFloat(expense.amount);
            } else {
                categoryWiseTotal[expense.category] = parseFloat(expense.amount);
            }
        });

        // Render the expense.ejs template with expense data, totalAmount, and categoryWiseTotal
        res.render('expense', { expenses, totalAmount, categoryWiseTotal });
    } catch (error) {
        console.error('Error fetching expenses:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
