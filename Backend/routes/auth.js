const express = require('express');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const fetchuser = require('../middleware/fetchuser');
const router = express.Router();
const JWT_SECRET = 'your_secret_here';

// create user
router.post('/createuser', [
  body('name').isLength({min:3}),
  body('email').isEmail(),
  body('password', "Password must be at least 5 characters long").isLength({min:5})
], async (req,res)=>{
  const errors = validationResult(req);
  if(!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  let user = await User.findOne({email:req.body.email});
  if(user) return res.status(400).json({ success:false, error:'Email exists' });

  const salt = await bcrypt.genSalt(10);
  const secPass = await bcrypt.hash(req.body.password, salt);
  user = await User.create({ name:req.body.name, email:req.body.email, password:secPass });

  const data = { user: { id: user.id } };
  const authToken = jwt.sign(data, JWT_SECRET);
  res.json({ success:true, authToken });
});

// login
router.post('/login', [
  body('email', "Please enter a valid email address").isEmail(),
  body('password', "Password cannot be blank").exists()
], async (req,res)=>{
  const errors = validationResult(req);
  if(!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if(!user) return res.status(400).json({ success:false, error:'Invalid creds' });

  const match = await bcrypt.compare(password, user.password);
  if(!match) return res.status(400).json({ success:false, error:'Invalid creds' });

  const data = { user: { id: user.id } };
  const authToken = jwt.sign(data, JWT_SECRET);
  res.json({ success:true, authToken });
});

// get user
router.post('/getuser', fetchuser, async (req,res)=>{
  const user = await User.findById(req.user.id).select("-password");
  res.send(user);
});

module.exports = router;
