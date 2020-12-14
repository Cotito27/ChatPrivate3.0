import helpers from './helpers.js';


// if(!location.href.includes('/login')) {
//   if(sessionStorage.urlPrevious) {
//     if(sessionStorage.urlPrevious.includes('/session/')) {
//       location.href = sessionStorage.urlPrevious;
//     }   
//   }
// }

const inputs = document.querySelectorAll(".input");


function addcl(){
	let parent = this.parentNode.parentNode;
	parent.classList.add("focus");
}

function remcl(){
	let parent = this.parentNode.parentNode;
	if(this.value == ""){
		parent.classList.remove("focus");
	}
}

const fotoDefault = '/img/avatar-login3.png';

// const urlPrevious = document.querySelector('#urlPrevious');
// if(urlPrevious) {
//   sessionStorage.urlPrevious = urlPrevious.value;
// }
inputs.forEach(input => {
	input.addEventListener("focus", addcl);
	input.addEventListener("blur", remcl);
});

$(document).ready(function() {
  const socket = io();
  const nombres = document.getElementById('nombres');
  const apellidos = document.getElementById('apellidos');
  const telefono = document.getElementById('telefono');
  const usuario = document.getElementById('usuario');
  const pass = document.getElementById('password');
  const btnCrearSala = document.querySelector('.btnCrearSala');
  const btnUnirse = document.querySelector('.btnUnirse');
  const codUrl = document.querySelector('#codUrl');
  
  const registrarse = document.getElementById('registrarse');
  const formRegister = document.getElementById('form-register');
  const btnEntrarSala = document.querySelector('.btnEntrarSala');
  if(btnEntrarSala) {
    btnEntrarSala.addEventListener('click', () => {
      setTimeout(() => {
        codUrl.focus();
      }, 500);
    });
  }
  $('.loader-page-dark').removeClass('d-flex').hide();
  let auth;
  let fs;
  // let keysFirabase;
  // async function getKeysFirebase() {
  //   keysFirabase = await helpers.firebaseConfig();
  //   console.log(keysFirabase);
  // }
  // getKeysFirebase();
  const googleButton = document.querySelector(".btn-google");

  // if(googleButton) {
  //   googleButton.addEventListener("click", (e) => {
  //     location.href = '/google';
  //   });
  // }
  function addUser(socket, name, phone, email, password) {
    socket.emit('createUser', {
      name,
      phone,
      email,
      password,
      foto: fotoDefault
    })
  }
  
  function findResponse(socket) {
    socket.on('userSuccess', (msg) => {
      (async() => {
        //swal("Success!", "Se han guardado los cambios ", "success");
        swal("Success!", msg, "success");
        formRegister.reset();        
        location.href = '/login';
      })();
    });
    socket.on('userError', (msg) => {
      (async() => {
        //swal("Success!", "Se han guardado los cambios ", "success");
        swal("Error!", msg, "error");
        // formRegister.reset();        
        // location.href = '/login';
      })();
    });
  }
  findResponse(socket);
  
  if(btnCrearSala) {
    btnCrearSala.addEventListener('click', async (e) => {
      let newUrl = helpers.generateUUID();
      socket.emit('addSession', newUrl);
    });
  }
  socket.on('newSession', detectNewSession);
  function detectNewSession(newUrl) {
    location.href = location.origin + `/session/${newUrl}`;
  }
  function isUrl(s) {   
    var regexp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/
    return regexp.test(s);
  }
  if(btnUnirse) {
    btnUnirse.addEventListener('click', async () => {
      let urlEncode = codUrl.value;
      console.log(urlEncode.substr(urlEncode.length-4, urlEncode.length-1));
      if(isUrl(urlEncode) || urlEncode.substr(urlEncode.length-4, urlEncode.length-1) == '.com') {
        if(!urlEncode.includes(`/`)) 
        {
          (async() => {
            swal("Error!", "Url no válida", "error");
          })();
          return;
        }
        const urlData = urlEncode.replace('/session/','/verifySession/');
        const responseData = await fetch(urlData, {
          method: 'GET',
        });
        const responseText = await responseData.text();
        if(responseText == 'Success') {
          location.href = urlData.replace('/verifySession/', '/session/');
        } else {
          (async() => {
            swal("Error!", "La sala ingresada no existe", "error");
          })();
        }
      } else {
        const urlData = `/verifySession/${urlEncode}`;
        const responseData = await fetch(urlData, {
          method: 'GET',
        });
        const responseText = await responseData.text();
        if(responseText == 'Success') {
          location.href = urlData.replace('/verifySession/', '/session/');
        } else {
          (async() => {
            swal("Error!", "La sala ingresada no existe", "error");
          })();
        }
      }
    });
  }

  if(!formRegister) return;
  formRegister.addEventListener('submit', (e) => {
    e.preventDefault();
    let name = nombres.value + ' ' +apellidos.value;
    let phone = telefono.value;
    let email = usuario.value;
    let password = pass.value;
    addUser(socket, name.toUpperCase(), phone, email, password);
  });
});