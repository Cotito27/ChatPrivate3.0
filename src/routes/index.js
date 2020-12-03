const express = require("express");
const router = express.Router();
const passport = require("passport");
let { sessionsRoom } = require('../variables');
// let { usersSession } = require('../variables');

function validarUser(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  const sessionId =req.path.replace('/session/', '');
  const veriSession = sessionsRoom.filter((v) => v==sessionId);
  if(veriSession.length > 0) {
    req.session.redirectTo = req.path;
  }

  // console.log(req);
  // let parseQuery = req.url;
  // if(parseQuery)
  // res.redirect(`/login?url=${req.path}`);
  res.redirect("/login");
}

function redirectHome(req, res, next) {
  if (req.isAuthenticated()) return res.redirect("/");
  next();
}

// Controllers
const home = require("../controllers/home.controller");
const image = require("../controllers/image.controller");
const audio = require("../controllers/audio.controller");

// router.get('/', validarUser, home.index);
router.get("/login", redirectHome, home.login);
router.get("/register", home.register);
router.post("/verificarLogin", home.verify);
router.get("/consultarData", validarUser, home.consultarData);
router.get("/", validarUser, home.newSession);
// router.get('/session', home.urlAdapter);
router.get("/redirectUrl", home.redirectUrl);
router.get("/session/:sessionId", validarUser, home.index);
router.get("/logout", home.logout);
router.post("/images", image.create);
router.post("/audio", audio.create);
router.post("/successFirebase", home.successFirebase);
router.get('/verifySession/:sessionId', validarUser, home.verifySession);

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  function (req, res) {
    res.redirect("/redirectUrl");
  }
);

router.get(
  "/facebook",
  passport.authenticate("facebook", { scope: ["email"] })
);

router.get(
  "/facebook/callback",
  passport.authenticate("facebook", {
    successRedirect: "/redirectUrl",
    failureRedirect: "/login",
  })
);

module.exports = { router };
