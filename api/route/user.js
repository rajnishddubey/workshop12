const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const User = require("../model/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const chekAuth = require("../middilware/chek-auth");
//const { db } = require("../model/user");
const user = require("../model/user");


router.post("/signup",(req,res,next)=>{
    
  bcrypt.hash(req.body.password,20,(err,hash)=>{
        if(err){
           
            return res.status(500).json({
                error:err
            })
        }
        else{
            console.log(hash)
            const user = new User({
                _id:req.body._id,
                username:req.body.username,
                password:hash,
                email:req.body.email,
                phone:req.body.phone
            })

            user.save()
            .then(result=>{
                res.status(200).json({
                    new_user:result
                })
            })
            .catch(err=>{
                res.status(500).json({
                    error:err
                })
            })
        }
    })

})

router.post("/login",(req,res,next)=>{
    User.find({username:req.body.username})
    .exec()
    .then(user=>{
        if(user.length < 1){
            return res.status(401).json({
                message:"user not found"
            })
        }
        bcrypt.compare(req.body.password,user[0].password,(err,result)=>{
            if(!result){
                return res.status(401).json({
                    message:"password matching failed"
                })
            }
            if(result){
                const token = jwt.sign({
                    username:user[0].username,
                    email:user[0].email,
                    phone:user[0].phone 
                },
                'this is rajnish',
                {
                    expiresIn:"24h"
                }
                );
                res.status(200).json({
                    username:user[0].username,
                    email:user[0].email,
                    phone:user[0].phone,
                    token:token

                })
 
            }
        })
    })
    .catch(err=>{
        res.status(500).json({
            error:err
        })
    })
})

router.get("/",chekAuth,(req,res,next)=>{
    User.find()
    .exec()
    .then(result=>{
        res.status(200).json({
            all_user:result
        })
    })
})

router.get("/task",(req,res,next)=>{
    try{
    const { page = 1 , limit= 10 } = req.query;
    const user = User.find().limit(limit-1).skip((page-1) * limit)
    .exec()
    .then(user=>{
        res.status(200).json({
            all_user:user
        })
    })
}catch(err){
    res.status(500).json({
        error:err
    })
}

})


router.get("/sorting",async(req,res,next)=>{
    const sort = {}
    if(req.query.sortBy){
        const str = req.query.sortBy.split(':')
        sort[str[0]] = str[1] === 'desc' ? -1:1
    }
    try {
        // const tasks = await Tasks.find({owner:req.user._id})
        const result = await User.find()
        .exec();
        res.status(200).send(result)
    }catch(e) {
        res.status(400).send(e.message)
    }
})


router.get("/getuser" , async (req, res) => {
    const regex = new RegExp(req.body.username,'i');
    const regexemail = new RegExp(req.body.email,'i')
  
    const user = await User.find({name:regex, email:regexemail})
    if (user) {
      res.json({
        users: user.length,
        user,
      });
    } else {
      res.status(400);
      throw new Error("Invalid Request");
    }
  });




module.exports = router;