const jwt = require('jsonwebtoken');
const secretjwt = 'pratikjimmy@';

const fetchuser = (req, res, next) => {
    try {
        const token = req.header('auth-token');
        if (!token) {
            return res.status(401).send({ error: 'please authenticate using a valid token' });
        }

        const data = jwt.verify(token, secretjwt);
        req.user = data;
        next();
    } catch (error) {
        console.error('Error in fetchuser middleware:', error.message);
        res.status(401).send({ error: 'please authenticate using a valid token' });
    }
};


module.exports = fetchuser;