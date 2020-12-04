
import helpers from './helpers.js';

$(document).ready(function() {
  const socket = io();
  const navMessages = document.querySelector('.btnmessage');
  const navUsers = document.querySelector('.btnusers');
  const navConfig = document.querySelector('.btnconfig');
  const navAll = document.querySelectorAll('.btnsmenu');
  const containerUsers = document.querySelector('.users-history');
  const numberUsers = document.querySelector('.numberUsers');
  const panelUsers = document.querySelector('#content-users');
  const panelMessages = document.querySelector('#content-message');
  const panelConfig = document.querySelector('#content-config');
  const panelHistory = document.querySelector('#content-history');
  const panelAll = document.querySelectorAll('.all-panel');
  const componentsMessage = document.querySelector('.components-message');
  const componentsHistory = document.querySelector('.card-history');
  // const inputPathUrl = document.querySelector('.inputPathUrl');
  const btnCopiarPathUrl = document.querySelector('.btnCopiarPathUrl');
  // const inputCodUrl = document.querySelector('.inputCodUrl');
  const btnCopiarCodUrl = document.querySelector('.btnCopiarCodUrl');
  const btnSalirSala = document.querySelector('.btnSalirSala');
  const btnSalirCuenta = document.querySelector('.btnSalirCuenta');
  
  // console.log(RoomId);
  // Initialize Firebase
 
  const fotoDefault = '/img/avatar-login3.png';
  const fotoToastDefault = '/img/avatar-login4.png';
  sessionStorage.userconnect="connect";
  sessionStorage.userdisconnect="disconnect";
  if(!sessionStorage.sonido) {
    sessionStorage.sonido = "sound";
  }
  if(sessionStorage.sonido=="nosound"){
    $('#defaultCheck1').prop('checked', false);
  }else{
    $('#defaultCheck1').prop('checked', true);
  }
  function userConnect(socket, user, name) {
    socket.emit('userConnect', {
      user: user,
      name: name,
      sessionId: sessionId,
      foto: sessionStorage.foto
    });
  }
  window.onbeforeunload = function() {
    return "Bye now!";
  };
  socket.on('disconnectUser', detectarLogout);
  function detectarLogout(user) {
    let userlast = user.name;
    // console.log(userlast);
    let fotoLastUser = user.foto;
    if(sessionStorage.user != user.user) {
      if(sessionStorage.userdisconnect=="disconnect"){
        if($('.toast')[0]){
          if(!$('.toast').html().includes(`<strong>${replaceuser2}</strong> ha abandonado el chat.`)){
          Command: toastr["info"](`&nbsp;<strong>${userlast.toUpperCase()}</strong> ha abandonado el chat.`);
          replaceuser2=userlast.toUpperCase();
          $('.toast-info:last').css('background-image', `url("${fotoLastUser || fotoToastDefault}")`);
        }
        }else{
          Command: toastr["info"](`&nbsp;<strong>${userlast.toUpperCase()}</strong> ha abandonado el chat.`);
          replaceuser2=userlast.toUpperCase(); 
          $('.toast-info:last').css('background-image', `url("${fotoLastUser || fotoToastDefault}")`);
        }
      }
    }
  }
  // let dataConnect = Promise.resolve(getUserData());
  // dataConnect.then((val) => {
    
  //   // $('.nameUserConfig').text(nameUser);
  // });
  // let nameUser =  nameUser;
  // let fotoUser = fotoUser;
  //   // console.log(sessionId);
  // let userUser = idUser.replace(/[_\W]+/g,'_') + sessionId;     
  sessionStorage.name = nameUser;
  sessionStorage.user = idUser + sessionId;
  sessionStorage.sessionId = sessionId;
  sessionStorage.foto = fotoUser.replace(/amp;/g, '') || fotoDefault;
  
  // console.log(sessionStorage.foto);
    
  userConnect(socket, sessionStorage.user, sessionStorage.name);
  function actualizarEstado() {
    //console.log('...');
    if(!$(`#user${sessionStorage.user}`)[0]) {
      if(sessionStorage.user) {
        userConnect(socket, sessionStorage.user, sessionStorage.name);
        console.log('Actualizado');
      }
    }
  }
  function isMobile(){
    return (
        (navigator.userAgent.match(/Android/i)) ||
        (navigator.userAgent.match(/webOS/i)) ||
        (navigator.userAgent.match(/iPhone/i)) ||
        (navigator.userAgent.match(/iPod/i)) ||
        (navigator.userAgent.match(/iPad/i)) ||
        (navigator.userAgent.match(/BlackBerry/i))
    );
  }
  $('#content-message').on('click', '.btnStickers', (e) => {
    let $emojiwrapper = $('.emojiWrapper');
    // console.log($emojiwrapper[0]);
    console.log($emojiwrapper.prop('class'));
    if(!$emojiwrapper.hasClass('d-flex')) {
      $emojiwrapper.addClass('d-flex');
    } else {
      $emojiwrapper.removeClass('d-flex');
    }
    
  });
  
  function addEmojiVisibleLight() {
    var emojis1=document.querySelector('.emoji_01');
    var input=document.getElementById("textMessage");
    
    
    document.addEventListener('click', function(e) { 
      
      var picker=new EmojiButton({
        style: 'twemoji',
        position: 'top-end',
        theme: 'light',
        autoHide : false,
        emojiVersion : 5.0, //1.0,2.0,3.0,4.0,5.0,11.0,12.0,12.1
        emojiSize : "26px"
    });
      if(e.target.classList.contains('btnEmojis')) {
        let input = e.target.parentElement.parentElement.querySelector('.textMessage')
        picker.on('emoji',function(emoji){
          var valor=emoji.split('" src')[1];
          input.value+=emoji.replace('<img class="emoji" draggable="false" alt="','').replace(valor,'').replace('" src','');
        });
        picker.pickerVisible?picker.hidePicker():picker.showPicker(e.target);
      }
      if(e.target.classList.contains('fa-smile-o')) {
        let input = e.target.parentElement.parentElement.parentElement.querySelector('.textMessage')
        picker.on('emoji',function(emoji){
          var valor=emoji.split('" src')[1];
          input.value+=emoji.replace('<img class="emoji" draggable="false" alt="','').replace(valor,'').replace('" src','');
        });
        picker.pickerVisible?picker.hidePicker():picker.showPicker(e.target);
      }
    });
  }
  function addEmojiVisibleDark() {
    var emojis1=document.querySelector('.btnEmojis');
    var input=document.getElementById("textMessage");
    
    
    
    document.addEventListener('click', function(e) {
      var picker=new EmojiButton({
        style: 'twemoji',
        position: 'top-end',
        theme: 'dark',
        autoHide : false,
        emojiVersion : 5.0, //1.0,2.0,3.0,4.0,5.0,11.0,12.0,12.1
        emojiSize : "26px"
    });
      if(e.target.classList.contains('btnEmojis')) {
        let input = e.target.parentElement.parentElement.querySelector('.textMessage')
        picker.on('emoji',function(emoji){
          var valor=emoji.split('" src')[1];
          input.value+=emoji.replace('<img class="emoji" draggable="false" alt="','').replace(valor,'').replace('" src','');
        });
        picker.pickerVisible?picker.hidePicker():picker.showPicker(e.target);
      }
      if(e.target.classList.contains('fa-smile-o')) {
        let input = e.target.parentElement.parentElement.parentElement.querySelector('.textMessage')
        picker.on('emoji',function(emoji){
          var valor=emoji.split('" src')[1];
          input.value+=emoji.replace('<img class="emoji" draggable="false" alt="','').replace(valor,'').replace('" src','');
        });
        picker.pickerVisible?picker.hidePicker():picker.showPicker(e.target);
      }
    });
  }
  if(!isMobile()) {
    addEmojiVisibleLight();
  } else {
    $('.btnEmojis').hide();
  }

  let replaceuser = "";
  let replaceuser2 = "";

  function verifyUserConnet(socket) {
    socket.on('listUser', (data, numData) => {
      let verifyPop = "";
      $(`.popover1`).popover('hide');
      $(`.popover1`).popover('update');
      // if($('.popover1').prop('aria-describedby')) {
      //   verifyPop = $('.popover1').prop('id');
      // }
    if($("#buscadorUser").val() != '') 
    {
      
      let previousContent = containerUsers.querySelector('.titulousers');
      let previousHr = containerUsers.querySelector('hr');
      containerUsers.innerHTML = '';
      containerUsers.appendChild(previousContent);
      containerUsers.appendChild(previousHr);
      $('.titulousers').text(`Usuarios Conectados (${numData})`);
      numberUsers.textContent = numData;
      data.forEach((dat) => {
        if(dat.name.toUpperCase().includes($('#buscadorUser').val().toUpperCase())) {
        if(dat.user == sessionStorage.user) {
          containerUsers.innerHTML += `
          <div class="contenidousers">
            <div class="subcontenidousers">
              <div class="cotenidoimguser">
                <img
                  class="imguser_mini"
                  id="imageuser${dat.user}"
                  src="${dat.foto}"
                />
              </div>
              <div class="nomuser">
                <strong id="user${dat.user}">${dat.name}</strong>
              </div>
            </div>
          </div>
        `;
        } else {
          containerUsers.innerHTML += `
          <div class="contenidousers">
            <div class="subcontenidousers">
              <div class="cotenidoimguser">
                <img
                  class="imguser_mini"
                  id="imageuser${dat.user}"
                  src="${dat.foto}"
                />
              </div>
              <div class="nomuser">
                <strong id="user${dat.user}">${dat.name}</strong>
              </div>
            </div>
            <button
                  type="button"
                  id="popover${dat.user}"
                  class="popover1"
                  data-container="body"
                  data-toggle="popover"
                  data-placement="left"
                  data-trigger="focus"
                  data-content="Enviar mensaje"
                >
                  <i class="far fa-comment-dots" aria-hidden="true"></i>
                </button>
          </div>
        `;
        }
        }
      });
    } else {
   // if(buscarUsuario) {
      //   return;
      // }
      containerUsers.innerHTML = '';
      containerUsers.innerHTML += `
        <h3 class="titulousers">Usuarios Conectados (${data.length})</h3>
        <hr style="color: black; background: black; font-weight: bold;" />
      `;
      data.forEach((dat) => {
        if(dat.user == sessionStorage.user) {
          containerUsers.innerHTML += `
          <div class="contenidousers">
            <div class="subcontenidousers">
              <div class="cotenidoimguser">
                <img
                  class="imguser_mini"
                  id="imageuser${dat.user}"
                  src="${dat.foto}"
                />
              </div>
              <div class="nomuser">
                <strong id="user${dat.user}">${dat.name}</strong>
              </div>
            </div>
          </div>
        `;
        } else {
          containerUsers.innerHTML += `
          <div class="contenidousers">
            <div class="subcontenidousers">
              <div class="cotenidoimguser">
                <img
                  class="imguser_mini"
                  id="imageuser${dat.user}"
                  src="${dat.foto}"
                />
              </div>
              <div class="nomuser">
                <strong id="user${dat.user}">${dat.name}</strong>
              </div>
            </div>
            <button
                  type="button"
                  id="popover${dat.user}"
                  class="popover1"
                  data-container="body"
                  data-toggle="popover"
                  data-placement="left"
                  data-trigger="focus"
                  data-content="Enviar mensaje"
                >
                  <i class="far fa-comment-dots" aria-hidden="true"></i>
                </button>
          </div>
        `;
        }
        
      });
      numberUsers.textContent = data.length;
    }
    
    editNickName(data, false);
    dataUserGlobal = data;
    // console.log(popoverGlobalId);
    if(popoverGlobalId != "" ) {
      console.log('Popover agregado');
      
      $(`#${popoverGlobalId}`).popover('show');
      $(`#${popoverGlobalId}`).popover('update');
    }
  
    // sessionStorage.foto = $(`#imageuser${sessionStorage.user}`).prop('src');
    //  console.log($(`#imageuser${sessionStorage.user}`).prop('src'));
    });
   
  } 
  $(window).blur(function() {
    if(popoverGlobalId!="" && !$(`.popover-body`)[0]) {
      $(`.popover1`).popover('hide');
      $(`.popover1`).popover('update');
      $(`#${popoverGlobalId}`).popover('show');
      $(`#${popoverGlobalId}`).popover('update');
    }
  });
  let dataUserGlobal = [];
  socket.on('notifyConnect', (data) => {
    // console.log(data);
    let verificar;
    let fotoLastUser;
    let userlast = "";
    // if(data != [] && data) {
    //     verificar = data[data.length-1].user;
    //     fotoLastUser = data[data.length-1].foto;
    //     userlast = data[data.length-1].name;
    // } else {
    //     verificar = data[0].user;
    //     fotoLastUser = data[0].foto;
    //     userlast = data[0].name;
    // }
    verificar = data.user;
    fotoLastUser = data.foto;
    userlast = data.name;
    
    // console.log(data);
    // userlast = data.map((dat) => {
    //   if(dat.user == verificar) {
    //     return dat.name;
    //   }
    // });
    // userlast = userlast[0];
    // console.log(verificar, userlast, sessionStorage.user);
    if(verificar!=sessionStorage.user){ 
      if(sessionStorage.userconnect=="connect"){
        if($('.toast')[0]){
        if(!$('.toast').html().includes(`<strong>${replaceuser}</strong> se ha unido al chat.`)){
          Command: toastr["info"](`&nbsp;<strong>${userlast.toUpperCase()}</strong> se ha unido al chat.`); 
          replaceuser=userlast.toUpperCase();
          $('.toast-info:last').css('background-image', `url("${fotoLastUser || fotoToastDefault}")`);
        }
        }else{
          Command: toastr["info"](`&nbsp;<strong>${userlast.toUpperCase()}</strong> se ha unido al chat.`);
          replaceuser=userlast.toUpperCase();
          $('.toast-info:last').css('background-image', `url("${fotoLastUser || fotoToastDefault}")`);
          }
        }
      }
  });
  socket.on('stopLoader', () => {
    $('.loader-page').removeClass('d-flex');
  });

  function addSound() {
    let audio = document.querySelector('.soundChat');
    if(audio) {
      audio.play();
    } 
  }

  verifyUserConnet(socket);
  function addEventNavBar () {
    //console.time('navLoader()');
    if(!$(this).prop('class').includes('btnconfig')) {
      if(!$('#imgUserConfig').prop('src').includes(sessionStorage.foto)) {
        $('#imgUserConfig').prop('src', sessionStorage.foto);
        $('#file-foto').val(null);
      }
    }
    navAll.forEach((nav) => {
      if(nav.classList == this.classList) {
        nav.classList.add('selectedOption');
      } else {
        nav.classList.remove('selectedOption');
      }
      
    });
    if(this.classList.contains('btnusers')) {
      panelAll.forEach((panel) => {
        panel.classList.add('d-none');
      });
      panelUsers.classList.remove('d-none');
    } else if(this.classList.contains('btnmessage')) {
      let historyVisible = false;
      if(!panelHistory.classList.contains('selectedItem')) {
        historyVisible = true;
      }
      panelAll.forEach((panel) => {
        panel.classList.add('d-none');
      });
      if(historyVisible) {
        panelMessages.classList.remove('d-none');
      } else {
        panelHistory.classList.remove('d-none');
      }
      
      let responsePanel;
      $('.panel-message').each(function() {
        if(!$(this).parent().parent().hasClass('d-none') && !$(this).hasClass('d-none')) {
          responsePanel = $(this).prop('id').replace('panelM','');
        }
      });
      if(responsePanel == '') {
        $(`#userhistory-1`).click();
      }
      if($(`#userhistory${responsePanel}`)[0]) {
        $(`#userhistory${responsePanel}`).click();
      }
    } else if(this.classList.contains('btnconfig')) {
      panelAll.forEach((panel) => {
        panel.classList.add('d-none');
      });
      panelConfig.classList.remove('d-none');
     
    }
    //this.classList.add('selectedOption');
    //console.timeEnd('navLoader()');
  }
  async function getUserData() {
    let data = await fetch(`${location.origin}/consultarData`);
    let datos = await data.json();
    return datos;
    // fetch(`${location.origin}/consultarData`)
    // .then(response => response.json())
    // .then(data => console.log(data));
  }
  
  navMessages.addEventListener('click', addEventNavBar);
  navUsers.addEventListener('click', addEventNavBar);
  navConfig.addEventListener('click', addEventNavBar);
  document.addEventListener('click', actualizarEstado);
  window.addEventListener('focus', actualizarEstado);
  // $('.components-message').on('click', '.btnEnvio', function(e) {
  //   console.log($(this)[0]);
  //   let elementMessage = e.currentTarget.parentElement;
  //   sendMessage(socket, elementMessage);
  //   if(classList.contains('btn-prepanel')) {
  //     //     panelMessages.classList.add('d-none');
  //     //     panelHistory.classList.remove('d-none');
  //   }
  // });
  // $('.component-message').on('click', '.btn-prepanel', function(e) {
  //   panelMessages.classList.add('d-none');
  //   panelHistory.classList.remove('d-none');
  // });
  $('.components-message').on('keydown','.textMessage', function(e) {
    if(e.keyCode == 13) {
      e.preventDefault();
      if($(this).val() == '') return;
      let elementMessage = e.currentTarget.parentElement;
      sendMessage(socket, elementMessage);
      $(this).val('');
    }
  });
  $('.components-message').on('focus', '.textMessage', function() {
    $(this).parent($('.focus-message')).css({
      'display': 'flex',
      'border': '1px solid rgb(142, 113, 151)',
      'box-shadow': '0 0 0 0.2rem rgba(255, 0, 234, 0.25)',
      'width': '100%'
    });
    if(isMobile()) {
      setTimeout(() => {
        scrollDown($(this).parent().parent().parent().parent().find('.card-message'));
        // console.log('Bajado');
      },550);
    }
  });
  $('.components-message').on('blur', '.textMessage', function() {
    $(this).parent($('.focus-message')).css({
      'display': 'flex',
      'border': '1px solid rgb(184, 179, 179)',
      'box-shadow': 'none',
      'width': '100%'
    });
  });
  componentsMessage.addEventListener('click', e => {
    // console.log(e.currentTarget);
    if(e.target.classList.contains('btnEnvio')) {
      let elementMessage = e.target.parentElement;
      if($(elementMessage).find('.textMessage').val() == '') return;
      let elementContainer = e.target.parentElement.parentElement.parentElement.parentElement;
      sendMessage(socket, elementMessage);
      $(elementMessage).find('.textMessage').val('');
    }
    if(e.target.classList.contains('fa-paper-plane')) {
      let elementMessage = e.target.parentElement.parentElement;
      if($(elementMessage).find('.textMessage').val() == '') return;
      let elementContainer = e.target.parentElement.parentElement.parentElement.parentElement.parentElement;
      sendMessage(socket, elementMessage);
      $(elementMessage).find('.textMessage').val('');
    }
    if(e.target.classList.contains('btn-prepanel')) {
      panelMessages.classList.add('d-none');
      panelHistory.classList.remove('d-none');
      panelMessages.classList.remove('selectedItem');
      panelHistory.classList.add('selectedItem');
    }
    // if(e.target.classList.contains(''))
      // if((e.target.classList.contains('btnStickers') || e.target.classList.contains('fa-sticky-note')) && $emojiwrapper.css('display') == 'flex') {
      //   $emojiwrapper.css('display','none');
      // }
    // console.log(e.target.classList);
      if(e.target.classList.contains('img-gif')) {
        let destino_user = DestinoUser;
        // '<img class="emoji" src="/img/emoji/'
        // '.gif" />'
        let stick = `[sticker:${e.target.title}]`;
        // console.log(stick);
        // console.log(stick);
        socket.emit('sendMessage', {
          user: sessionStorage.user,
          name: sessionStorage.name,
          message: stick,
          destino: destino_user,
          sessionId: sessionId,
          foto: sessionStorage.foto
        });
      }
  });
  $('.container-history').on('click', '.messageschatnoti', function(e) {
    
    let responseId = $(this).prop('id').replace('userhistory','');
    let numPrevious = parseInt($(this).find('.myNumberNoti').text());
    let numTotal = parseInt($('.numberNoti').text());
    let resTotal = numTotal - numPrevious;
    $('.numberNoti').text(resTotal);
    $(this).find('.myNumberNoti').text('0');
    if(parseInt($('.numberNoti').text()) > 0) {
      $('.numberNoti').show();
    } else {
      $('.numberNoti').hide();
    }

    $(this).find('.myNumberNoti').hide();
    $(this).removeClass('newMessage');
    if(resTotal <= 0) {
      // console.log('asfas');
      $('.circle').css('visibility', 'hidden');
    }
    panelMessages.classList.remove('d-none');
    panelHistory.classList.add('d-none');
    panelMessages.classList.add('selectedItem');
    panelHistory.classList.remove('selectedItem');
    // console.log(responseId);
    $('.panel-message').addClass('d-none');
    if(responseId == '-1') {
      $(`#panelM`).removeClass('d-none');
      scrollDown($(`#panelM`).find('.card-message'));
      DestinoUser = "Todos";
    } else {
      $(`#panelM${responseId}`).removeClass('d-none');
      scrollDown($(`#panelM${responseId}`).find('.card-message'));
      DestinoUser = responseId;
    }
    
    
  });
  document.body.addEventListener('click', e => {
    let $emojiwrapper = $('#emojiWrapper');
      // console.log('asfas');
      if ($(e.target) != $emojiwrapper && !e.target.classList.contains('img-gif') && $emojiwrapper.hasClass('d-flex') && !e.target.classList.contains('btnStickers') && !e.target.classList.contains('fa-sticky-note')) {
        // console.log('asfas');
          $emojiwrapper.removeClass('d-flex');
          // resizePage();
      } 
      
  });

  let DestinoUser = "Todos";
  function sendMessage(socket, elementMessage) {
    let message = $(elementMessage).find('.textMessage').val();
    let destino_user = DestinoUser;
    // console.log(DestinoUser);
    // $('.panel-message').each(function() {
    //   if(!$(this).hasClass('d-none')) {
    //     destino_user = $(this).find('.container-destino').find('input').val();
    //   }
    // });
    message = message.replace(/</g, '<&').replace(/>/g, '>&').replace(/[[]/g, '{').replace(/]/g, '}');
    socket.emit('sendMessage', {
      user: sessionStorage.user,
      name: sessionStorage.name,
      message,
      destino: destino_user,
      sessionId: sessionId,
      foto: sessionStorage.foto
    });
    // $(elementContainer).find('.container-message').append(`
    //   ${message}
    // `);
  }
  function optionsToast() {
    toastr.options = {
      "closeButton": true,
      "debug": false,
      "newestOnTop": false,
      "progressBar": false,
      "positionClass": "toast-top-right",
      "preventDuplicates": true,
      "onclick": null,
      "showDuration": "300",
      "hideDuration": "1000",
      "timeOut": "4000",
      "extendedTimeOut": "1000",
      "showEasing": "swing",
      "hideEasing": "linear",
      "showMethod": "fadeIn",
      "hideMethod": "fadeOut"
    }
  }
  optionsToast();

  function scrollDown($element) {
    $element.scrollTop($element.prop('scrollHeight'));
    // console.log($element[0]);
  }
  let compThis, classThis;
  function findResponseMessage(socket) {
    socket.on('getMessage', (data) => {
      // alert(data);
      // console.log(data);
      // console.log(data.message);
      // '<img class="emoji" src="/img/emoji/'
      // '.gif" />'
      // console.log(nickNameChange);
      for(let i=0; i<nickNameChange.length; i++) {
        //console.log(nickNameChange[i]);
        if(nickNameChange[i].user != "") {
          // console.log(nickNameChange[i].destino, data.user);
          if(data.destino == 'Todos') {
            if(nickNameChange[i].destino == 'Todos'){
              if(nickNameChange[i].usuario == data.user) {
                data.name = nickNameChange[i].nombre;
              }
            }
          } else {
            if(nickNameChange[i].destino == data.destino || nickNameChange[i].destino == sessionStorage.user) {
              if(nickNameChange[i].usuario == data.user) {
                data.name = nickNameChange[i].nombre;
              }
              
            }
          }      
        }
      }
      if(data.message.includes('[audio:') && data.message.includes(']')) {
        let audioRex = data.message.replace('[audio:', '').replace(']', '');
        data.message = `<video width="340" height="50" controls>
          <source src="${audioRex}" type="video/webm" />
        </video>`;
      }
      if(data.message.includes('[sticker:') && data.message.includes(']')) {
        let imgRex = data.message.replace('[sticker:', '').replace(']', '');
        data.message = `<img class="emoji" src="/img/emoji/${imgRex}.gif" />`
      }
      let chatarea = document.querySelector(`#panelM${DestinoUser}`);
      if(chatarea) {
        chatarea = chatarea.querySelector('.card-message');
      } else {
        chatarea = document.querySelector('#panelM').querySelector('.card-message');
      }
      
      // $('.panel-message').each(function() {
      //   if(!$(this).hasClass('d-none')) {
      //     chatarea = this.querySelector('.card-message');
      //   }
      // });
      let confirmador = false;
      // console.log($(chatarea)[0]);
      if (chatarea.offsetHeight + chatarea.scrollTop ==
            chatarea.scrollHeight + 2 ||
          chatarea.offsetHeight + chatarea.scrollTop >= chatarea.scrollHeight) {
          confirmador = true;
      } else {
          confirmador = false;
      }
      var dateTime = moment().format("hh:mm a").toUpperCase();
      let decisiveUserMessage = 'mymessage';
      if(sessionStorage.user != data.user) {
        decisiveUserMessage = 'othermessage';
      }
      if(data.destino == sessionStorage.user) {
        
        if(!$(`#${data.user}`)[0]) {
          if(sessionStorage.user == data.user) {
            DestinoUser = addPanelMessage(data.user, data.name, true);
          } else {
            addPanelMessage(data.user, data.name, true);
          }
          
        }
        if($(`.${data.user}`)[0]) {
          if(data.message.includes('<video') && data.message.includes('<source')) {
            $(`.${data.user}`).find('.contenidomessagenofocus').html('<i class="fas fa-microphone-alt"></i> Ha enviado un audio.');
           } else if(data.message.includes('<img class="emoji" src="/img/emoji/') && data.message.includes('>')) {
            $(`.${data.user}`).find('.contenidomessagenofocus').html('<i class="far fa-sticky-note"></i> Ha enviado un sticker.');
           } else {
            $(`.${data.user}`).find('.contenidomessagenofocus').text(data.message);
           }
          if(data.destino == "Todos") {
            $(`.${data.user}`).find('.imghistory').prop('src', data.foto);
          }
          // $(`.message${data.destino}`).addClass(`message${data.user}`);
          // $(`.message${data.destino}`).removeClass(`message${data.destino}`);
        }
        
        if($(`#${data.user}`).find('.identMessage:last').hasClass(`message${data.user}`)) {
          // console.log('Repeat');
          $(`#${data.user}`).append(`
          <div id="mensaje${data.user}" class="identMessage ${decisiveUserMessage} message${data.user}">   
            <div class="othercontenidomessage">
              <p class="res-message spacingSection">${data.message}</p> 
            </div><div class="horamessage">
              <small class="hora">${dateTime}</small>
            </div>
            <label id="check1"><i class="fas fa-check icon-ready"></i></label>
          </div>
          `);
        } else {
            $(`#${data.user}`).append(`
          <div id="mensaje${data.user}" class="identMessage ${decisiveUserMessage} message${data.user}">
            <div class="contenidoimg">
            <img class="imguser" src="${data.foto}">
            </div>
            <div class="mycontenidomessage">
              
            <strong class="nom-user-message">${data.name}</strong>
            <p class="res-message">${data.message}</p>
            
            </div><div class="horamessage">
                <small class="hora">${dateTime}</small>
            </div>
            <label id="check1"><i class="fas fa-check icon-ready"></i></label>
          </div>
        `);
        }
        
      } else {
        if(!$(`#${data.destino}`)[0]) {
          if(sessionStorage.user == data.user) {
            DestinoUser = addPanelMessage(data.destino, data.name, true);
          } else {
            addPanelMessage(data.destino, data.name, false);
          }
        }
        if($(`.${data.destino}`)[0]) {
          
          if(data.message.includes('<video') && data.message.includes('<source')) {
            $(`.${data.destino}`).find('.contenidomessagenofocus').html('<i class="fas fa-microphone-alt"></i> Ha enviado un audio.');
           } else if(data.message.includes('<img class="emoji" src="/img/emoji/') && data.message.includes('>')) {
            $(`.${data.destino}`).find('.contenidomessagenofocus').html('<i class="far fa-sticky-note"></i> Ha enviado un sticker.');
           } else {
            $(`.${data.destino}`).find('.contenidomessagenofocus').text(data.message);
           }

          if(data.destino == "Todos") {
            $(`.${data.destino}`).find('.imghistory').prop('src', data.foto);
            // console.log(data.foto);
          }
          
          // $(`.message${data.destino}`).addClass(`message${data.user}`);
          // $(`.message${data.destino}`).removeClass(`message${data.destino}`);
          
        }
        if($(`#${data.destino}`).find('.identMessage:last').hasClass(`message${data.user}`)) {
          // console.log('Repeat');
          $(`#${data.destino}`).append(`
          <div id="mensaje${data.user}" class="identMessage ${decisiveUserMessage} message${data.user}">   
            <div class="othercontenidomessage">
              <p class="res-message spacingSection">${data.message}</p> 
            </div><div class="horamessage">
              <small class="hora">${dateTime}</small>
            </div>
            <label id="check1"><i class="fas fa-check icon-ready"></i></label>
          </div>
          `);
        } else {
          $(`#${data.destino}`).append(`
        <div id="mensaje${data.user}" class="identMessage ${decisiveUserMessage} message${data.user}">
          <div class="contenidoimg">
          <img class="imguser" src="${data.foto}">
          </div>
          <div class="mycontenidomessage">
            
          <strong class="nom-user-message">${data.name}</strong>
          <p class="res-message">${data.message}</p>
          
          </div><div class="horamessage">
              <small class="hora">${dateTime}</small>
          </div>
          <label id="check1"><i class="fas fa-check icon-ready"></i></label>
        </div>
      `);  
        }
       
        
      }
      if(sessionStorage.user != data.user) {
        
        // console.log($(`#userhistory${data.user}`)[0], `#userhistory${data.user}`);
        if(data.destino == 'Todos') {
          if($(`#panelM`).hasClass('d-none') || $('#content-message').hasClass('d-none')) {
            let numberPrevious = parseInt($(`#userhistory-1`).find('.myNumberNoti').text()) + 1;
            let notiTotal = 0;
            $(`#userhistory-1`).find('.myNumberNoti').text(numberPrevious);
            $('.myNumberNoti').each(function() {
              notiTotal += parseInt($(this).text());
            });
            $('.numberNoti').text(notiTotal);
            $('.numberNoti').show();
            $(`#userhistory-1`).find('.myNumberNoti').show();
            $(`#userhistory-1`).addClass('newMessage');
            Command: toastr["info"](`<div class="mensajeOtherNoti toast${data.user}"><strong class="nomNoti">${data.name}</strong> <br> <label class="messageNoti">${data.message}</label> <br> 
            <small class="lighter">Presione aquí para ver los mensajes</small> </div>`);
            //$('.messageNoti').text(data.message);
            $('.toast-info:last').css('margin-left', '5px');
            $('.toast-info:last').css('background-image', `url("${data.foto || fotoToastDefault}")`);
            if($(window).width() > 480) {
              $('.toast-info:last').css('background-position', '10px 19px'); 
            } else {
              $('.toast-info:last').css('background-position', '10px 13px'); 
            }
          }
        } else {
          if($(`#panelM${data.user}`).hasClass('d-none') || $('#content-message').hasClass('d-none')) {
            let numberPrevious = parseInt($(`#userhistory${data.user}`).find('.myNumberNoti').text()) + 1;
          // console.log($(`.message${data.destino}`).find('.myNumberNoti')[0]);
          let notiTotal = 0;
          // $('.numberNoti').text(numberPrevious);
            $(`#userhistory${data.user}`).find('.myNumberNoti').text(numberPrevious);
            $('.myNumberNoti').each(function() {
              notiTotal += parseInt($(this).text());
            });
            $('.numberNoti').text(notiTotal);
            $('.numberNoti').show();
            $(`#userhistory${data.user}`).find('.myNumberNoti').show();
            $(`#userhistory${data.user}`).addClass('newMessage');
            Command: toastr["info"](`<div class="mensajeOtherNoti toast${data.user}"><strong class="nomNoti">${data.name}</strong> <br> <label class="messageNoti">${data.message}</label> <br> 
            <small class="lighter">Presione aquí para ver los mensajes</small> </div>`);
            //$('.messageNoti').text(data.message);
            $('.toast-info:last').css('margin-left', '5px');
            $('.toast-info:last').css('background-image', `url("${data.foto || fotoToastDefault}")`);
            if($(window).width() > 480) {
              $('.toast-info:last').css('background-position', '10px 19px'); 
            } else {
              $('.toast-info:last').css('background-position', '10px 13px'); 
            }
          } else {
            
          }
        }
        
        // console.log($('.newMessage')[0]);
        if($('.newMessage')[0]) {
          // console.log('asfas');
          $('.circle').css('visibility', 'visible');
        }
        if(sessionStorage.sonido == "sound") {
          addSound();
        }
      }
      $('#toast-container').each(function() {
        $(this).off('click').on('click',function() {
          // console.log($(this)[0]);
          //socket.emit('focusHistory');
          // console.log($(this).children().children());
            if($(this).find('.mensajeOtherNoti')[0]) {
              classThis = $(this).find('.mensajeOtherNoti').prop('class').split(' ');
            }
            //console.log(data.destino, sessionStorage.username);
            compThis = classThis[1];
            // console.log($(`.${compThis}`)[0]);
            // console.log(compThis);
            if(data.destino != 'Todos') {
              if($(`#userhistory${data.user}`)[0]) {
                //console.log(`#userhistory${data.destino}${data.username}`);
                $(`.${compThis}`).parent().parent().remove();
                $(`#userhistory${data.user}`).click();
                $(".btnmessage").click();
                
                return;
              }
            }
            socket.emit('focusAll');
            /*$('.row').hide();
            $('#content-history').show();*/
        });
      });
      // $(`.message${data.user}`).css('color', $('.selector-color').val());
      if(confirmador || sessionStorage.user == data.user) {
          scrollDown($(chatarea));
      }
    });
  }

  function verificarFocusAll() {
    socket.on('focusAll', function() {
      $(`#userhistory-1`).click();
      $(".btnmessage").click();
      $(`.${compThis}`).parent().parent().remove();
    });
  }
  verificarFocusAll();
  findResponseMessage(socket);
  function addPanelMessage(idOtherUser, nameOtherUser, data) {
    let veriEmojis = '<button class="btn btn-primary btnEmojis emoji_01"><i class="fa fa-smile-o" aria-hidden="true"></i></button>';
    if(isMobile()) {
      veriEmojis = '';
    } 
    $('.components-message').append(`
          <div class="card panel-message" id="panelM${idOtherUser}">
          <div class="loader-page"></div>
          <img class="loader-imagen" src="/img/material-preloader.gif">
          <div class="container-destino">
            <i class="circle Blink"></i><i class="fas fa-chevron-left btn-prepanel"></i> <label class="title-destino" id="destinoM${idOtherUser}">${nameOtherUser}</label>
            <input type="hidden" class="selectorUser" value="${idOtherUser}">
            <div class="iconEdit" data-toggle="modal" data-target="#modalEditNick${idOtherUser}"><i class="far fa-edit"></i></div>
          </div>
          <div class="card-body card-message">
            <div class="container-message" id="${idOtherUser}">
            </div>
          </div>
          <!--<div class="spaceStickers">
            <div id="emojiWrapper" class="emojiWrapper"></div>
          </div>-->
          <div class="card-footer">
            <div class="form-group form-message">
              <div class="focus-message">
                <textarea class="form-control textMessage" id="textMessage" placeholder="Escriba algo" maxlength="3000"></textarea>
                ${veriEmojis}
                <button class="btn btn-primary btnAudio" data-toggle="modal" data-target="#modalAudio"><i class="fas fa-microphone"></i></button>
                <button class="btn btn-primary btnStickers"><i class="far fa-sticky-note"></i></button>
                <button class="btn btn-primary btnEnvio"><i class="far fa-paper-plane"></i></button>
                <br> 
              </div>
            </div>
          </div>
        </div>
          `);
        let filterDataUser = dataUserGlobal.find((dato) => dato.user==idOtherUser);
        if(data) {
          let compHistory = "";
            compHistory += `<div class="messageschatnoti ${idOtherUser}" id="userhistory${idOtherUser}">
            <div class="contenidoimg">
              <img class="imguser imghistory" src="${filterDataUser.foto}">
              </div>
                  <div class="contenidochatmessages">
                    <strong class="name-user-history" id="username">${nameOtherUser}</strong>
                    <div class="messagenofocus">
                      <p class="contenidomessagenofocus" id="${nameOtherUser}">${'&nbsp;'}</p>
                      <small class="myNumberNoti codigoNumber${sessionStorage.user}${idOtherUser}">0</small>
                      <i class="fas fa-chevron-right"></i>
                    </div>
                  </div>
                </div>`;
                compHistory += $('.chatnotify').html();
                $('.chatnotify').html(compHistory);
        } else {
          $(".chatnotify")
          .append(`<div class="messageschatnoti ${idOtherUser}" id="userhistory${idOtherUser}">
          <div class="contenidoimg">
            <img class="imguser imghistory" src="${filterDataUser.foto}">
            </div>
                <div class="contenidochatmessages">
                  <strong class="name-user-history" id="username">${nameOtherUser}</strong>
                  <div class="messagenofocus">
                    <p class="contenidomessagenofocus" id="${nameOtherUser}">${'&nbsp;'}</p>
                    <small class="myNumberNoti codigoNumber${sessionStorage.user}${idOtherUser}">0</small>
                    <i class="fas fa-chevron-right"></i>
                  </div>
                </div>
              </div>`);
        }
        $(`#panelM${idOtherUser}`).addClass('d-none');
        
        
        // console.log(dataUserGlobal, filterDataUser);
        editNickName([{
          user: filterDataUser.user,
          name: filterDataUser.name,
          foto: filterDataUser.foto
        },{
          user: sessionStorage.user,
          name: sessionStorage.name,
          foto: sessionStorage.foto
        }], true);
        return idOtherUser;
  }
  let popoverGlobalId = "";
  containerUsers.addEventListener('click', e => {
    if(e.target.classList.contains('popover1')) {
      popoverGlobalId = e.target.id;
      $(e.target).popover('show');
      $(e.target).on('shown.bs.popover', function() {
        $('.popover-body').off('click').on('click',function() {
          let idOtherUser = $(e.target).prop('id').replace('popover', '');
          let nameOtherUser = $(e.target.parentElement).find(`#user${idOtherUser}`).text();
          if(!$(`#panelM${idOtherUser}`)[0]) {
            DestinoUser = addPanelMessage(idOtherUser, nameOtherUser, false);
            
          }
            panelUsers.classList.add('d-none');
            panelMessages.classList.remove('d-none');
            navAll.forEach((nav) => {
              if(nav.classList.contains('btnmessage')) {
                nav.classList.add('selectedOption');
              } else {
                nav.classList.remove('selectedOption');
              }
            });
            $('.panel-message').addClass('d-none');
            // $(`#panelM${idOtherUser}`).removeClass('d-none');
            //$(`#userhistory${idOtherUser}`).click();
            $(`#userhistory${idOtherUser}`).click();
            // console.log($(`#userhistory${idOtherUser}`)[0]);
          console.log('Clicked Popover', idOtherUser);
        });
      });
      $(e.target).on('hidden.bs.popover', function() {
        popoverGlobalId = "";
      });
    }
    if(e.target.classList.contains('fa-comment-dots')) {
      popoverGlobalId = e.target.parentElement.id;
      $(e.target.parentElement).popover('show');
      $(e.target.parentElement).on('shown.bs.popover', function() {
        $('.popover-body').off('click').on('click',function() {
          let idOtherUser = $(e.target.parentElement).prop('id').replace('popover', '');
          let nameOtherUser = $(e.target.parentElement.parentElement).find(`#user${idOtherUser}`).text();

          if(!$(`#panelM${idOtherUser}`)[0]) {
            addPanelMessage(idOtherUser, nameOtherUser, false);
           
          }
            panelUsers.classList.add('d-none');
            panelMessages.classList.remove('d-none');
            navAll.forEach((nav) => {
              if(nav.classList.contains('btnmessage')) {
                nav.classList.add('selectedOption');
              } else {
                nav.classList.remove('selectedOption');
              }
            });
            $('.panel-message').addClass('d-none');
            // $(`#panelM${idOtherUser}`).removeClass('d-none');
            $(`#userhistory${idOtherUser}`).click();
            // console.log($(`#userhistory${idOtherUser}`)[0]);
          console.log('Clicked Popover', idOtherUser);
        });
      });
      $(e.target.parentElement).on('hidden.bs.popover', function() {
        popoverGlobalId = "";
      });
    }
  });
  
  function copiarAlPortapapeles(id_elemento) {
    var aux = document.createElement("input");
    aux.setAttribute("value", document.getElementById(id_elemento).value);
    document.body.appendChild(aux);
    aux.select();
    document.execCommand("copy");
    document.body.removeChild(aux);
  }
  
  btnCopiarPathUrl.addEventListener('click', (e) => {
    try {
      // intentar copiar el contenido seleccionado
      copiarAlPortapapeles('inputPathUrl');
      // $(this).html(`<strong>Copiado con exito! </strong><i class="fas fa-check"></i>`);
      e.currentTarget.innerHTML = `<i class="fas fa-check"></i>`;
      console.log(resultado ? 'Url copiado' : 'No se pudo copiar el url');
    } catch(err) {
      console.log('ERROR al intentar copiar el url');
    }
    // eliminar el texto seleccionado
    // cuando los navegadores lo soporten, habría
    // que utilizar: removeRange(range)
  });

  btnCopiarCodUrl.addEventListener('click', (e) => {
    try {
      // intentar copiar el contenido seleccionado
      copiarAlPortapapeles('inputCodUrl');
      // $(this).html(`<strong>Copiado con exito! </strong><i class="fas fa-check"></i>`);
      e.currentTarget.innerHTML = `<i class="fas fa-check"></i>`;
      console.log(resultado ? 'Url copiado' : 'No se pudo copiar el url');
    } catch(err) {
      console.log('ERROR al intentar copiar el url');
    }
    // eliminar el texto seleccionado
    // cuando los navegadores lo soporten, habría
    // que utilizar: removeRange(range)
  });
  // btnSalirSala.addEventListener('click', () => {
  //   location.href = '/';
  // });
  // btnSalirCuenta.addEventListener('click', () => {
  //   location.href = '/logout';
  // });
  function renderImage(formData) {
    let $image = document.querySelector('#imgUserConfig');
    const file = formData.get('archivo');
    const image = URL.createObjectURL(file);
    $image.setAttribute('src', image);
  }
  async function changeFoto(e, imgFoto) {
    let reader = new FileReader();

    // Leemos el archivo subido y se lo pasamos a nuestro fileReader
    await reader.readAsDataURL(e.target.files[0]);

    // Le decimos que cuando este listo ejecute el código interno
    reader.onload = async function () {
      let image = document.createElement("img");
      image.src = reader.result;
      if (/\.(jpeg|jpg|png|gif)$/i.test(e.target.files[0].name)) {
        imgFoto.src = await URL.createObjectURL(image.src);
      } else {
        alert("El archivo debe ser una imagen");
      }
    };
  }
  /*document.getElementById("imagefile").onchange = function (e) {
    let imgFoto = document.querySelector(".imgRegister");
    changeFoto(e, imgFoto);
  };*/
  const $file = document.querySelector('#file-foto');
  $file.addEventListener('change', (event) => {
    const $form = document.querySelector('#uploader');
    const formData = new FormData($form);
    if (/\.(jpeg|jpg|png|gif)$/i.test(event.currentTarget.value)) {
      renderImage(formData);
    } else {
      alert("El archivo debe ser una imagen");
    }
    
  })
  /*document.getElementById("file-foto").onchange = function (e) {
    let imgFoto = document.querySelector("#imgUserConfig");
    //changeFoto(e, imgFoto);
    const $form = document.querySelector('#uploader');
    const formData = new FormData($form);
    renderImage(formData);
  };*/
  $("#eliminarFoto").click(function () {
    $("#imgUserConfig").attr("src", fotoDefault);
    $('#file-foto').val(null);
  });
  
  socket.on('cambiarFoto', function(data) {
    // console.log(`imageuser${data.username}`);
    // console.log($(`.message${data.username}`)[0]);
    $('.imghistory').each(function() {
      console.log(data.fotoPrevious, $(this).prop('src'));
      if($(this).prop('src').includes(data.fotoPrevious)) {
        $(this).prop('src', data.foto);
      }
    });
    if($(`.message${data.username}`)[0]) {
      $(`.message${data.username}`).each(function() {
        $(this).find('.contenidoimg').find('.imguser').attr('src',data.foto);
       if($(this).attr('src') != "" && $(this).attr('src') != null && $(this).attr('src') != undefined) {
        $(this).attr('src', data.foto);
       }
      });
    }
    // $(`.${data.username}`).find('.imghistory').prop('src', data.foto);
    if($(`#imageuser${data.username}`)[0]) {
      $(`#imageuser${data.username}`).attr('src', data.foto);
    }
  });

  $('#uploader').on('submit', async function(event) {
    event.preventDefault();
    //console.log($('#imgUserConfig').prop('src'), sessionStorage.foto);
    verificarSonido();
    verificarNotiConnect();
    verificarNotiDisconnect();
    if($('#imgUserConfig').prop('src').includes(sessionStorage.foto)) {
      (async() => {
        swal("Success!", "Se han guardado exitosamente los cambios!", "success");
      })();
      return;
    }
    let timer = 0;
    $('.loader-page').addClass('d-flex');
    var form = $('#uploader')[0];
    var formData = new FormData(form);
    //console.log(`${location.origin}/images`);
    /*setTimeout(function() {
      if(timer <= 0) {
        
      }
    }, 5000);*/
    const urlDirect = location.origin + '/images';
    const response = await fetch(urlDirect, {
      method: 'POST', // or 'PUT'
      body: formData, // data can be `string` or {object}!
    });
    let previousFoto = sessionStorage.foto;
    let datos = await response.text();
    sessionStorage.foto = datos;
    console.log(sessionStorage.foto);
    socket.emit('cambiarFoto', {
      username: sessionStorage.user,
      foto: sessionStorage.foto,
      fotoPrevious: previousFoto
    });
    // console.log(datos);
    $('.loader-page').removeClass('d-flex');
    (async() => {
      swal("Success!", "Se han guardado exitosamente los cambios!", "success");
    })();
    // $.ajax({
    //   url: `${location.origin}/images`,
    //   data: formData,
    //   type: 'POST',
    //   contentType: false,
    //   processData: false
    // }).then(function(response) {
    //   if(response != fotoDefault) {
    //     sessionStorage.foto = `/upload/${response}`;
    //   } else {
    //     sessionStorage.foto = response;
    //   }
      
    //   // socket.emit('cambiarFoto', {
    //   //   username: sessionStorage.username,
    //   //   foto: sessionStorage.foto
    //   // });
    //   // verificarSonido();
    //   (async() => {
    //     swal("Success!", "Se han guardado exitosamente los cambios!", "success");
    //     $('.loader-page').hide();
    //     timer++;
    //   })();
    //   $('#file-foto').val(null);
    // }).catch((err) => {
    //   console.log(err);
    //   swal("Error!", "No se ha podido subir la imagen, intente denuevo :(", "error");
    //   $('.loader-page').hide();
    // });
    
  });

  function obtenerSearchUser(data) {
    if(buscarUsuario) {
      // console.log(data);
      if(data.length <= 0) {
        let previousContent = containerUsers.querySelector('.titulousers');
        let previousHr = containerUsers.querySelector('hr');
        containerUsers.innerHTML = '';
        containerUsers.appendChild(previousContent);
        containerUsers.appendChild(previousHr);
      }
      data.forEach((dat) => {
        let previousContent = containerUsers.querySelector('.titulousers');
        let previousHr = containerUsers.querySelector('hr');
        containerUsers.innerHTML = '';
        containerUsers.appendChild(previousContent);
        containerUsers.appendChild(previousHr);
        if(dat.user == sessionStorage.user) {
          containerUsers.innerHTML += `
          <div class="contenidousers">
            <div class="subcontenidousers">
              <div class="cotenidoimguser">
                <img
                  class="imguser_mini"
                  id="imageuser${dat.user}"
                  src="${dat.foto}"
                />
              </div>
              <div class="nomuser">
                <strong id="user${dat.user}">${dat.name}</strong>
              </div>
            </div>
          </div>
        `;
        } else {
          containerUsers.innerHTML += `
          <div class="contenidousers">
            <div class="subcontenidousers">
              <div class="cotenidoimguser">
                <img
                  class="imguser_mini"
                  id="imageuser${dat.user}"
                  src="${dat.foto}"
                />
              </div>
              <div class="nomuser">
                <strong id="user${dat.user}">${dat.name}</strong>
              </div>
            </div>
            <button
                  type="button"
                  id="popover${dat.user}"
                  class="popover1"
                  data-container="body"
                  data-toggle="popover"
                  data-placement="left"
                  data-trigger="focus"
                  data-content="Enviar mensaje"
                >
                  <i class="far fa-comment-dots" aria-hidden="true"></i>
                </button>
          </div>
        `;
        }
        
      });
    }
  }
  $("#buscadorUser").keyup(function () {
    if($(this).val() == '') {
      $('.iconSearch').show();
      $('.iconDeleteText').hide();
    } else {
      $('.iconSearch').hide();
      $('.iconDeleteText').show();
    }
    buscarUser($(this).val());
    // console.log('asfas');
  });
  $('.iconDeleteText').click(function() {
    $('#buscadorUser').val('');
    $('.iconSearch').show();
    $('.iconDeleteText').hide();
    buscarUser($(this).val());
    $('#buscadorUser').focus();
  });
  let buscarUsuario = false;
  function buscarUser(user) {
    if(user == "") {
      buscarUsuario = false;
      socket.emit("buscarUser");
      return;
    }
    // console.log('asfas2');
    buscarUsuario = true;
    socket.emit("buscarUser", user);
    // socket.on("buscarUser", function (data) {
    //   obtenerSearchUser(data);
    // });
  }

  $('.btnEnviarGrabacion').click(function() {
    if(!$('.identAudio')[0] || $('.identAudio').is(':hidden')) {
      (async() => {
        //swal("Success!", "Se han guardado los cambios ", "success");
        swal("Error!", "Le falta grabar audio o falta detener la grabación :(", "error");
      })();
       return;
      }
    var dateTime = moment().format("hh:mm a").toUpperCase();
    let destino_user = DestinoUser;
    // $('.panel-message').each(function() {
    //   if(!$(this).hasClass('d-none')) {
    //     destino_user = $(this).find('.container-destino').find('input').val();
    //   }
    // });
    let URLaudio = $('.identAudio').prop('href').replace(location.origin, '');
    socket.emit('sendMessage', {
        user: sessionStorage.user,
        name: sessionStorage.name,
        message: `[audio:${URLaudio}]`,
        destino: destino_user,
        sessionId: sessionId,
        foto: sessionStorage.foto || fotoDefault
    });
    // console.log(URLaudio);
    $('.close').click();
    $('.identAudio').prop('href', '');
    $('.identAudio').hide();
  });

  function _initialEmoji() {
    var emojiContainer = document.querySelector('#emojiWrapper'),
        docFragment = document.createDocumentFragment();
        if(emojiContainer.innerHTML == '') {
          for (var i = 69; i > 0; i--) {
            var emojiItem = document.createElement('img');
            emojiItem.src = '/img/emoji/' + i + '.gif';
            emojiItem.title = i;
            emojiItem.className = 'img-gif';
            docFragment.appendChild(emojiItem);
        };
        emojiContainer.appendChild(docFragment);
        }
  }
  _initialEmoji();

  function verificarNotiConnect() {
    if($('#defaultCheck2').prop('checked')){
      sessionStorage.userconnect="connect";
      }else{
        sessionStorage.userconnect="noconnect";
      }
  }
  function verificarNotiDisconnect() {
    if($('#defaultCheck3').prop('checked')){
      sessionStorage.userdisconnect="disconnect";
    }else{
        sessionStorage.userdisconnect="nodisconnect";
    }
  }
  function verificarSonido() {
    if($('#defaultCheck1').prop('checked')){
      sessionStorage.sonido="sound";
    } else {
      sessionStorage.sonido="nosound";
    }
  }
  function editNickName(users, veri) {
    let html = "";
    let addId = '';
    // console.log(users);
    if(veri) {
      addId = users[0].user;
    }
    for(let i=0; i<users.length; i++) {
      
      html+=`<div class="user-edit iduserEdit${users[i].user} nameuserEdit">
        <img class="img-edit message${users[i].user}" src="${users[i].foto}">
        <label class="name-edit">${users[i].name}</label>
        <button class="btn float-right btnCambiarApodo text-white"  data-toggle="modal" data-target="#modalChangeNick"><i class="fas fa-pencil-alt"></i> Establecer apodo</button>
        <input type="hidden" class="apodoName${users[i].user}" value="">
      </div>`;
    }
    if(!$(`#modalEditNick${addId}`)[0]) {
      $('.components-message').prepend(`<!-- Modal -->
      <div class="modal fade" id="modalEditNick${addId}" tabindex="-1" role="dialog" aria-labelledby="modalEditNickTitle" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered" role="document">
          <div class="modal-content bg-dark text-white">
            <div class="modal-header">
              <h5 class="modal-title" id="exampleModalLongTitle">Editar apodos</h5>
              <button type="button" class="close text-white" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body content-edit">
              ...
            </div>
            <!--<div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
              <button type="button" class="btn btn-primary">Save changes</button>
            </div>-->
          </div>
        </div>
      </div>`);
    }
    $('.content-edit').html(html);
  }
  $('.container').on('click', '.btnCambiarApodo', function(e) {
    let response = $(this).parent().prop('class').split(' ');
      let nombre = "";
      let usuario = "";
      usuario = response[1].replace('iduserEdit', '');
      nombre = $(this).parent().find('.name-edit').text();
      
      if(usuario == sessionStorage.username) {
        $('.identEdit').text('Edita tu apodo');
      } else {
        $('.identEdit').text(`Edita el apodo de ${nombre}`);
      }
        
        $('.inputEdit').prop('placeholder',nombre); 
        if($(this).parent().find(`.apodoName${usuario}`).val() != $('.inputEdit').prop('placeholder')) 
        {
          $('.inputEdit').val($(this).parent().find(`.apodoName${usuario}`).val());
        } else {
          $('.inputEdit').val('');
        }
        $('.ident-edit-user').val(usuario);
       // $('.inputEdit').val()
      setTimeout(function() {
        $('.inputEdit').focus();
      }, 500);
      $('.guardarEdit').off('click').on('click', function() {
        console.log('Cambiando Apodo...');
        let responseEdit = "";
        let respuestaFinal = false;
        if($('.inputEdit').val() == '') {
          //console.log($(`.message${$('.ident-edit-user').val()}`).find('.othercontenidomessage').find('.nom-user-message').text(), $('.inputEdit').prop('placeholder'));
          //console.log($('.mymessage').html());
          if($(`.message${$('.ident-edit-user').val()}`).find('.othercontenidomessage').find('.nom-user-message').text().includes($('.inputEdit').prop('placeholder')) || $(`.message${$('.ident-edit-user').val()}`).find('.mycontenidomessage').find('.nom-user-message').text().includes($('.inputEdit').prop('placeholder')) || $(`.message${$('.ident-edit-user').val()}`).html().includes($('.inputEdit').prop('placeholder')) || $(`.apodoName${$('.ident-edit-user').val()}`).val() == '') {
            return;
          } else {
            responseEdit = '';
          }
          
        } else {
          responseEdit = $('.inputEdit').val();
        }
        console.log(DestinoUser);
        socket.emit('cambiarApodo', {
          originalName: nombre,
          identOtherUser: usuario,
          lastApodo: responseEdit,
          userName: sessionStorage.name,
          identUser: sessionStorage.user,
          destino: DestinoUser,
          sessionId: sessionId
        });
        $('.close').click();
        $('.inputEdit').val('');
        //$(this).prop('disabled','disabled');
      });
  });
  let nickNameChange = [];
  socket.on('cambiarApodo', function(data) {
    let chatarea = document.querySelector(`#panelM${DestinoUser}`);
      if(chatarea) {
        chatarea = chatarea.querySelector('.card-message');
      } else {
        chatarea = document.querySelector('#panelM').querySelector('.card-message');
      }
    $(`.apodoName${data.identOtherUser}`).val(data.lastApodo);
    
    //data.message = encodeURI(data.message);
    //data.message = data.message.replace(/[_\W]+/g,'_');
    let confirmador = false;
    if (
      chatarea.offsetHeight + chatarea.scrollTop ==
        chatarea.scrollHeight + 2 ||
      chatarea.offsetHeight + chatarea.scrollTop >= chatarea.scrollHeight
    ) {
      confirmador = true;
    } else {
      confirmador = false;
    }
    // console.log(data.destino, data.identUser);
    let veriAddPanel = true;
    if(data.destino == 'Todos') {
      veriAddPanel = false;
    } else {
      if(sessionStorage.user != data.identUser) {
        data.destino = data.identUser;
      }
    }
    // console.log(data.destino);
    
    if(veriAddPanel) {
      if(!$(`#${data.destino}`)[0]) {
        addPanelMessage(data.destino, data.userName, false);
        Command: toastr["info"](`<div class="mensajeOtherNoti toast${data.identUser}"><strong class="nomNoti">${data.userName}</strong> <br> <label class="messageNoti">${data.userName} te ha cambiado de apodo.</label> <br> 
            <small class="lighter">Presione aquí para ver el cambio.</small> </div>`);
            //$('.messageNoti').text(data.message);
        $('.toast-info:last').css('margin-left', '5px');
        $('.toast-info:last').css('background-image', `url(none)`);
        $('#toast-container').each(function() {
          $(this).off('click').on('click',function() {
            // console.log($(this)[0]);
            //socket.emit('focusHistory');
            // console.log($(this).children().children());
              if($(this).find('.mensajeOtherNoti')[0]) {
                classThis = $(this).find('.mensajeOtherNoti').prop('class').split(' ');
              }
              //console.log(data.destino, sessionStorage.username);
              compThis = classThis[1];
              // console.log($(`.${compThis}`)[0]);
              // console.log(compThis);
              if(data.destino != 'Todos') {
                if($(`#userhistory${data.identUser}`)[0]) {
                  //console.log(`#userhistory${data.destino}${data.username}`);
                  $(`.${compThis}`).parent().parent().remove();
                  $(`#userhistory${data.identUser}`).click();
                  $(".btnmessage").click();
                  
                  return;
                }
              }
              socket.emit('focusAll');
              /*$('.row').hide();
              $('#content-history').show();*/
          });
        });
      }
    }
    
    
    $(`#${data.destino}`).find(`.message${data.identOtherUser}`).find('.mycontenidomessage').find('.nom-user-message').text(data.lastApodo);
    if(!$(`#${data.destino}`).find(`.message${data.identOtherUser}`).find('.mycontenidomessage').find('.nom-user-message')[0]) {
      $(`#${data.destino}`).find(`.message${data.identOtherUser}`).find('.othercontenidomessage').find('.nom-user-message').text(data.lastApodo);
    }
    if(data.destino != 'Todos') {
      nickNameChange.push({
        usuario: data.identOtherUser,
        nombre: data.lastApodo || data.originalName,
        destino: data.identUser
      });
    } else {
      nickNameChange.push({
        usuario: data.identOtherUser,
        nombre: data.lastApodo || data.originalName,
        destino: "Todos"
      });
    }
    
    if(data.lastApodo == '') {
      if(data.originalName == sessionStorage.name && data.identUser == sessionStorage.user && data.userName == sessionStorage.name) {
        $(`#${data.destino}`).append(`<div class="systemEdit">Has borrado tu apodo</div>`);
      } else {
        if(data.identOtherUser == data.identUser) {
          $(`#${data.destino}`).append(`<div class="systemEdit">${data.userName} ha borrado su apodo</div>`);
        }  
        else if(data.identOtherUser == sessionStorage.user) {
          $(`#${data.destino}`).append(`<div class="systemEdit">${data.userName} ha borrado tu apodo</div>`);
        } else {
          if(data.identUser == sessionStorage.user) {
            $(`#${data.destino}`).append(`<div class="systemEdit">Has borrado el apodo de ${data.originalName}</div>`);
          } else {
            $(`#${data.destino}`).append(`<div class="systemEdit">${data.userName} ha borrado el apodo de ${data.originalName}</div>`); 
          }
        }
        
      }
        $(`#${data.destino}`).find(`.message${data.identOtherUser}`).find('.mycontenidomessage').find('.nom-user-message').text(data.originalName);
      if(!$(`#${data.destino}`).find(`.message${data.identOtherUser}`).find('.mycontenidomessage').find('.nom-user-message')[0]) {
        $(`#${data.destino}`).find(`.message${data.identOtherUser}`).find('.othercontenidomessage').find('.nom-user-message').text(data.originalName);
      }
      
    } 
    else if(data.originalName == sessionStorage.name && data.identUser == sessionStorage.user && data.userName == sessionStorage.name) {
      $(`#${data.destino}`).append(`<div class="systemEdit">Has cambiado tu apodo a ${data.lastApodo}</div>`);
    } else {
      if(data.identOtherUser == data.identUser) {
        $(`#${data.destino}`).append(`<div class="systemEdit">${data.userName} ha cambiado su apodo a ${data.lastApodo}</div>`);
      }  
      else if(data.identOtherUser == sessionStorage.user) {
        $(`#${data.destino}`).append(`<div class="systemEdit">${data.userName} te ha cambiado el apodo a ${data.lastApodo}</div>`);
      } else {
        if(data.identUser == sessionStorage.user) {
          $(`#${data.destino}`).append(`<div class="systemEdit">Has cambiado el apodo de ${data.originalName} a ${data.lastApodo}</div>`);
        } else {
          $(`#${data.destino}`).append(`<div class="systemEdit">${data.userName} ha cambiado el apodo de ${data.originalName} a ${data.lastApodo}</div>`); 
        }
      }
      
    }
    if (confirmador || data.identUser == sessionStorage.user) {
      scrollDown($(chatarea));
    } 
  });
  function switchSheet() {
    let theme = document.getElementById("theme");
    let themeSwal = document.getElementById("theme-swal");
    if (theme.getAttribute("href") == "/css/theme-dark.css") {
      theme.href = "/css/theme-light.css";
      themeSwal.href = "/css/swal-light.css";
      addEmojiVisibleLight();
    } else {
      theme.href = "/css/theme-dark.css";
      themeSwal.href = "/css/swal-dark.css";
      addEmojiVisibleDark();
    }
  }

  $('.theme').change(function() {
    switchSheet();
    console.log('cambiando...');
  });
  function resizePage() {   
    if ($(window).width() <= 550) {
      $(".card-message").css("height", $(window).height() - 202 + "px");
      $(".card-message").css("max-height", $(window).height() - 202 + "px");
      $(".card-users").css("height", $(window).height() - 127 + "px");
      $(".card-users").css("max-height", $(window).height() - 127 + "px");
      $(".card-config").css("height", $(window).height() - 129 + "px");
      $(".card-config").css("max-height", $(window).height() - 129 + "px");
      $(".card-history").css("height", $(window).height() - 62 + "px");
      $(".card-history").css("max-height", $(window).height() - 62 + "px");
    } else {
      $(".card-message").css("height", $(window).height() - 238 + "px");
      $(".card-message").css("max-height", $(window).height() - 238 + "px");
      $(".card-users").css("height", $(window).height() - 163 + "px");
      $(".card-users").css("max-height", $(window).height() - 163 + "px");
      $(".card-config").css("height", $(window).height() - 165 + "px");
      $(".card-config").css("max-height", $(window).height() - 165 + "px");
      $(".card-history").css("height", $(window).height() - 98 + "px");
      $(".card-history").css("max-height", $(window).height() - 98 + "px");
    }
  }
  $(window).resize(function () {
    resizePage();
  });
  $(window).scroll(function() {
    resizePage();
  });
  resizePage();
});
  

