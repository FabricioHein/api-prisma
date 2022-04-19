import {sign, verify} from "jsonwebtoken";

// require('crypto').randomBytes(64).toString('hex')
// Gerar Token

export default {
  generateAccessToken(username) {

    return sign(username, process.env.TOKEN_SECRET, { 
      expiresIn: "2 days",  algorithm: 'HS256' });
  },
  authenticateToken(req, res, next) {
    const authHeader = req.headers["authorization"];
    const accessTokenSecret = process.env.TOKEN_SECRET;
    
    if (!authHeader) return res.sendStatus(401).json({
      message: "Token is missing"
    });

    try {

      const [, token]= authHeader.split(" ")
     
      verify(token, accessTokenSecret)
      
      return next()
    } catch (error) {

      return res.status(401).json({
        message: "Token Inválido"
      })
      
    }
   

    
    // jwt.verify(token, process.env.TOKEN_SECRET, (err, req) => {

    //   console.log(req)

    //   if (err) return res.sendStatus(403).json({message: "Erro "});

    //   req.user = user;

    //   next();
    // });
  },
};
