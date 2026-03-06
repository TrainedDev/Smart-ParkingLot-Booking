const jwt = require("jsonwebtoken");
const { config } = require("dotenv");

config();

 const auth = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];

    
    if (!token) return res.status(401).json({msg: "access denied"});
    
    const decode = jwt.verify(token, process.env.SECRET_KEY);

    req.userId = decode.id;
    next();
  } catch (error) {
    res.status(500).json({msg: "failed to authenticate user", error: error.message });
  }
};

module.exports = auth;