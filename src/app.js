const express = require('express');
const app = express();

const path = require('path');
const morgan = require('morgan');

const multer = require('multer');
const bcrypt = require('bcrypt');

const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy,
FacebookStrategy = require('passport-facebook').Strategy;

// KEYS FIREBASE
const { FIREBASE_API_KEY, FIREBASE_AUTH_DOMAIN, FIREBASE_DATABASE_URL, FIREBASE_PROJECT_ID, FIREBASE_STORAGE_BUCKET, FIREBASE_MESSAGING_SENDER_ID, FIREBASE_APP_ID } = process.env;

// NAME DOMAIN
const { LOCATION_URL_ORIGIN } = process.env;

// Models
const User = require('./models/User.model');

// PASSPORT
const passport = require('passport'),
cookieParser = require('cookie-parser'),
session = require('express-session'),
secretCookie = process.env.SECRET_COOKIE_PARSER,
PassportLocal = require('passport-local').Strategy;

// NAME HOST
// const os = require('os');

// const firebaseCLient = require('firebase');

// console.log('Validado');
// const formidable = require('express-formidable');

// const redis = require('redis');

// let RedisStore = require('connect-redis')(session);
// let redisClient = redis.createClient();

// settings 
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'ejs');

app.use(morgan('dev'));
app.use(express.urlencoded({extended: true}));

// client.on('connect', function() {
//   console.log('Conectado a Redis Server');
// });
// store: new RedisStore({host: 'localhost', port: 6379, client: client}),
// PASSPORT CONFIG
app.use(cookieParser(secretCookie));
const sessionMiddleware = session({
  secret: secretCookie,
  resave: true,
  saveUninitialized: true
})
app.use(sessionMiddleware);

app.use(passport.initialize());
app.use(passport.session());

// PASSPORT USER STABLISHED WITH PASSPORTLOCAL
passport.use(new PassportLocal(async function(username, password, done) {
  let verifyUser = false;
  let idUser = 0;
  let nomUser = "";
  let fotoUser = "";
  let user = await User.findOne({ email: username }).catch((err) => console.log(err));
  let match;
  // console.log('Validado');
  if(user) {
    match = await bcrypt.compare(password, user.password);
  }
  if(match) {
    verifyUser = true;
    nomUser = user.name;
    idUser = user._id;
    fotoUser = user.foto;
  }

  // //console.log(users);
  
  // console.log(users);
  // users.forEach((user) => {
  //   if(user.email == username && user.password == password) {
  //     verifyUser = true;
      // nomUser = user.name;
      // idUser = user._id;
      // fotoUser = user.foto;
      // bcrypt.compare(password, user.password)
  //     .then(match => {

  //     }).catch(err => console.log(err));
  //   }
  // });
  if(verifyUser) {
    return done(null, {id: idUser, user:username, name: nomUser, foto: fotoUser});
  }
  done(null, false);
}));

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: `${LOCATION_URL_ORIGIN}/google/callback`
},
function(accessToken, refreshToken, profile, done) {
    return done(null, {
      id: profile.id,
      user: profile.emails[0].value,
      name: profile.displayName,
      foto: profile.photos[0].value
    });
}
));

passport.use(new FacebookStrategy({
  clientID: process.env.FACEBOOK_APP_ID,
  clientSecret: process.env.FACEBOOK_APP_SECRET,
  callbackURL: `${LOCATION_URL_ORIGIN}/facebook/callback`,
  profileFields: ['id', 'email', 'displayName', 'photos']
},
function(accessToken, refreshToken, profile, done) {
  return done(null, {
    id: profile.id,
    user: profile.emails[0].value,
    name: profile.displayName,
    foto: profile.photos[0].value
  });
}
));

// SERIALIZAR USER
passport.serializeUser(function(user, done) {
  done(null, user);
});

// DESERIALIZAR USER
passport.deserializeUser(function(user, done) {
  done(null, user);
});

// static files
app.use(express.static(path.join(__dirname, 'public')));

/*app.use(express.json());
app.use(express.urlencoded({ extended: false }));*/

// Middlewares
// app.use(multer({
//   dest: path.join(__dirname, "public/upload")
// }).single('imageUser'));


app.use(multer({
  dest: path.join(__dirname, "public/upload")
}).single('archivo'));

// routes
app.use(require('./routes/index').router);   

// starting the server
module.exports = {app, sessionMiddleware};