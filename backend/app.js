import express from 'express';
import session from 'express-session';
import dbConnect from './database/connect.js';
import User from './models/user.js';
import passport from 'passport';
import flash from 'connect-flash';
import initializePassport from './middlewares/passport-config.js';
import MongoStore from 'connect-mongo';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js'; 
import leaderboardRoutes from './routes/leaderboard.js'
import participantRoutes from './routes/participant.js'
import cors from "cors";
dotenv.config();


let app = express();
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173", // Allow requests from this frontend
    credentials: true, // Allow cookies and authentication headers
  })
);
dbConnect();
// authentication system
initializePassport(passport,process.env.GOOGLE_CLIENT_ID,process.env.GOOGLE_CLIENT_SECRET);


app.use(express.urlencoded({ extended: true }));
app.use(
    session({
      secret: 'your_secret',
      resave: false,
      saveUninitialized: true,
      store: MongoStore.create({ mongoUrl:process.env.DATABASE}),
      cookie: { maxAge: 1000 * 60 * 60 * 24 }, // 1 day
    })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// Global variables for flash messages
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});


app.listen('3000',()=>{
    console.log("app listening ");

})
// Routes
app.use('/auth', authRoutes);
app.use('/leaderboard',leaderboardRoutes);
app.use('/participant',participantRoutes);

app.get('/',async(req,res)=>{
    res.send("hello there ...");
    // let newUser=new User({
    //     firstName:"divyansh",
    //     lastName:"singh",
    //     email:"divyanshsingh@gmail.com",
    //     password:"DFGFH"
    // });
    
    // await newUser.save();
    // console.log(req);
})

app.post('/',async(req,res)=>{
    res.send("hello there ...");
    // let newUser=new User({
    //     firstName:"divyansh",
    //     lastName:"singh",
    //     email:"divyanshsingh@gmail.com",
    //     password:"DFGFH"
    // });
    
    // await newUser.save();
    // console.log(req);
})


export default app ;
