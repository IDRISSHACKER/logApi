const router = require('express').Router();
const sqlite = require('sqlite3');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const db = new sqlite.Database('database.sqlite', (err) => {})
db.run("CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT, email TEXT, admin BOOLEAN, password TEXT)");

const generateToken = (user) => {
    return jwt.sign(user, process.env.JWT_ACCESS_TOKEN, { expiresIn: '120s' });
}

const userTokenMiddleware = (req, res, next) => {
    const header = req.headers['authorization'];
    const token  = header && header.split(' ')[1];

    if (!token) {
        res.status(401).json(
            {
                code: 401,
                message: 'Access denied. No token provided.',
            }
        );
    }

    jwt.verify(token, process.env.JWT_ACCESS_TOKEN, (err, user) => {
        if(err){
            res.status(403).json(
                {
                    code: 403,
                    message: 'Token not verified.',
                }
            );
        }

        req.user = user;
        next();

    });
}

router.post('/login', (req, res) => {
    const { email, password } = req.body;
    db.get('SELECT * FROM users WHERE email = ? AND password = ?', [email, password], (_err, row) => {
        console.log(row)
        if(row) {
            res.status(200).json({
                success: true,
                message: 'Login successful',
                token: generateToken(row)
            });
        }else {
            //db.run("INSERT INTO users(username, email, admin, password) VALUES (?, ?, ?, ?)", ["elon", "elon@gmail.com", false, 1234567]);
            res.status(401).json({
                success: false,
                message: 'Login failed'
            });
        }
    });
})

router.get('/infos', userTokenMiddleware, (req, res) => {
    res.status(200).json(req.user)
})


module.exports = router;