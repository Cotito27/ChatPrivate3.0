const User = require('./models/User.model');
const fs = require('fs-extra');
const path = require('path');
const ss = require('socket.io-stream');
let audioStorage = [];
const { FIREBASE_API_KEY, FIREBASE_AUTH_DOMAIN, FIREBASE_DATABASE_URL, FIREBASE_PROJECT_ID, FIREBASE_STORAGE_BUCKET, FIREBASE_MESSAGING_SENDER_ID, FIREBASE_APP_ID } = process.env;
let { sessionsRoom, filesPayload } = require('./variables');

let arrayBufferFile;

let codMsg = 0;

let users = {};
let sessions = {};
let objGlobal = [];

module.exports = [
  (io) => {
    io.on("connection", async (socket) => {
      // socket.emit('getIdSocket', socket.id);
      // socket.emit('getKeysFirebase', {
      //   FIREBASE_API_KEY,
      //   FIREBASE_AUTH_DOMAIN,
      //   FIREBASE_DATABASE_URL,
      //   FIREBASE_PROJECT_ID, 
      //   FIREBASE_STORAGE_BUCKET, 
      //   FIREBASE_MESSAGING_SENDER_ID, 
      //   FIREBASE_APP_ID
      // });
      socket.emit('codMsg', codMsg);

      console.log('Conectado '+ socket.id);
      socket.on('userConnect', (data) => {
        // let objUsersExist = Object.keys(users);
        // console.log(objUsersExist);
        // objUsersExist.forEach((obj) => {
        //   if(socket.id != obj.id && obj.user == data.user) {
        //     data.user = data.user + ''
        //   }
        // });
        // console.log(socket.request.session);
        // console.log(socket.request.session.user);
        socket.user = data.user;
        socket.name = data.name;
        socket.sessionId = data.sessionId;
        // socket.join(data.user)
        socket.join(data.user);
        socket.join(data.sessionId);
        // socket.leave();
        // socket.join( data.socketId );
        // console.log(io.sockets);
        
        users[socket.user] = {id: socket.id, user: data.user, name: data.name, sessionId: data.sessionId, foto: data.foto};
        
        // console.log(users);
        updateUsers();
        socket.to(socket.sessionId).emit('notifyConnect', users[socket.user]);
        socket.emit('stopLoader');
      });
      socket.on('sendMessage', async (data) => {
        codMsg++;
        
        if(data.destino == 'Todos') {
          io.sockets.to(data.sessionId).emit('getMessage', {
            user: socket.user,
            name: socket.name,
            message: data.message,
            destino: data.destino,
            foto: data.foto,
            id: codMsg
          });
        } else {
          console.log('Mensaje Privado');
          // SEND USER PRIVATE
          //.of()
          let sessionOther = users[data.destino].sessionId;
          // let otherUser = users[data.destino].id;
          // console.log(io.sockets.to(otherUser));
          if(sessionOther == socket.sessionId) {
            io.sockets.to(data.destino).to(data.user).emit('getMessage', {
              user: socket.user,
              name: socket.name,
              message: data.message,
              destino: data.destino,
              foto: data.foto,
              id: codMsg
            });
          }
          
          // SEND ME 
          // socket.emit('getMessage', {
          //   user: socket.user,
          //   name: socket.name,
          //   message: data.message,
          //   destino: data.destino
          // });
        }
        // if(data.message.includes('[audio:') && data.message.includes(']')) {
        //   let audioRex = data.message.replace('[audio:', '').replace(']', '');
        //   audioStorage.push({
        //     session: data.sessionId,
        //     audio: audioRex
        //   });
        //   // await fs.unlink(path.resolve(`src/public/${audioRex}`));
        // }
      });
      socket.on('changeStatusFile', (data) => {
        socket.request.session.fileStored = data;
      })
      socket.on('deleteFile', (data) => {
        console.log(data);
      });
      socket.on('disconnect', function() {
        if(socket.request.session.fileStored) {
          if(socket.request.session.fileStored.exist) {
            fs.unlink(path.resolve(`src/public/${socket.request.session.fileStored.url}`));
          }
        }
        
        if(!socket.user) return;
        // if(!socket.sessionId) return;
        // socket.request.session.destroy();
        socket.to(socket.sessionId).emit('disconnectUser', users[socket.user]);
        // console.log(socket.adapter.rooms);
        delete users[socket.user];
        let contSessions = 0;
        let otherSession = socket.sessionId;
        setTimeout(function() {
          contSessions = 0;
          for(key in users) {
            if(users[key].sessionId == otherSession) {
              contSessions++;
            }
          }
          
          if(contSessions <= 0) {
            // remover sessionId
            if(sessionsRoom.indexOf(otherSession) != -1) {
              sessionsRoom.splice(sessionsRoom.indexOf(otherSession), 1);
            }
            
            // audioStorage.forEach(async (au, index, arr) => {
            //   if(au.session == otherSession) {
            //     await fs.unlink(path.resolve(`src/public/${au.audio}`)).then().catch((err) => console.log(err));
            //     if(arr.indexOf(au) != -1) {
            //       arr.splice(arr.indexOf(au), 1);
            //     }
            //   }
            // });
            // console.log(audioStorage);
          }
          console.log(sessionsRoom);
        },7000);
        
        // console.log(rooms, socket.sessionId);
        // socket.leave(socket.user);
        // socket.leave(socket.sessionId);
        
        // delete socket.request.session.redirectTo;
        updateUsers();
      });
      socket.on('createUser', async (data) => {
        data.public_id = null;
        let oldUser = await User.findOne({ email: data.email });
        // console.log(oldUser);
        if(oldUser) {
          socket.emit('userError', 'El usuario ingresado ya existe');
          return;
        }
        let newUser = new User(data);
        await newUser.save();
        socket.emit('userSuccess', 'Fue registrado exitosamente');
      });

      socket.on('verifySession', (url) => {
        let veriRepeat = sessionsRoom.find((v) => v == url);
        if(!veriRepeat) {
          sessionsRoom.push(url);
        }        
        socket.emit('getSession', url);
      });

      socket.on('addSession', (url) => {
        let veriRepeat = sessionsRoom.find((v) => v == url);
        if(veriRepeat) return;
        sessionsRoom.push(url);
        socket.emit('newSession', url);
      });

      socket.on('cambiarFoto', (data) => {
        users[data.username].foto = data.foto;
        io.sockets.emit('cambiarFoto', data);
      });

      socket.on("focusAll", function() {
        socket.emit("focusAll");
      });

      socket.on('buscarUser', (user) => {
        updateUsers(user);
      });

      socket.on('sendViewed', (data) => {
        if(socket.sessionId == data.sessionId) {
          socket.to(data.user).emit('getViewed', data);
        }
      });

      socket.on("cambiarApodo", function(data) {
        // console.log(data.destino);
        if(data.destino == 'Todos') {
          io.sockets.to(socket.sessionId).emit("cambiarApodo", data);
          return;
        }
        // console.log(data.identOtherUser, data.identUser);
        if(socket.sessionId == data.sessionId) {
          io.sockets.to(data.identOtherUser).to(data.identUser).emit("cambiarApodo", data);
        }
      });

      socket.on('readFile', async function(data) {
      });

      socket.on('sendFileMsg', async function(data) {
        // console.log(data.sessionId, socket.sessionId, data.destino, data.user);
        // console.log(socket.request.session);
        // console.log(filesPayload, socket.request.session.user.user)
        // let fileUser = filesPayload[socket.request.session.user.user];
        // console.log(fileUser);
        // if(!fileUser) return;
      
        // data.file = fileUser;
        if(data.sessionId == socket.sessionId) {
          // let ss = await fs.readFile(data.file);
          // console.log(ss);
          if(data.destino == "Todos") {
            await io.sockets.to(data.sessionId).emit('getMessage', data);
          } else {
            await socket.to(data.destino).to(data.user).emit('getMessage', data);
          }
          
        }
        // delete filesPayload[socket.request.session.user.user];
        // console.log(filesPayload, 'NumFiles');
      });

      function updateUsers(data) {
        
        // let key = Object.keys(users);
        let numData = 0;
        let objE = [];
        for(key in users) {
          if(users[key].sessionId == socket.sessionId) {
            objE.push({
              user: users[key].user,
              name: users[key].name,
              foto: users[key].foto
            });
          }
        }
        objE = objE.sort(function (a, b){
          if ( a.name < b.name )
            return -1;
            if ( a.name > b.name )
              return 1;
            return 0;
        });
        // console.log(objName, objE);
        // objGlobal = objE;
        //console.log(users);
        // console.log(objUsers, objE, users);
        if(data) {
          // let key = Object.keys(users);
          let objE2 = [];
          for(key in users) {
              if(users[key].sessionId == socket.sessionId) {
                if(users[key].name.toUpperCase().includes(data.toUpperCase())) {
                  objE2.push({
                    user: users[key].user,
                    name: users[key].name,
                    foto: users[key].foto
                  });
                  // console.log(users[key].name.toUpperCase(), data.toUpperCase());
                  // console.log(objE2);
                } 
                
              }
            }
            
            //console.log(users);
            // console.log(objUsers, objE, users); 
            socket.emit('listUser', objE2, objE.length);
            return;
        }
        socket.to(socket.sessionId).emit('listUser', objE, objE.length);
        // console.log(data);
        
        socket.emit('listUser', objE, objE.length);
        // console.log('Updated');
        // console.log(objE);
      }
    });
  },
];
