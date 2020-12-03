const passport = require('passport');
const uuid = require('uuid');
let { sessionsRoom } = require('../variables');

const ctrl = {};

ctrl.index = async (req, res) => {
  // console.log(req.params);

  // console.log(req.sessionID);
  const { sessionId } = req.params;
  const nameUser = req.user.name;
  // console.log(req.session.foto, req.user.foto);
  const fotoUser = req.user.foto;
  const idUser = req.user.id;
  const veriSession = sessionsRoom.filter((v) => v==sessionId);
  if(veriSession.length <= 0) {
    return res.status(404).render('404', {
      isValidate: true,
      redirect: 'login-form',
    });
  }
  req.session.user = req.user;
  const fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
  const codUrl = req.path.replace('/session/', '');
  // console.log(req);
  // console.log(sessionId);
  // res.send(sessionId);
  // let sessionId = uuid.v4();
  // console.log(req.sessionID, sessionId);
  res.render('index', {
    title: 'Chat Private',
    isValidate: true,
    redirect: 'login-form',
    sessionId: sessionId,
    pathUrl: fullUrl,
    codUrl: codUrl,
    nameUser: nameUser,
    fotoUser: fotoUser,
    idUser: idUser
  });
};

ctrl.consultarData = (req, res) => {
  // let sessionId = uuid.v4();
  
  let id = req.user.id;
  let user = req.user.user;
  let name = req.user.name;
  let foto = req.user.foto;
  let data = {
    id,
    user,
    name,
    foto
  }
  res.send(data);
}

ctrl.urlAdapter = (req, res) => {
  console.log(req.query);
  res.send(req.query);
}

ctrl.newSession = (req, res) => {
  console.log(req.user);
  // console.log(req.session.redirectTo);
  // console.log(req);
  res.render('index', {
    title: 'Chat Private',
    isValidate: false,
    redirect: 'newSession'
  });
}

ctrl.login = (req, res) => {
  // let url = "";
  // if(req.query.url) {
  //   url = req.query.url;
  // }
  console.log(req.user);
  res.render('index', {
    title: 'Chat Private',
    isValidate: false,
    redirect: 'login-form'
  });
  // console.log(req.session);
}

ctrl.register = (req, res) => {
  res.render('index', {
    title: 'Chat Private',
    isValidate: false,
    redirect: 'register-form'
  });
}

ctrl.verify = passport.authenticate('local',{
  successRedirect: "/redirectUrl",
  failureRedirect: "/login"
});

ctrl.successFirebase = (req, res) => {
  let data = req.query;
  if(data) {
    req.session.user = data;
    // req.session.id = data.id;
    // req.session.user = data.email;
    // req.session.name = data.name;
    // req.session.foto = data.foto;
    var redirectTo = req.session.redirectTo ? req.session.redirectTo : '/';
    delete req.session.redirectTo;
    // console.log(redirectTo);
    res.send(redirectTo || '/');
  }
}

ctrl.redirectUrl = (req, res) => {
  // console.log('xd');
  var redirectTo = req.session.redirectTo ? req.session.redirectTo : '/';
  delete req.session.redirectTo;
  // is authenticated ?
  console.log(redirectTo);
  res.redirect(redirectTo || '/');
}

ctrl.logout = (req, res) => {
  req.logout();
  // console.log(req.session);
  // console.log('Logout');
  res.redirect('/login');
}

ctrl.verifySession = (req, res) => {
  let { sessionId } = req.params;
  sessionId = sessionId.replace('/verifySession/', '');
  const veriSession = sessionsRoom.filter((v) => v==sessionId);
  if(veriSession.length <= 0) {
    return res.send('Error');
  }
  res.send('Success');
}

module.exports = ctrl;
