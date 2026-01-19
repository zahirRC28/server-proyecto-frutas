const jwt = require("jsonwebtoken");

const JWTgenerator = (payload) =>{
    return new Promise((resolve, reject) =>{
        jwt.sign(
            payload, process.env.SECRET_KEY, { expiresIn: "2h" }, (error, token) =>{
                if(error){
                    console.log(error)
                    reject(error);
                }else{
                    resolve(token);
                }
            }
        )
    })
}

module.exports = { JWTgenerator };