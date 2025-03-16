const jwt = require('jsonwebtoken');
const now = new Date();

// Validate the access token and allow access if it's valid and the user is logged in.
const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization');
  if(!token) {
    return res.status(401).send(`[${now}]Access Denied. No token provided.`);
  }

  try{
    const decoded = jwt.verify(token.replace('Bearer ', ''), process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch(error){
    return res.status(403).json({ message: `[${now}]Invalid Token.` });
  }
}

module.exports = authMiddleware;