const jwt = require("jsonwebtoken");


module.exports = (req,res,next)=>{
    try{
        const token = req.headers.authorization.split(" ")[1];
        console.log(token);
        const verify = jwt.verify(token,'this is rajnish');
        console.log(verify);
        next();
        

    }
    catch{
        return res.status(401).json({
            message:"Invalid Token"
        })
    }
}