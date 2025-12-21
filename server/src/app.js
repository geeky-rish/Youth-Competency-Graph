const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const skillRoutes = require('./routes/skillRoutes');
const roleRoutes = require('./routes/roleRoutes');
const learningRoutes = require('./routes/learningRoutes');
const recommendationRoutes = require('./routes/recommendationRoutes');
const graphRoutes = require('./routes/graphRoutes');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/profile', userRoutes);
app.use('/api/skills', skillRoutes);
app.use('/api/roles', roleRoutes);
app.use('/api/learning', learningRoutes);
app.use('/api/recommendations', recommendationRoutes);
app.use('/api/graph', graphRoutes);

const { errorHandler } = require('./middleware/errorMiddleware');

// Health Check
app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'ok', message: 'Server is running' });
});

app.use(errorHandler);

module.exports = app;
