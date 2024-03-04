const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
const fetchuser = require('../middleware/fetchuser.js');
const secretjwt = 'pratikjimmy@';


router.post('/getuser',[
    body('name').isLength({min: 3}),
    body('email','enter a valid name').isEmail(),
    body('password').isLength({min: 5})

], async (req,res)=>{
    let success = false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success, errors: errors.array() });
    }
    try{
    let user = await User.findOne({email: req.body.email})
    if(user){
        return res.status(400).json({ success,error: "internaly some error"});
    }

    const salt = await bcrypt.genSalt(10);
    const secpass = await bcrypt.hash(req.body.password, salt);
    user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: secpass
    })

    const data = {
        id: user.id
    }
    const authToken = jwt.sign(data, secretjwt);
    success = true;
    res.json({ success,authToken})

} catch (error) {
    console.error('Error:', error.message);
    res.status(500).send('Internal server occurred');
}


 
});

router.post('/login', [
    body('email', 'enter a valid name').isEmail(),
    body('password', 'password can not be blank').exists()
], async (req, res) => {
    let success = false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    try {
        let user = await User.findOne({ email });
        if (!user) {
            success = false;
            return res.status(400).json({ success, error: "internaly some error" });
        }
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            success = false;
            return res.status(400).json({success, error: "please try again with right credential" });
        }

        const data = {
            id: user.id
        }
        const authToken = jwt.sign(data, secretjwt);
        success = true;
        res.json({success, authToken });

    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).send('Internal server error');
    }
    
});

    
router.post('/getuser', fetchuser, async (req, res) => {
    try {
      var userId = req.user.id;
      console.log(userId);
      let user = await User.findById(userId).select('-password');
      res.send(user);
    } catch (error) {
      res.status(500).send('Internal server error');
    }
  });
  
  module.exports = router;  
// .then(user => res.json(user))
// .catch(err=> {console.log(err),res.json({error: 'please enater a valid email', message: err.message})});
// const user = User(req.body);
// user.save();
