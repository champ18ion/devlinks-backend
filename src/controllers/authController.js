const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const authMiddleware = require('../middleware/auth');

// Signup controller
exports.signup = (req, res) => {
    const { username, email, password } = req.body;

    // Hash the password
    bcrypt.hash(password, 10, (err, hash) => {
        if (err) {
            return res.status(500).json({ error: 'Error hashing password' });
        }

        // Insert user into database using User model
        User.create(username, email, hash, (error, results) => {
            if (error) {
                if (error.code === 'ER_DUP_ENTRY') {
                    return res.status(409).json({ error: 'Username or email already exists' });
                }
                return res.status(500).json({ error: 'Error creating user' });
            }
            res.status(201).json({ message: 'User created successfully', userId: results.insertId });
        });
    });
};

// Signin controller
exports.signin = (req, res) => {
    const { email, password } = req.body;

    // Find user by email using User model
    User.findByEmail(email, (error, results) => {
        if (error) {
            return res.status(500).json({ error: 'Error finding user' });
        }
        if (results.length === 0) {
            return res.status(401).json({ error: 'Authentication failed' });
        }

        const user = results[0];

        // Compare passwords
        bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) {
                return res.status(500).json({ error: 'Error comparing passwords' });
            }
            if (!isMatch) {
                return res.status(401).json({ error: 'Authentication failed' });
            }

            // Create and send JWT token
            const token = jwt.sign(
                { userId: user.id, email: user.email },
                process.env.JWT_SECRET || 'your_jwt_secret',
                { expiresIn: '1h' }
            );

            res.status(200).json({ message: 'Authentication successful', token });
        });
    });
};

// Protected route example
exports.protectedRoute = [authMiddleware, (req, res) => {
    res.status(200).json({ message: 'Access granted to protected route', user: req.user });
}];
