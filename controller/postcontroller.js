const express = require('express');
const User = require('../model/user');
const Post = require('../model/Post');
const connectdb = require('../util/database');
require('dotenv').config();
connectdb()


//Create the post for a user 

exports.postPOST=async(req,res)=>{
  const {text}=req.body
  const user_id=req.params.user_id; 
  try{
    const user =await User.findById(user_id);
    if (!user){
     res.status(404).json({message:"user not found"});
    }
     const newPost=new Post({
        name:user_id,
        text
     })
    await newPost.save();
     user.post.push(newPost._id);
     await user.save();
     res.status(200).json(newPost);
     
  }
 catch(err){
            console.error(err);
            res.status(500).json({message:"Internal Server Error"});
           }
        }

//get the all the post of users which is following by the user

    exports.getAllPost=async(req,res)=>{
       const userId=req.params.user_id;
       try{
        const user=await User.findById(userId);

        if(!user){
         res.status(404).json({message:"user is not found"});
        }
        const postsfromUser= await Post.find({ name: { $in: user.followers } })
       .sort({ createdAt: -1 })
       .populate('name', 'name');
        
       if(!postsfromUser){
         res.status(404).json({message:"NO post is available"});
       }
       res.status(200).json(postsfromUser.text);
       }
       catch(err){
        console.error(err);
        res.status(500).json({message:"Internal Server Error"});
       }
    }