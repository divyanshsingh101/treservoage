import { Router } from 'express';
import passport from 'passport';
import { isVerified } from '../middlewares/auth.js';
import User from '../models/user.js';


const router = Router();
// router.get('/login',(req,res)=>{
//    // react form 
// });

// router.get('/signup',(req,res)=>{
//    // react signup form
// });
router.get("/user", (req, res) => {
  if (req.isAuthenticated()) {
      res.json(req.user);
  } else {
      res.status(401).json({ message: "not allowed .." });
  }
});


router.route("/login").post((req, res, next) => {
  console.log("Login attempt:", req.body); // Logs the login attempt
  passport.authenticate('local', (err, user, info) => {
      if (err) return next(err);
      if (!user) {
          console.log("Login failed:", info);
          return res.status(401).json({ message: "Invalid email or password" });
      }
      req.logIn(user, (err) => {
          if (err) return next(err);
          console.log("Login successful:", user);
          return res.status(200).json({ user,message: "Logged in successfully" });
      });
  })(req, res, next);
});


router.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;
  console.log(req.body);
  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    // Create a new user (password hashing is done in the model)
    const newUser = new User({ name, email, password });

    await newUser.save(); // Save user in MongoDB

    res.status(201).json({ message: "User registered successfully. Please login." });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
// // Local login
// router.post(
//   '/login',
//   passport.authenticate('local', {
//     successRedirect: '/',
//     failureRedirect: '/login',
//     failureFlash: true,
//   })
// );

// Google login
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Google callback
router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    res.redirect('http://localhost:5173/'); // Change to your frontend URL
  }
);



// // Logout
// router.get('/logout', (req, res) => {
//   req.logout(() => {
//     res.redirect('/login');
//   });
// });

// // router.get('/user', isVerified, (req, res) => {
// //   if (req.user) {
// //       res.json(req.user);
// //   } else {
// //       res.status(401).json({ message: "Unauthorized" });
// //   }
// // });
// router.get("/check", (req, res) => {
//   if (req.isAuthenticated()) {
//       res.json({ loggedIn: true, user: req.user });
//   } else {
//       res.json({ loggedIn: false });
//   }
// });




export default router;
