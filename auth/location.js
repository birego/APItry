import jwt from 'jsonwebtoken';
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (token == null) return res.sendStatus(401);

  jwt.verify(token, secretKey, (err, user) => {
    if (err) return res.sendStatus(403);
    console.log('Token decoded, user:', user);
    req.user = user;
    next();
  });
}


  export default authenticateToken;