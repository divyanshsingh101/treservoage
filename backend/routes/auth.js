import { Router } from 'express';
import passport from 'passport';

const router = Router();
router.get('/login',(req,res)=>{
   // react form 
});

router.get('/signup',(req,res)=>{
   // react signup form
});

router.post('/signup',(req,res)=>{
   res.redirect('/login');
});
// Local login
router.post(
  '/login',
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true,
  })
);

// Google login
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Google callback
router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    res.redirect('/dashboard');
  }
);

// Logout
router.get('/logout', (req, res) => {
  req.logout(() => {
    res.redirect('/login');
  });
});

export default router;
