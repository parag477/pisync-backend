const jwt = require('jsonwebtoken');
const JWT_SECRET = 'your_jwt_secret_key_here'; // In production, use environment variable

// Mock user database (in a real app, this would be in a database with hashed passwords)
const users = [
  {
    id: 1,
    username: 'admin',
    password: 'password123', // In production, this would be hashed
    name: 'Admin User'
  }
];

const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    // Find user
    const user = users.find(u => u.username === username);
    
    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // In a real app, we would use bcrypt to compare hashed passwords
    if (user.password !== password) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Create JWT payload
    const payload = {
      user: {
        id: user.id,
        username: user.username,
        name: user.name
      }
    };

    // Sign token
    jwt.sign(
      payload,
      JWT_SECRET,
      { expiresIn: '1h' },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

const getCurrentUser = async (req, res) => {
  try {
    const user = users.find(u => u.id === req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Don't send password back
    const { password, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

const logout = (req, res) => {
  // Since we're using JWT, the client just needs to remove the token
  // In a real app with refresh tokens, you'd handle token invalidation here
  res.json({ message: 'Logout successful' });
};

module.exports = {
  login,
  getCurrentUser,
  logout
};
