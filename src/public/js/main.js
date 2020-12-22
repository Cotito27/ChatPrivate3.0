
import helpers from './helpers.js';
import vStickers from "./key-stickers.js";

$(document).ready(function() {
  const socket = io({
    'reconnect': true,
    'reconnection delay': 500,
    'max reconnection attempts': 10
  });
  // console.log(socket);
  // console.log(socket.connect());
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
  $('#privateSessionIdUser').remove();
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
  if(!isMobile()) {
    let multiFile = document.querySelector('.multimedia-upload-msg');
    multiFile.dataset.toggle = 'tooltip';
    multiFile.dataset.placement = 'left';
    multiFile.dataset.title = 'Fotos';
    let fileUpload = document.querySelector('.file-upload-msg');
    fileUpload.dataset.toggle = 'tooltip';
    fileUpload.dataset.placement = 'left';
    fileUpload.dataset.title = 'Documento';
    let videoFile = document.querySelector('.video-upload-msg');
    videoFile.dataset.toggle = 'tooltip';
    videoFile.dataset.placement = 'left';
    videoFile.dataset.title = 'Videos';
    let audioFile = document.querySelector('.audio-upload-msg');
    audioFile.dataset.toggle = 'tooltip';
    audioFile.dataset.placement = 'left';
    audioFile.dataset.title = 'Audio';
    $('[data-toggle="tooltip"]:not(.btnmessage)').tooltip({
      delay: { "show": 250, "hide": 100 }
    });
    $('[data-toggle="tooltip"]').on('mouseleave', function() {
      $('[data-toggle="tooltip"]').tooltip('hide');
    });
  }
  socket.on('disconnectUser', detectarLogout);
  function detectarLogout(user) {
    let userlast = user.name;
    // console.log(userlast);
    let userIdent = user.user;
    if(sessionStorage.user == userIdent) {
      userConnect(socket,userIdent,userlast);
    }
    if($(`#panelM${userIdent}`)[0]) {
      $(`#panelM${userIdent}`).find('.focus-message').addClass('d-none');
      $(`#panelM${userIdent}`).find('.textWarningMsg').removeClass('d-none');
    }
    // console.log(userIdent, $(`#panelM${userIdent}`)[0]);
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
  sessionStorage.name = nameUser.toUpperCase();
  sessionStorage.user = idUser + sessionId;
  sessionStorage.sessionId = sessionId;
  sessionStorage.foto = fotoUser.replace(/amp;/g, '') || fotoDefault;
  
  // console.log(sessionStorage.foto);
    
  userConnect(socket, sessionStorage.user, sessionStorage.name);

  socket.on('disconnect', function () { 
    console.log('reconnecting...');
    // userConnect(socket, sessionStorage.user, sessionStorage.name);
    if(confirm('Ups!, hubo un problema, ¿desea reconectarse?')) {
      $('.closeTabFiles').click();
      userConnect(socket, sessionStorage.user, sessionStorage.name);
      socket.emit('addSession', location.href.split('/').pop() || location.href.split(/\\/g).pop());
    } else {
      // window.onbeforeunload = () => null;
      // location.reload();
      window.onbeforeunload = () => null;
      location.href = '/';
    }
    
  });

  function actualizarEstado(e) {
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
    let $emojiwrapper = $('.stickersGroudPanel');
    // console.log($emojiwrapper[0]);
    // console.log($emojiwrapper.prop('class'));
    if(!$emojiwrapper.hasClass('d-none')) {
      $emojiwrapper.addClass('d-none');
      resizePage();
    } else {
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
          chatarea.offsetHeight + chatarea.scrollTop+20 >= chatarea.scrollHeight) {
          confirmador = true;
      } else {
          confirmador = false;
      }
      $emojiwrapper.removeClass('d-none');
      resizePage();
      if(confirmador) {
        scrollDown($(chatarea));
      }
      var bLazy = new Blazy({
        container: '.header-stickers',
        offset: 40
      , success: function(element){
      setTimeout(function(){
      // We want to remove the loader gif now.
      // First we find the parent container
      // then we remove the "loading" class which holds the loader image
      var parent = element.parentNode;
      // console.log(parent);
      parent.className = parent.className.replace(/\bloading\b/,'');
      }, 200);
        },error: (err) => {
          alert(err)
        },
    });
      $('.wrapper_stickers:first').addClass('selectedStickHead');
      // var bLazy2 = new Blazy({
      //   container: '.content-stickers',
      //   offset: 80
      //   , success: function(element){
      //   setTimeout(function(){
      //   // We want to remove the loader gif now.
      //   // First we find the parent container
      //   // then we remove the "loading" class which holds the loader image
      //   var parent = element.parentNode;
      //   // console.log(parent);
      //   parent.className = parent.className.replace(/\bloading\b/,'');
      //   }, 200);
      //     },error: (err) => {
      //       alert(err)
      //     },
      // });
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
          input.textContent+=emoji.replace('<img class="emoji" draggable="false" alt="','').replace(valor,'').replace('" src','');
        });
        picker.pickerVisible?picker.hidePicker():picker.showPicker(e.target);
      }
      if(e.target.classList.contains('fa-smile-o')) {
        let input = e.target.parentElement.parentElement.parentElement.querySelector('.textMessage')
        picker.on('emoji',function(emoji){
          var valor=emoji.split('" src')[1];
          input.textContent+=emoji.replace('<img class="emoji" draggable="false" alt="','').replace(valor,'').replace('" src','');
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
          input.textContent+=emoji.replace('<img class="emoji" draggable="false" alt="','').replace(valor,'').replace('" src','');
        });
        picker.pickerVisible?picker.hidePicker():picker.showPicker(e.target);
      }
      if(e.target.classList.contains('fa-smile-o')) {
        let input = e.target.parentElement.parentElement.parentElement.querySelector('.textMessage')
        picker.on('emoji',function(emoji){
          var valor=emoji.split('" src')[1];
          input.textContent+=emoji.replace('<img class="emoji" draggable="false" alt="','').replace(valor,'').replace('" src','');
        });
        picker.pickerVisible?picker.hidePicker():picker.showPicker(e.target);
      }
    });
  }

  // $('body').on('change', '.btnFile', function() {

  // });

  function getOffsetLeft( elem )
  {
         var offsetLeft = 0;
         do {
           if ( !isNaN( elem.offsetLeft ) )
           {
               offsetLeft += elem.offsetLeft;
           }
         } while( elem = elem.offsetParent );
         return offsetLeft;
  }

  function getOffsetTop( elem )
  {
         var offsetTop = 0;
         do {
           if ( !isNaN( elem.offsetTop ) )
           {
               offsetTop += elem.offsetTop;
           }
         } while( elem = elem.offsetParent );
         return offsetTop;
  }
  function addClipFiles(elem) {
    // console.log(getOffsetLeft(elem), getOffsetTop(elem));
    let newElem = document.querySelector('.files-content');
    newElem.style.position = 'absolute';
    newElem.style.top = parseFloat(getOffsetTop(elem) - $(newElem).height() - 145) + 'px';
    newElem.style.left = parseFloat(getOffsetLeft(elem)) - 5.3 + 'px';
  }
  function resizeClipFiles(elem) {
    let newElem = document.querySelector('.files-content');
    newElem.style.position = 'absolute';
    newElem.style.top = parseFloat(getOffsetTop(elem) - $(newElem).height() - 23) + 'px';
    newElem.style.left = parseFloat(getOffsetLeft(elem)) - 5.3 + 'px';
  }
  
  addClipFiles(document.querySelector(`#panelM`).querySelector('.btnClip'));
  $('body').on('click', '.btnClip', function() {
    $('.files-content').toggleClass('d-none');
    if(DestinoUser == "Todos") {
      resizeClipFiles(document.querySelector(`#panelM`).querySelector('.btnClip'));
      // resizePage();
    } else {
      resizeClipFiles(document.querySelector(`#panelM${DestinoUser}`).querySelector('.btnClip'));
      // resizePage();
    }
      // $('.files-content').fadeToggle(function() {
        
      // });
    
    
  });

  // $('body').on('click', '.file-upload-msg', function() {

  // });

  $(document).on("click.files-content",function(event) {
    var target = $(event.target);   
    // console.log($('.grab_audio').hasClass('d-none'));
    if(!$('.files-content').hasClass('d-none')) {
      if (!target.closest(".file-upload-msg").length && !target.closest(".multimedia-upload-msg").length && !target.closest(".btnClip").length) {
        // closeMenu(function() {
        //     $(document).off("click.grab_audio");
        // });
        $('.files-content').addClass('d-none');
      }      
    }
  }); 
  let fileName = "";
  let fileSrc = "";
  let fileSize = 0;
  let typeFile = "";
  let formGlobalData = "";
  $('#multimedia-upload-msg,#video-upload-msg,#audio-upload-msg').change(function(event) {
    if(loadingState) {
     alert('El archivo seleccionado anteriormente sigue cargando');
     return;
    }
    let form = $('#files-upload-content')[0];
    // console.log(form);
    const $form = document.querySelector('#files-upload-content');
      const formData = new FormData($form);
    formGlobalData = new FormData();
      if($(this).prop('id') == 'multimedia-upload-msg') {
        typeFile = 'image'; 
        formGlobalData.set('archivo', formData.get('archivo2'));
      } else if($(this).prop('id') == 'video-upload-msg') {
        typeFile = 'video';
        formGlobalData.set('archivo', formData.get('archivo3'));
      } else if($(this).prop('id') == 'audio-upload-msg') {
        if(!noMobileAct) {
          if(!/\.(gsm|dct|vox|smaf|aiff|au|flac|alac|ogg|mpc|raw|tta|mp3|aac|mp4|wma|wav|ram|dss|dvf|ivs|m4p|lklak|MIDI)$/i.test($(this).val())) {
            alert('El archivo seleccionado debe de tener formato de audio');
            return;
          }
        }
        typeFile = 'audio';
        formGlobalData.set('archivo', formData.get('archivo4'));
      }
      
      let nameFile = event.currentTarget.files[0].name;
      
      // if (/\.(jpeg|jpg|png|gif)$/i.test(event.currentTarget.value)) {
      //   renderImage(formData, document.querySelector('#imgUserConfig'));
      let imgPreviewUrl;
      if(typeFile == 'image') {
        imgPreviewUrl = URL.createObjectURL(formData.get('archivo2'));
      } else if(typeFile == 'video') {
        imgPreviewUrl = URL.createObjectURL(formData.get('archivo3'));
      } else if(typeFile == 'audio') {
        imgPreviewUrl = URL.createObjectURL(formData.get('archivo4'));
      }
      
      let data = event.target.files[0];
      let reader = new FileReader();
      let fileR = this;
      let uriDestino = "";
      let decisiveTag = "";
      if(DestinoUser != "Todos") {
        uriDestino = DestinoUser;
      }
      if(typeFile == 'image') {
        decisiveTag = `<img src="${imgPreviewUrl}" alt="" class="iconImgFiles">`;
      } else if(typeFile == 'video') {
        decisiveTag = `<video src="${imgPreviewUrl}" alt="" class="iconImgFiles"></video>`
      } else if(typeFile == 'audio') {
        decisiveTag = `<img src="/img/audio-upload.png" alt="" class="iconImgFiles">`
      }
       if(noMobileAct) {
        $(`#panelM${uriDestino}`).append(`<div class="panel-files-content d-none">
        <div class="card-header text-white headerFilesPanel">
          <span class="d-inline ml-1 mr-3 closeTabFiles" style="color: rgb(200,200,200);"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" style=" margin-top: -5px; cursor: pointer;"><path fill="currentColor" d="M19.1 17.2l-5.3-5.3 5.3-5.3-1.8-1.8-5.3 5.4-5.3-5.3-1.8 1.7 5.3 5.3-5.3 5.3L6.7 19l5.3-5.3 5.3 5.3 1.8-1.8z"></path></svg></span>
          <div class="d-inline">
            Vista Previa
          </div>
        </div>
        <div class="card-body text-white bodyFilesPanel">
          <div class="loader-page-files d-flex"></div>
        </div>
        <div class="btnSendFile text-white text-center">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill="currentColor" d="M1.101 21.757L23.8 12.028 1.101 2.3l.011 7.912 13.623 1.816-13.623 1.817-.011 7.912z"></path></svg>
        </div>
        <div class="card-footer footerFilesPanel">
          <div class="reserve-file">
            ${decisiveTag}
          </div>
        </div>
      </div>`);
       } else {
        $(`#panelM${uriDestino}`).append(`<div class="panel-files-content d-none">
        <div class="card-header text-white headerFilesPanel">
          <span class="d-inline ml-1 mr-3 closeTabFiles" style="color: rgb(200,200,200);"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" style=" margin-top: -5px; cursor: pointer;"><path fill="currentColor" d="M19.1 17.2l-5.3-5.3 5.3-5.3-1.8-1.8-5.3 5.4-5.3-5.3-1.8 1.7 5.3 5.3-5.3 5.3L6.7 19l5.3-5.3 5.3 5.3 1.8-1.8z"></path></svg></span>
          <div class="d-inline">
            Vista Previa
          </div>
        </div>
        <div class="card-body text-white bodyFilesPanel">
          <div class="loader-page-files d-flex"></div>
        </div>
      </div>`);
       }
      
      var div = $(".panel-files-content");

          var height = div.removeClass('d-none').height();
   
          div.css({
              overflow: "hidden",
              marginTop: height,
              height: 0
          }).animate({
              marginTop: 0,
              height: height
          }, 180, function () {
              $('.panel-files-content').css({
                  display: "",
                  overflow: "",
                  height: "",
                  marginTop: ""
              });
          });
      let confirProsegFile = true;
      reader.onloadstart = function(evt) {
        fileSize = evt.total;
        if(fileSize > 10000000) 
        {
          $('.panel-files-content').remove();
          confirProsegFile = false;
          reader = null;
          $('#file-upload-msg,#multimedia-upload-msg,#video-upload-msg,#audio-upload-msg').val(null);
          return alert('El archivo no puede pesar más de 10 mgbs');
          
        };
      }

      reader.onload = function(evt){
        
      };
      reader.onloadend = function(evt) {
        if(!confirProsegFile) return;
        fileName = nameFile;
        fileSrc = evt.target.result;
        fileSize = evt.total;
        
        // $('.panel-files-content').remove();
        
        
        if(noMobileAct) {
          if(typeFile == 'image') {
            $('.bodyFilesPanel').html(`<img class="imgPreviewUpload" src="${imgPreviewUrl}">
            <input type="text" placeholder="Ingrese algún comentario" class="form-control bg-dark textCommentImgFile" style="width:100%;">`);
          } else if(typeFile == 'video') {
            $('.bodyFilesPanel').html(`<video class="imgPreviewUpload" src="${imgPreviewUrl}" controls></video>
            <input type="text" placeholder="Ingrese algún comentario" class="form-control bg-dark textCommentImgFile" style="width:100%;">`);
          } else if(typeFile == 'audio') {
            $('.bodyFilesPanel').html(`<audio class="imgPreviewUpload" src="${imgPreviewUrl}" controls></audio>
            <input type="text" placeholder="Ingrese algún comentario" class="form-control bg-dark textCommentImgFile" style="width:100%;">`);
          }
        } else {
          if(typeFile == 'image') {
            $('.bodyFilesPanel').html(`<img class="imgPreviewUpload" src="${imgPreviewUrl}">
          <div class="content-upload-movil">
            <input type="text" placeholder="Ingrese algún comentario" class="form-control bg-dark textCommentImgFile" style="width:100%;"><div class="btnSendFile text-white text-center">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill="currentColor" d="M1.101 21.757L23.8 12.028 1.101 2.3l.011 7.912 13.623 1.816-13.623 1.817-.011 7.912z"></path></svg>
                </div>
            </div>`);
          } else if(typeFile == 'video') {
            $('.bodyFilesPanel').html(`<video class="imgPreviewUpload" src="${imgPreviewUrl}" controls></video>
            <div class="content-upload-movil">
            <input type="text" placeholder="Ingrese algún comentario" class="form-control bg-dark textCommentImgFile" style="width:100%;"><div class="btnSendFile text-white text-center">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill="currentColor" d="M1.101 21.757L23.8 12.028 1.101 2.3l.011 7.912 13.623 1.816-13.623 1.817-.011 7.912z"></path></svg>
                </div>
            </div>`);
          } else if(typeFile == 'audio') {
            $('.bodyFilesPanel').html(`<audio class="imgPreviewUpload" src="${imgPreviewUrl}" controls></audio>
            <div class="content-upload-movil">
            <input type="text" placeholder="Ingrese algún comentario" class="form-control bg-dark textCommentImgFile" style="width:100%;"><div class="btnSendFile text-white text-center">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill="currentColor" d="M1.101 21.757L23.8 12.028 1.101 2.3l.011 7.912 13.623 1.816-13.623 1.817-.011 7.912z"></path></svg>
                </div>
            </div>`);
          }
          
          $('.imgPreviewUpload').attr('style', `
            max-width: 95%;
            max-height: 95%;
            border-radius: 0px;
            margin-bottom: 65px;
          `);
          $('.btnSendFile').attr('style', `
            position: initial;
            background-color: #00af9c;
            border-radius: 35px;
            width: 48px;
            height: 42px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            margin-left: 10px;      
          `);
        }
       
        
        $('.textCommentImgFile').focus();
        // $('.panel-files-content').slideToggle();
        // $('.panel-files-content').slideUp(2000, function() {
          
        // });
      }
      
     reader.readAsDataURL(data);
     
      // $('.panel-files-content').removeClass('d-none');
    // } else {
    //   alert("El archivo debe ser una imagen");
    // }
    $('.files-content').addClass('d-none');
  });
  $('#file-upload-msg').change(function(event) {
      if(loadingState) {
        alert('El archivo seleccionado anteriormente sigue cargando');
        return;
      }
      let nameFile = event.currentTarget.files[0].name;
      // const $form = document.querySelector('#files-upload-content');
      // const formData = new FormData($form);
      // if (/\.(jpeg|jpg|png|gif)$/i.test(event.currentTarget.value)) {
        // renderImage(formData, document.querySelector('#imgUserConfig'));
        
        let data = event.target.files[0];
        let reader = new FileReader();
        if(DestinoUser == "Todos") {
          $(`#panelM`).append(`<div class="panel-files-content d-none">
          <div class="card-header text-white headerFilesPanel">
            <span class="d-inline ml-1 mr-3 closeTabFiles" style="color: rgb(200,200,200);"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" style=" margin-top: -5px; cursor: pointer;"><path fill="currentColor" d="M19.1 17.2l-5.3-5.3 5.3-5.3-1.8-1.8-5.3 5.4-5.3-5.3-1.8 1.7 5.3 5.3-5.3 5.3L6.7 19l5.3-5.3 5.3 5.3 1.8-1.8z"></path></svg></span>
            <div class="d-inline">
              Vista Previa
            </div>
          </div>
          <div class="card-body text-white bodyFilesPanel">
            <div class="loader-page-files d-flex"></div>
          </div>
          <div class="btnSendFile text-white text-center">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill="currentColor" d="M1.101 21.757L23.8 12.028 1.101 2.3l.011 7.912 13.623 1.816-13.623 1.817-.011 7.912z"></path></svg>
          </div>
          <div class="card-footer footerFilesPanel">
            <div class="reserve-file">
              <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADMAAAA8CAYAAADL94L/AAAByElEQVR4Ae3axdJTQRAFYFyegA3u8ALseCDcicsGhxt3x+G32BXc3X3NBnfXYTqp3sZlhuqpOlXZRL46He9ReJyJxGSTEreaPfEHZiX+1uSJvelVNu+Jvjd7Yk9zI8aSUe0eDpjCIYfNSuw5v/zF5In/6mU27478tXriLJvXjdSwPq1lCDTCmxjiCNav8GZYBVMwWKagX8kWjk9vCcMhYWhEFEw1+oV0wZjdPKY6Vn9EwmBDTYPwBoXCYPLGDQTJjkHQNQRJj0FQtmgs+C8wOHIIkh2DoDu5vD5Xfkz9hsTBWDyxhjDYUDqvLRYSY1JilSQGyyxXOt4QKJPX70NDQmI27gyxHcn9bH/5RFMNAUgoDI4afOAMHBiCdiDNj5woGAhgsCEYudSI1lBCRwoPL957slAoDDYEoPXb/ZVs3FE/y9072fDxsx4BMPVfGOpl1VY/y5++4EWM1Fm9LcCKpy8RpnchDGEIQxjCEIYwhCEMYQhDGMIQhjCEIQxhCEMYwhCGMIQhDGEIQxhYNlXiP+XHXLRDM5thQVpyzIfS2YtLceVEkRmzalsgMArPhp258bA6b/LEb8LqPM930VNdvY/fhMmCxw+Of+4BTcPInBo2AAAAAElFTkSuQmCC" alt="" class="iconImgFiles">
            </div>
          </div>
        </div>`);
        } else {
          $(`#panelM${DestinoUser}`).append(`<div class="panel-files-content d-none">
          <div class="card-header text-white headerFilesPanel">
            <span class="d-inline ml-1 mr-3 closeTabFiles" style="color: rgb(200,200,200);"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" style=" margin-top: -5px; cursor: pointer;"><path fill="currentColor" d="M19.1 17.2l-5.3-5.3 5.3-5.3-1.8-1.8-5.3 5.4-5.3-5.3-1.8 1.7 5.3 5.3-5.3 5.3L6.7 19l5.3-5.3 5.3 5.3 1.8-1.8z"></path></svg></span>
            <div class="d-inline">
              Vista Previa
            </div>
          </div>
          <div class="card-body text-white bodyFilesPanel">
            <div class="loader-page-files d-flex"></div>
          </div>
          <div class="btnSendFile text-white text-center">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill="currentColor" d="M1.101 21.757L23.8 12.028 1.101 2.3l.011 7.912 13.623 1.816-13.623 1.817-.011 7.912z"></path></svg>
          </div>
          <div class="card-footer footerFilesPanel">
            <div class="reserve-file">
              <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADMAAAA8CAYAAADL94L/AAAByElEQVR4Ae3axdJTQRAFYFyegA3u8ALseCDcicsGhxt3x+G32BXc3X3NBnfXYTqp3sZlhuqpOlXZRL46He9ReJyJxGSTEreaPfEHZiX+1uSJvelVNu+Jvjd7Yk9zI8aSUe0eDpjCIYfNSuw5v/zF5In/6mU27478tXriLJvXjdSwPq1lCDTCmxjiCNav8GZYBVMwWKagX8kWjk9vCcMhYWhEFEw1+oV0wZjdPKY6Vn9EwmBDTYPwBoXCYPLGDQTJjkHQNQRJj0FQtmgs+C8wOHIIkh2DoDu5vD5Xfkz9hsTBWDyxhjDYUDqvLRYSY1JilSQGyyxXOt4QKJPX70NDQmI27gyxHcn9bH/5RFMNAUgoDI4afOAMHBiCdiDNj5woGAhgsCEYudSI1lBCRwoPL957slAoDDYEoPXb/ZVs3FE/y9072fDxsx4BMPVfGOpl1VY/y5++4EWM1Fm9LcCKpy8RpnchDGEIQxjCEIYwhCEMYQhDGMIQhjCEIQxhCEMYwhCGMIQhDGEIQxhYNlXiP+XHXLRDM5thQVpyzIfS2YtLceVEkRmzalsgMArPhp258bA6b/LEb8LqPM930VNdvY/fhMmCxw+Of+4BTcPInBo2AAAAAElFTkSuQmCC" alt="" class="iconImgFiles">
            </div>
          </div>
        </div>`);
        }
        var div = $(".panel-files-content");

        var height = div.removeClass('d-none').height();
 
        div.css({
            overflow: "hidden",
            marginTop: height,
            height: 0
        }).animate({
            marginTop: 0,
            height: height
        }, 180, function () {
            $('.panel-files-content').css({
                display: "",
                overflow: "",
                height: "",
                marginTop: ""
            });
        });
        let confirProsegFile = true;
        reader.onloadstart = function(evt) {
          fileSize = evt.total;
          if(fileSize > 10000000) 
          {
            $('.panel-files-content').remove();
            confirProsegFile = false;
            reader = null;
            $('#file-upload-msg,#multimedia-upload-msg,#video-upload-msg,#audio-upload-msg').val(null);
            return alert('El archivo no puede pesar más de 10 mgbs');
            
          };
          // console.log(evt.total);
        }
        reader.onload = function(evt){
          // fileSize = evt.total;
          // if(fileSize > 700000) 
          // {
          //   $('.panel-files-content').remove();
          //   return alert('El archivo no puede pesar más de 700 kbs');
          // };
          // // console.log(evt.total);
          
        };
        reader.onloadend = function(evt) {
          if(!confirProsegFile) return;
          fileName = nameFile;
          fileSrc = evt.target.result;
          fileSize = evt.total;
          
          // $('.panel-files-content').remove();
          $('.bodyFilesPanel').html(` <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADMAAAA8CAYAAADL94L/AAAByElEQVR4Ae3axdJTQRAFYFyegA3u8ALseCDcicsGhxt3x+G32BXc3X3NBnfXYTqp3sZlhuqpOlXZRL46He9ReJyJxGSTEreaPfEHZiX+1uSJvelVNu+Jvjd7Yk9zI8aSUe0eDpjCIYfNSuw5v/zF5In/6mU27478tXriLJvXjdSwPq1lCDTCmxjiCNav8GZYBVMwWKagX8kWjk9vCcMhYWhEFEw1+oV0wZjdPKY6Vn9EwmBDTYPwBoXCYPLGDQTJjkHQNQRJj0FQtmgs+C8wOHIIkh2DoDu5vD5Xfkz9hsTBWDyxhjDYUDqvLRYSY1JilSQGyyxXOt4QKJPX70NDQmI27gyxHcn9bH/5RFMNAUgoDI4afOAMHBiCdiDNj5woGAhgsCEYudSI1lBCRwoPL957slAoDDYEoPXb/ZVs3FE/y9072fDxsx4BMPVfGOpl1VY/y5++4EWM1Fm9LcCKpy8RpnchDGEIQxjCEIYwhCEMYQhDGMIQhjCEIQxhCEMYwhCGMIQhDGEIQxhYNlXiP+XHXLRDM5thQVpyzIfS2YtLceVEkRmzalsgMArPhp258bA6b/LEb8LqPM930VNdvY/fhMmCxw+Of+4BTcPInBo2AAAAAElFTkSuQmCC" alt="" class="iconImgFiles mb-2">
          <div class="title-file-upload d-block">${nameFile}</div>`);
          // $('.panel-files-content').slideToggle();
          // $('.panel-files-content').slideUp(2000, function() {
         
          // });
        }
        
       reader.readAsDataURL(data);
       
        // $('.panel-files-content').removeClass('d-none');
      // } else {
      //   alert("El archivo debe ser una imagen");
      // }
      $('.files-content').addClass('d-none');
  });
  const b64toBlob = (b64Data, contentType='', sliceSize=512) => {
    const byteCharacters = atob(b64Data);
    const byteArrays = [];
  
    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);
  
      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
  
      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }
  
    const blob = new Blob(byteArrays, {type: contentType});
    return blob;
  }
  $('body').on('click', '.closeTabFiles', function() {
    if(DestinoUser == "Todos") {
      // $('.panel-files-content').slideToggle(() => {
      //   $(`#panelM`).find('.panel-files-content').remove();
      // });
      var div = $(".panel-files-content");

      var height = div.css({
          display: "block"
      }).height();

      div.css({
          overflow: "hidden",
          marginTop: 0,
          height: height
      }).animate({
          marginTop: height,
          height: 0
      }, 180, function () {
        $(`#panelM`).find('.panel-files-content').remove();
      });
    } else {
      // $('.panel-files-content').slideToggle(() => {
      //   $(`#panelM${DestinoUser}`).find('.panel-files-content').remove();
      // });
      var div = $(".panel-files-content");

      var height = div.css({
          display: "block"
      }).height();

      div.css({
          overflow: "hidden",
          marginTop: 0,
          height: height
      }).animate({
          marginTop: height,
          height: 0
      }, 180, function () {
        $(`#panelM${DestinoUser}`).find('.panel-files-content').remove();
      });
    }
    $('#file-upload-msg,#multimedia-upload-msg,#video-upload-msg,#audio-upload-msg').val(null);
  });
  $('#files-upload-content').submit(function(e) {
    return e.preventDefault();
  });
  function _base64ToArrayBuffer(base64) {
    var binary_string = window.atob(base64);
    var len = binary_string.length;
    var bytes = new Uint8Array(len);
    for (var i = 0; i < len; i++) {
        bytes[i] = binary_string.charCodeAt(i);
    }
    return bytes.buffer;
}
async function base64ToBufferAsync(base64) {
  var dataUrl = "data:application/octet-binary;base64," + base64;

  await fetch(dataUrl)
    .then(res => res.arrayBuffer())
    .then(buffer => {
      console.log("base64 to buffer: " + new Uint8Array(buffer));
    })
}

  $('body').on('keydown', function(e) {
    if(e.key === "Escape") {
      $('.closeTabFiles').click();
    }
  });

  $('body').on('keydown', '.textCommentImgFile', async function(e) {
   
    if(e.keyCode == 13) {
      e.preventDefault();
        
      $('.btnSendFile').addClass('d-none');
      let payload = {fileSrc};
      let data = new FormData();
      data.append( "json", JSON.stringify( payload ) );
      const RUTA_SERVIDOR = '/createUrl';
      let response = await fetch(RUTA_SERVIDOR, {
        method: "POST",
        body: data
      });
      // let res = await response.json();
      // console.log( JSON.parse(res.json) );
      let res = await response.text();
      console.log(res);
      // return;
      if($('.textCommentImgFile')[0]) {
        socket.emit('sendFileMsg', {
          user: sessionStorage.user,
          name: sessionStorage.name,
          foto: sessionStorage.foto || fotoDefault,
          sessionId: sessionId,
          destino: DestinoUser,
          message: '',
          file: '',
          fileName: fileName,
          comment: $('.textCommentImgFile').val(),
          typeFile: typeFile
        });
        
      } 
      // $('body').css("pointer-events", "auto");
      
    }
  });
  $('body').on('dbclick', '.btnSendFile', function() {
    e.preventDefault();
    e.stopPropagation();
  });

  async function toDataUrl(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.onload = async function() {
        var reader = new FileReader();
        reader.onloadend = async function() {
            await callback(reader.result);
        }
        await reader.readAsDataURL(xhr.response);
    };
    xhr.open('GET', url);
    xhr.responseType = 'blob';
    await xhr.send();
  }

  async function openImage (index) {
    const url = formatURLs[index];
    const base64 = await this.getBase64Image(url);
    this.setState(prevState => ({
      currentImage: index,
      currentImagebase64: base64
    }));
  }

  async function getBase64Image(url) {
    const response = await fetch(url);
    const blob = await response.blob();
    const reader = new FileReader();
    await new Promise((resolve, reject) => {
      reader.onload = resolve;
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
    return reader.result.replace(/^data:.+;base64,/, '')
  }

  let loadingState = false;

  $('body').on('click', '.btnSendFile', async function(e) {
      // const $form = document.querySelector('#files-upload-content');
      // const formData = new FormData($form);
      // let file = formData.get('archivo');
      // console.log(fileSrc, fileName);
      // let file = fileSrc;
      // let stream = ss.createStream();

      // arrBuffer.forEach((v) => {

      // });
      // $(this).attr('disabled', 'disabled');
      // $(this).removeClass('btnSendFile');
      
      $(this).replaceWith('<div class="loader-file-msg"><div class="lds-ring"><div></div><div></div><div></div><div></div></div></div>');
      if(!noMobileAct) {
        $('.lds-ring div').attr('style', `
          box-sizing: border-box;
          display: block;
          position: absolute;
          width: 24px;
          height: 24px;
          top: 27px;
          left: 10px;
          margin: auto;
          border: 4px solid #fff;
          border-radius: 50%;
          animation: lds-ring 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
          border-color: #fff transparent transparent transparent;
        `);
        $('.loader-file-msg').attr('style', `
        position: initial;
        background-color: #00af9c;
        border-radius: 35px;
        width: 48px;
        height: 42px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        margin-left: 10px;      
      `);
      }

      loadingState = true;
      
      // let payload = {fileSrc};
      // let data = new FormData();
      // data.append( "json", JSON.stringify( payload ) );
      // const RUTA_SERVIDOR = '/createUrl';
      // let response = await fetch(RUTA_SERVIDOR, {
      //   method: "POST",
      //   body: data
      // });
      // // let res = await response.json();
      // // console.log( JSON.parse(res.json) );
      // let res = await response.text();
      // console.log(res);
      
      //console.log(`${location.origin}/images`);
      /*setTimeout(function() {
        if(timer <= 0) {
          
        }
      }, 5000);*/
      // console.log(formGlobalData);
      const urlDirect = location.origin + '/createUrl';
      const response = await fetch(urlDirect, {
        method: 'POST', // or 'PUT'
        body: formGlobalData, // data can be `string` or {object}!
      });
      const res = await response.text();
      let fileUrl = `/upload/${res}`;
      // console.log(openImage(fileUrl));
      console.log(fileUrl);
 
      if($('.textCommentImgFile')[0]) {
        socket.emit('sendFileMsg', {
          user: sessionStorage.user,
          name: sessionStorage.name,
          foto: sessionStorage.foto || fotoDefault,
          sessionId: sessionId,
          destino: DestinoUser,
          message: '',
          file: fileUrl,
          fileName: fileName,
          comment: $('.textCommentImgFile').val(),
          typeFile: typeFile
        });
        
      } else {
        socket.emit('sendFileMsg', {
          user: sessionStorage.user,
          name: sessionStorage.name,
          foto: sessionStorage.foto || fotoDefault,
          sessionId: sessionId,
          destino: DestinoUser,
          message: '',
          file: fileUrl,
          fileName: fileName
        });
        
      }
      // $('body').css("pointer-events", "auto");
      
      // let newFile = URL.createObjectURL(file);
      // console.log(newFile);
  });

  // socket.on('getFileMsg', async function(data) {
  //     let extName = data.fileName.split('.').pop();
  //     let file = await fetch(data.file);
  //     let blobFile = await file.blob();
  //     // let blobFile = b64toBlob(data.file, extName);
  //     // let newFile = URL.createObjectURL(data.file);
  //     let newUrl = URL.createObjectURL(blobFile);
   
  // });

  if(!isMobile()) {
    $('#audio-upload-msg').attr('accept', 'audio/*');
    addEmojiVisibleLight();
  } else {
    $('#audio-upload-msg').attr('accept', '*');
    $('.btnEmojis').remove();
  }

  let replaceuser = "";
  let replaceuser2 = "";
  let noMobileAct = false;
  if(!isMobile()) {
    noMobileAct = true;
  }
  function verifyUserConnet(socket) {
    socket.on('listUser', (data, numData) => {
      let verifyPop = "";
      $(`.popover1`).popover('dispose');
      $(`.popover1`).popover('update');
      // if($('.popover1').prop('aria-describedby')) {
      //   verifyPop = $('.popover1').prop('id');
      // }
      let verifyAddTooltip = "";
      if(noMobileAct) {
        verifyAddTooltip = `<span class="tiptextCustom">Controles de usuario</span>`
      }
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
                <span class="myNameUser" id="user${dat.user}">${dat.name}</span>
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
                <span class="otherNameUser" id="user${dat.user}">${dat.name}</span>
              </div>
            </div>
            <button
                  type="button"
                  id="popover${dat.user}"
                  class="popover1 tooltipCustom leftCustom"
                  data-container="body"
                  data-toggle="popover" data-placement="left"
                  data-trigger="click"
                  data-content="Enviar mensaje"
                >
                  ${verifyAddTooltip}
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
                <span class="myNameUser" id="user${dat.user}">${dat.name}</span>
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
                <span class="otherNameUser" id="user${dat.user}">${dat.name}</span>
              </div>
            </div>
            <button
                  type="button"
                  id="popover${dat.user}"
                  class="popover1 tooltipCustom leftCustom"
                  data-container="body"
                  data-toggle="popover"
                  data-placement="left"
                  data-trigger="click"
                  data-content="Enviar mensaje"
                >
                  ${verifyAddTooltip}
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
    let popover2Id = "";
    if(popoverGlobalId != "" ) {
      console.log('Popover agregado');
      // console.log(popoverGlobalId, $(`#${popoverGlobalId}`)[0]);
      $(`#${popoverGlobalId}`).click();
      
    //   $(`#${popoverGlobalId}`).popover('update');
    }
    // if(!isMobile()) {
    //   $('[data-toggle="tooltip"]').tooltip({
    //     delay: { "show": 250, "hide": 100 }
    //   });
    //   $('[data-toggle="tooltip"]').on('mouseleave', function() {
    //     $('[data-toggle="tooltip"]').tooltip('hide');
    //   });
    // }
    // sessionStorage.foto = $(`#imageuser${sessionStorage.user}`).prop('src');
    //  console.log($(`#imageuser${sessionStorage.user}`).prop('src'));
    });
   
  } 
  $(window).blur(function() {
    // if(popoverGlobalId!="" && !$(`.popover-body`)[0]) {
    //   $(`.popover1`).popover('hide');
    //   $(`.popover1`).popover('update');
    //   $(`#${popoverGlobalId}`).popover('show');
    //   console.log(popoverGlobalId);
    // //   $(`#${popoverGlobalId}`).popover('update');
    // }
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
    if($(`#panelM${verificar}`)[0]) {
      $(`#panelM${verificar}`).find('.focus-message').removeClass('d-none');
      $(`#panelM${verificar}`).find('.textWarningMsg').addClass('d-none');
    }
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
  let audio = document.querySelector('.soundChat');  
  function addSound() {
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
    // navAll.forEach((nav) => {
    //   if(nav.classList == this.classList) {
    //     nav.classList.add('selectedOption');
    //   } else {
    //     nav.classList.remove('selectedOption');
    //   }
      
    // });
    $('.selectedOption').removeClass('selectedOption');
    this.classList.add('selectedOption');
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
    $('[data-toggle="tooltip"]').tooltip('hide');
    navAll.forEach((nav) => {
      if(nav != this) {
        nav.dataset.toggle = 'tooltip';
        nav.dataset.originalTitle = nav.dataset.nameNav;
      } else {
        delete nav.dataset.toggle;
        delete nav.dataset.originalTitle;
      }
    });
    
    if(!isMobile()) {
      $('[data-toggle="tooltip"]').tooltip({
        delay: { "show": 250, "hide": 100 }
      });
      $('[data-toggle="tooltip"]').on('mouseleave', function() {
        $('[data-toggle="tooltip"]').tooltip('hide');
      });
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
  // document.addEventListener('click', actualizarEstado);
  // window.addEventListener('focus', actualizarEstado);
  $('body').click(e => {
    if(!e.target.classList.contains('fa-comment-dots') && !e.target.classList.contains('popover1')) {
        $('.popover1').popover('hide');
        $('.popover1').popover('dispose');
        if(noMobileAct) {
          $('.tiptextCustom').removeClass('d-none');
        }
    }
  });
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
  $(document).on("click.hashUser",function(event) {
    var target = $(event.target);   
    // console.log($('.grab_audio').hasClass('d-none'));
    if(!$('.hashUser').hasClass('d-none')) {
      if (!target.closest(".hashUser").length && !target.closest(".textMessage").length) {
        // closeMenu(function() {
        //     $(document).off("click.grab_audio");
        // });
        $('.hashUser').addClass('d-none');
      }      
    }
  }); 
  $('.components-message').on('keyup', '.textMessage', function(e) {
    // console.log('xd');
    // $(this).val($(this).val().replace(/@/g,'@'));
    if(e.keyCode == 38 || e.keyCode == 40 || e.keyCode == 13 || e.key == "Escape")  {
      e.stopPropagation();
      e.preventDefault();
      return false;
    };

    // console.log('Lockeado');
    if($(this).text().includes('@')) {
     if(DestinoUser == "Todos") {
      let veriUserHash = $(this).text().split("@").pop().toUpperCase();
      // console.log(veriUserHash, $(this).val().split("@"));
      // console.log(veriUserHash, dataUserGlobal);
      let newVecHash = dataUserGlobal.filter((v) => v.name.includes(veriUserHash) && v.name!=veriUserHash);
      // console.log(newVecHash);
      // console.log('asfas');
      let vecUser = [];
      
      let html = "";
      newVecHash.forEach((v,i,arr) => {
        if(v.user != sessionStorage.user) {
          html += `<div
          class="user-hash nameuserHash"
          data-key-hash=${i} data-key-id="${v.user}"
        >
          <img
            class="img-hash message${v.user}"
            src="${v.foto}"
          />
          <label class="name-hash">${v.name}</label>
  
          <input
            type="hidden"
            class="apodoName${v.user}"
            value=""
          />
        </div>`;
        }
      
      });
      if(html == "") {
        $('.hashUser').addClass('d-none');
        $('.content-hash').html('');
        $selectedItemHash = "";
        return;
      }
      $('.hashUser').removeClass('d-none');
      $('.content-hash').html(html);
      // console.log($selectedItemHash[0]);
      // if($selectedItemHash == "") {
        // $('.user-hash').removeClass('selectedHash');
        $('.selectedHash').removeClass('selectedHash');
        $('.user-hash:first').addClass('selectedHash');
      // } 
      // else {
      //   if($selectedItemHash[0]) {
      //     $('.user-hash').removeClass('selectedHash');
      //   $selectedItemHash.addClass('selectedHash');
      //   }
      // }
     }
        // $(`.panelM${DestinoUser}`)
    } else {
      if(!$('.hashUser').hasClass('d-none')) {
        $('.hashUser').addClass('d-none');
        $('.content-hash').html('');
      }
      // placeCaretAtEnd($(this).get(0));
      // $selectedItemHash = "";
    }
  });
  $('body').on('click', '.user-hash', function() {
    if(DestinoUser == "Todos") {
      // console.log($(this)[0]);
      let $vecTextMessage = $(`#panelM`).find('.textMessage');
      // $(`#panelM`).find('.textMessage').html($(`#panelM`).find('.textMessage').html() + $(this).find('.name-hash').html()).focus();
      let palabraFragmentada = Array.from($vecTextMessage.html());
        let contadorHash = 0;
        for(let i=0; i<palabraFragmentada.length; i++) {
          if(palabraFragmentada[i] === "@") {
            contadorHash++;
          }
        }
      if(contadorHash == 1 && $vecTextMessage.html().substr(0,1) == '@') {
        $vecTextMessage.html($vecTextMessage.html().replace($vecTextMessage.html(),`
        &nbsp;<a contenteditable="false" class="mention-user userLink" data-user-id="${$(this).attr('data-key-id')}">@${$(this).find('.name-hash').html()}</a>
      `.allTrim()));
        $vecTextMessage.append('&nbsp;');
        $('.hashUser').addClass('d-none');
        $('.content-hash').html('');
        // $selectedItemHash = "";
        placeCaretAtEnd($vecTextMessage.get(0));
        return;
      }
      let indexSearch = $vecTextMessage.html().lastIndexOf('@'+$vecTextMessage.html().split("@").pop());
      $vecTextMessage.html($vecTextMessage.html().replaceLast($vecTextMessage.html().substr(indexSearch,$vecTextMessage.html().length-1), `
          <a contenteditable="false" class="mention-user userLink" data-user-id="${$(this).attr('data-key-id')}">@${$(this).find('.name-hash').html()}</a>
        `.allTrim())).focus();
        $vecTextMessage.append('&nbsp;');
        placeCaretAtEnd($vecTextMessage.get(0));
        $('.hashUser').addClass('d-none');
        $('.content-hash').html('');
        // $selectedItemHash = "";
    }
  });
  let $selectedItemHash = "";
  $('.components-message').on('keydown','.textMessage', function(e) {
    
    var max = 3000;
       if (e.which != 8 && $(this).text().length > max) {
           e.preventDefault();
       }
    // console.log(e.keyCode);
    if(e.key === "Escape") {
      e.preventDefault();
      $('.hashUser').addClass('d-none');
      $('.content-hash').html('');
      return;
    }
    if(e.keyCode == 38) { //UP
      e.preventDefault();
      if($(`.selectedHash`)[0]) {
        // let $prevHash = $('.selectedHash').prev();
        // if($prevHash[0]) {
        //   $('.user-hash').removeClass('.selectedHash');
        //   $prevHash.addClass('selectedHash');
        //   $selectedItemHash = $prevHash;
        //   console.log($selectedItemHash[0]);
        // }
        let prevHash = document.querySelector('.selectedHash').dataset.keyHash;
        let $prevElHash = $('.selectedHash').prev();
        let newIndex = parseInt(prevHash) - 1;
        if($prevElHash[0]) {
          // console.log($(`[data-key-hash="${newIndex}"]`)[0]);
          // $('.user-hash').removeClass('selectedHash');
          $('.selectedHash').removeClass('selectedHash');
          $prevElHash.addClass('selectedHash');
          // $(`[data-key-hash="${newIndex}"]`).addClass('selectedHash');
          // $selectedItemHash = $(`[data-key-hash="${newIndex}"]`);
        }
        
      }
    }
    if(e.keyCode == 40) { //DOWN
      e.preventDefault();
      if($(`.selectedHash`)[0]) {
        // let $nexHash = $('.selectedHash').next();
        // if($nexHash[0]) {
        //   $('.user-hash').removeClass('.selectedHash');
        //   $nexHash.addClass('selectedHash');
        //   $selectedItemHash = $nexHash;
        //   console.log($selectedItemHash[0]);
        // }
        let prevHash = document.querySelector('.selectedHash').dataset.keyHash;
        let $nextElHash = $('.selectedHash').next();
        let newIndex = parseInt(prevHash) + 1;
        if($nextElHash[0]) {
          // console.log($(`[data-key-hash="${newIndex}"]`)[0]);
          // $('.user-hash').removeClass('selectedHash');
          $('.selectedHash').removeClass('selectedHash');
          $nextElHash.addClass('selectedHash');
          // $(`[data-key-hash="${newIndex}"]`).addClass('selectedHash');
          // $selectedItemHash = $(`[data-key-hash="${newIndex}"]`);
        }
      }
    }
    if(e.keyCode == 13) {
      e.preventDefault();
      if($(this).html() == '') return;
      // console.log($(this).val().charAt($(this).val().length-1));
      if(!$('.hashUser').hasClass('d-none')) 
      {
        let addSelectedHash = $('.selectedHash').find('.name-hash').html();
        let palabraFragmentada = Array.from($(this).html());
        let contadorHash = 0;
        for(let i=0; i<palabraFragmentada.length; i++) {
          if(palabraFragmentada[i] === "@") {
            contadorHash++;
          }
        }
        if(contadorHash == 1 && $(this).html().substr(0,1) == '@') {
          $(this).html($(this).html().replace($(this).html(),`
          &nbsp;<a contenteditable="false" class="mention-user userLink" data-user-id="${$('.selectedHash').attr('data-key-id')}">@${addSelectedHash}</a>
        `.allTrim()));
         
          $(this).append('&nbsp;');
          $('.hashUser').addClass('d-none');
          $('.content-hash').html('');
          // $selectedItemHash = "";
          placeCaretAtEnd($(this).get(0));
          return;
        }
        // console.log($(this).text().split("@").pop());
        let indexSearch = $(this).html().lastIndexOf('@'+$(this).html().split("@").pop());
        $(this).html($(this).html().replaceLast($(this).html().substr(indexSearch,$(this).html().length-1), `
          <a contenteditable="false" class="mention-user userLink" data-user-id="${$('.selectedHash').attr('data-key-id')}">@${addSelectedHash}</a>
        `.allTrim()));
        // $(this).focus();
        $(this).append('&nbsp;');
        $('.hashUser').addClass('d-none');
        $('.content-hash').html('');
        // $selectedItemHash = "";
        placeCaretAtEnd($(this).get(0));
        return;
      }
      let elementMessage = e.currentTarget.parentElement;
      sendMessage(socket, elementMessage);
      $(this).text('');
    }
  });
  function placeCaretAtEnd(el) {
    el.focus();
    if (typeof window.getSelection != "undefined"
            && typeof document.createRange != "undefined") {
        var range = document.createRange();
        range.selectNodeContents(el);
        range.collapse(false);
        var sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
    } else if (typeof document.body.createTextRange != "undefined") {
        var textRange = document.body.createTextRange();
        textRange.moveToElementText(el);
        textRange.collapse(false);
        textRange.select();
    }
}
  String.prototype.replaceLast = function (what, replacement) {
    var pcs = this.split(what);
    var lastPc = pcs.pop();
    return pcs.join(what) + replacement + lastPc;
};
var textArray = [];
  
function deployText(){
  // create an array to store all text in
  var textToAdd = 'let\'s go ahead and add some more text'; // random text to add to array, could be variable
  var textarea = $('.textMessage');
  var origValue = textarea.text();
  textArray.push(origValue); //push original text to array


  //if ctrl-z is pressed run function
  $(document).on('keypress', function(e){
    var zKey = 26;
    if(e.ctrlKey && e.which === zKey){
      removePreviousText();
    }
  })
   
  //remove last item of array and apply it to textarea
  function removePreviousText(){
    if(textArray.length > 1){
      textArray.pop();
      $('.textMessage').text(textArray);
    }
  }
}
deployText()
  document.addEventListener("paste", function(e){
    if(e.target.classList.contains('textMessage')) {
      console.log("paste handler");
      var s = e.clipboardData.getData("text/plain").replace("this", "that")
      console.log(s);
      // let $pruebaVec = $(`<div>${s}</div>`).text();
      let $pruebaVec;
      let newDiv = document.createElement('div');
      // newDiv.outerHTML = s;
      var codigo = new DOMParser();
      // var oDOM = codigo.parseFromString(s, "text/plain");
      // $pruebaVec = newDiv.outerHTML.replace(/\n/g, ' ');
      // $pruebaVec=s.replace(new RegExp(s,"g") ,`"'${s}'"`);
      $pruebaVec = s.replace(/</g, '"<"');
      // $pruebaVec = s;
      
      // console.log($pruebaVec.split('\n'));
      // console.log($pruebaVec, newDiv.innerHTML);
      // if($pruebaVec.length > 3000) {
      //   $pruebaVec = $pruebaVec.substr(0, 3000);
      // }
      // console.log($pruebaVec.substr(0, 3000), $pruebaVec.length);
      // document.execCommand("insertText", true, $pruebaVec);
      // document.execCommand("inserHTML", false, $pruebaVec);
      // document.execCommand("insertImage", false, $pruebaVec);
      textArray.push($pruebaVec);
      if(DestinoUser == "Todos") {
        $(`#panelM`).find('.textMessage').html($('#panelM').find('.textMessage').html() + $pruebaVec);
        $('#panelM').find('.textMessage').scrollTop($('#panelM').find('.textMessage').prop('scrollHeight'));
        placeCaretAtEnd($('#panelM').find('.textMessage').get(0));
      } else {
        $(`#panelM${DestinoUser}`).find('.textMessage').html($(`#panelM${DestinoUser}`).find('.textMessage').html() + $pruebaVec);
        $(`#panelM${DestinoUser}`).find('.textMessage').scrollTop($(`#panelM${DestinoUser}`).find('.textMessage').prop('scrollHeight'));
        placeCaretAtEnd($(`#panelM${DestinoUser}`).find('.textMessage').get(0));
      }
      
      
      e.preventDefault();
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
    if($(this).html() == '&nbsp;') {
      $(this).html('');
    }
    $(this).parent($('.focus-message')).css({
      'display': 'flex',
      'border': '1px solid rgb(184, 179, 179)',
      'box-shadow': 'none',
      'width': '100%'
    });
  });

  $('body').on('click', '.wrapper_stickers', function() {
    $('.selectedStickHead').removeClass('selectedStickHead');
    $(this).addClass('selectedStickHead');
  });

  componentsMessage.addEventListener('click', e => {
    // console.log(e.currentTarget);
    if(e.target.classList.contains('btnEnvio')) {
      let elementMessage = e.target.parentElement;
      if($(elementMessage).find('.textMessage').text() == '') return;
      let elementContainer = e.target.parentElement.parentElement.parentElement.parentElement;
      sendMessage(socket, elementMessage);
      $(elementMessage).find('.textMessage').text('').focus();
    }
    if(e.target.classList.contains('fa-paper-plane')) {
      let elementMessage = e.target.parentElement.parentElement;
      if($(elementMessage).find('.textMessage').text() == '') return;
      let elementContainer = e.target.parentElement.parentElement.parentElement.parentElement.parentElement;
      sendMessage(socket, elementMessage);
      $(elementMessage).find('.textMessage').text('').focus();
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
      if(e.target.classList.contains('imgStickerPrivate')) {
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
      if(e.target.classList.contains('check1')) {
        if($(e.target).attr('bd-list-viewed')) {
          let vecTarget = JSON.parse($(e.target).attr('bd-list-viewed'));
          // console.log(vecTarget, 'Object Viewed');
          let html = "";
          vecTarget.forEach((v) => {
            html += `
             <div class="user-viewed" data-key-user="${v.user}">
              <img class="img-viewed message${v.user}" src="${v.foto}">
              <label class="name-viewed">${v.name}</label>
             </div>
            `;
          });
          $('.content-viewed').html(html);
        } else {
          if(e.target.dataset.toggle) {
            $('.content-viewed').html(`<label class="name-viewed empty-viewed">Nadie aún</label>`);
          } 
        }
        clickedViewed = e.target;
        // let index = $(e.target).index();
        // console.log($(e.target)[0], $(e.target).index());
        // $('.content-viewed').attr('data-keys-viewed', index);
      }
      if(e.target.classList.contains('icon-ready')) {
        if($(e.target.parentElement).attr('bd-list-viewed')) {
          let vecTarget = JSON.parse($(e.target.parentElement).attr('bd-list-viewed'));
          // console.log(vecTarget, 'Object Viewed');
          let html = "";
          vecTarget.forEach((v) => {
            html += `
             <div class="user-viewed" data-key-user="${v.user}">
              <img class="img-viewed message${v.user}" src="${v.foto}">
              <label class="name-viewed">${v.name}</label>
             </div>
            `;
          });
          $('.content-viewed').html(html);
        } else {
          if(e.target.parentElement.dataset.toggle) {
            $('.content-viewed').html(`<label class="name-viewed empty-viewed">Nadie aún</label>`);
          } 
        }
        clickedViewed = e.target.parentElement;
        // let index = $(e.target.parentElement).index();
        // console.log($(e.target.parentElement)[0], $(e.target.parentElement).index());
        // $('.content-viewed').attr('data-keys-viewed', index);
      }
  });
  let clickedViewed = "";
  let backEffectColor = "rgb(70, 70, 70)";
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
        $(`#panelM`).find('.textMessage').focus();
        DestinoUser = "Todos";
      } else {
        $(`#panelM${responseId}`).removeClass('d-none');
        scrollDown($(`#panelM${responseId}`).find('.card-message'));
        $(`#panelM${responseId}`).find('.textMessage').focus();
        DestinoUser = responseId;
      }  
      if($(`#${DestinoUser}`).find('.identMessage:last')[0]) {
        let userDirect = $(`#${DestinoUser}`).find('.identMessage:last').prop('id').replace('mensaje','');
        // let nameDirect = $(`#${DestinoUser}`).find('.nom-user-message:last').text();
        // let fotoDirect = $(`#${DestinoUser}`).find('.imguser:last').prop('src');
        
        // console.log(userDirect);
        if(DestinoUser == "Todos") {
          socket.emit('sendViewed', {
            user: userDirect,
            name: sessionStorage.name,
            foto: sessionStorage.foto,
            destino: DestinoUser,
            userEmit: sessionStorage.user,
            sessionId: sessionId
          });
        } else {
          socket.emit('sendViewed', {
            user: userDirect,
            name: sessionStorage.name,
            foto: sessionStorage.foto,
            destino: sessionStorage.user,
            userEmit: sessionStorage.user,
            sessionId: sessionId
          });
        }
        // if(userDirect != sessionStorage.user) {
          
        // }
      }
      
  });
  // document.body.addEventListener('click', e => {
  //   let $emojiwrapper = $('.stickersGroudPanel');
  //     // console.log('asfas');
  //     if ($(e.target) != $emojiwrapper && !e.target.classList.contains('imgStickerPrivate ') && !$emojiwrapper.hasClass('d-none') && !e.target.classList.contains('btnStickers') && !e.target.classList.contains('fa-sticky-note')) {
  //       // console.log('asfas');
  //         $emojiwrapper.addClass('d-none');
  //         // resizePage();
  //     } 
      
  // });
  $(document).on("click.stickersGroudPanel",function(event) {
    var target = $(event.target);   
    // console.log($('.grab_audio').hasClass('d-none'));
    if(!$('.stickersGroudPanel').hasClass('d-none')) {
      if (!target.closest(".stickersGroudPanel").length && !target.closest(".btnStickers").length) {
        // closeMenu(function() {
        //     $(document).off("click.grab_audio");
        // });
        $('.stickersGroudPanel').addClass('d-none');
        resizePage();
      }      
    }
  }); 

  function isUrl(s) {   
    var regexp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/
    return regexp.test(s);
  }
  String.prototype.allTrim = String.prototype.allTrim ||
  function(){
     return this.replace(/\s+/g,' ')
                .replace(/^\s+|\s+$/,'');
  };
  let DestinoUser = "Todos";
  function sendMessage(socket, elementMessage) {
    let message = $(elementMessage).find('.textMessage').html();
    // console.log(message);
    let destino_user = DestinoUser;
    // console.log(DestinoUser);
    // $('.panel-message').each(function() {
    //   if(!$(this).hasClass('d-none')) {
    //     destino_user = $(this).find('.container-destino').find('input').val();
    //   }
    // });
    // if(!message.includes('class="mention-user"')) {
     
    //   //.replace(/</g, '<&').replace(/>/g, '>&')
    // } else {
    //   // message = message.replace(/&nbsp;/g,'').replace(/\n/g,'').replace(/^\s+|\s+$/g, "").trim();
    // }
    message = message.replace(/[[]/g, '{').replace(/]/g, '}');
    message = message.replace(/&nbsp;/g,'').allTrim();
    //.split(" ").join("")
    let vecUrl = message.split(' ');
    let almacenador = "";
    vecUrl.forEach(element => {
      //console.log(isUrl(element), element);
      //console.log(element.substr(element.length-4, element.length-1));
    if(element.substr(element.length-4, element.length-1) == '.com' || element.substr(element.length-7, element.length-1) == '.com.pe') {
        almacenador+=` <a target="_blank" class="userLink" href="https://${element}">${element}</a>`
      } else {
        if(isUrl(element)) {
          almacenador+=` <a target="_blank" class="userLink" href="${element}">${element}</a>`
        } else {
          almacenador+=" "+element;
        }
      }
      
    });
    if(vecUrl.length) {
      message = almacenador.trim();
    }
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
    resizePage();
    $element.scrollTop($element.prop('scrollHeight'));
    // console.log($element[0]);
    // console.log($element[0]);
  }
  let compThis, classThis;
  let controlfocusmessage = true;
  $(window).blur(function() {
    controlfocusmessage = false;
  });
  $(window).focus(function() {
    controlfocusmessage = true;
    if($(`#${DestinoUser}`).find('.identMessage:last')[0]) {
      let userDirect = $(`#${DestinoUser}`).find('.identMessage:last').prop('id').replace('mensaje','');
      // let nameDirect = $(`#${DestinoUser}`).find('.nom-user-message:last').text();
      // let fotoDirect = $(`#${DestinoUser}`).find('.imguser:last').prop('src');
      // console.log(userDirect);
      // if(userDirect != sessionStorage.user) {
        if(DestinoUser == "Todos") {
          socket.emit('sendViewed', {
            user: userDirect,
            name: sessionStorage.name,
            foto: sessionStorage.foto,
            destino: DestinoUser,
            userEmit: sessionStorage.user,
            sessionId: sessionId
          });
        } else {
          socket.emit('sendViewed', {
            user: userDirect,
            name: sessionStorage.name,
            foto: sessionStorage.foto,
            destino: sessionStorage.user,
            userEmit: sessionStorage.user,
            sessionId: sessionId
          });
        }
      // }
    }  
  });
  var textobusq = "";
var textorempl = "";
var textolisto = "";

//Recoge el texto que se desea buscar para su posterior remplazo
// function find(textobusq){
//     return  textobusq;
// }

// function STRTemp(textobusq, textorempl, textremp){
//     //Recoge el texto con el que se desea remplazar
    
//     /*en el replace, no se pueden poner variables directamente, 
//      * si se desea remplazar todas las ocurrencias de golpe,
//      *  en replace debes hacer lo siguiente:*/
    
//     textolisto = textremp.replace(new RegExp(find(textobusq),"g") ,textorempl);
//     return  textolisto;
   
// }
// function replace(textobusq, textorempl, textResult){
//   //Comprueba que hay texto en las casillas
//     if (find(textobusq).length == 0) {
//         alert("No hay palabra para buscar");
//     } else {
        
//       // var textremp = document.getElementById("tremp").value;
        
//             if (textResult.search(find(textobusq)) < 0) {
//                 alert("No hay resultados");
//             } else {
//                 return STRTemp(textobusq, textorempl, textResult);
//             }
//     }
// }
  $('body').on('mouseenter', '.user-hash', function() {
    // $('.user-hash').removeClass('selectedHash');
    $('.selectedHash').removeClass('selectedHash');
    $(this).addClass('selectedHash');
  });
  $('body').on('click', '.redirect-user-mention', function() {
    if(this.dataset.userId != sessionStorage.user) {
      if($(`#user${this.dataset.userId}`)[0]) {
         // console.log(this.dataset.userId);
        if(!$(`#${this.dataset.userId}`)[0]) {
          DestinoUser = addPanelMessage(this.dataset.userId, $(this).text().replace('@', ''), true);
        }
        // console.log($(`#panelM${this.dataset.userId}`)[0]);
        $(`#userhistory${this.dataset.userId}`).click();
      }
      if($(`#${this.dataset.userId}`)[0]) {
        $(`#userhistory${this.dataset.userId}`).click();
      }
    }
    
    
  });
  let soundMentionMe = document.querySelector('.soundMentionMe');
  function addSoundMentionMe() {
    soundMentionMe.play();
  }
  $('body').on('click', '.imgFileUpload', function() {
    $('.imgViewUpload').prop('src', $(this).prop('src'));
    $('.imgViewUpload').attr('data-title', $(this).attr('data-title'));
    let infoUser = dataUserGlobal.find((v) => v.user == $(this).parent().parent().parent().prop('id').replace('mensaje', ''));
    $('.info-img-view').find('img').prop('src', infoUser.foto);
    $('.name-info-img').text(infoUser.name);
    let horaMsg = $(this).parent().parent().parent().find('.hora').text();
    $('.hora-info-img').text(horaMsg);
    $('.panel-view-img-file').removeClass('d-none');
    $('.imgViewUpload').removeClass('d-none');
  });

  $('.closeViewImg').on('click', function() {
    $('.panel-view-img-file').addClass('d-none');
    $('.imgViewUpload').addClass('d-none');
  });

  if(noMobileAct) {
    $('.zoom').click(function() {
      $(this).toggleClass('transition');
    });
  }


  $('.downloadViewImg').on('click', function() {
    let a = document.createElement('a');
    a.download = $('.imgViewUpload').attr('data-title');
    a.href = $('.imgViewUpload').prop('src');
    a.click();
  });

  let activeReprodAud = false;

  function findResponseMessage(socket) {
    socket.on('getMessage', async (data) => {
      let veriUrlFile = false;
      if(data.message == '') {
        
        veriUrlFile = true;
        let extName = data.fileName.split('.').pop();
        // let fileUrl = "";
        // if(sessionStorage.user == data.user) {
        //   await toDataUrl(data.file, function(myBase64) {
        //     data.file = myBase64; // myBase64 is the base64 string
        //   });
        // } else {
        //   await toDataUrl(data.file, function(myBase64) {
        //     data.file = myBase64; // myBase64 is the base64 string
        //   });
        // }
        
        let file = await fetch(data.file);
        let blobFile = await file.blob();
        if(sessionStorage.user == data.user) {
          let response = await fetch(`/removeFile/${data.file.replace('/upload/', '')}`);
          let res = await response.text();
          console.log(res);
        }
        // let blobFile = b64toBlob(data.file, extName);
        // let newFile = URL.createObjectURL(data.file);
        let newUrl = URL.createObjectURL(blobFile);
        // console.log(newUrl);
        if(data.comment == undefined) {
          data.message = `<a href="${newUrl}" download="${data.fileName}" class="userLink download-file">
            <div class="align-file-msg content-download-file-msg">
             <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADMAAAA8CAYAAADL94L/AAAByElEQVR4Ae3axdJTQRAFYFyegA3u8ALseCDcicsGhxt3x+G32BXc3X3NBnfXYTqp3sZlhuqpOlXZRL46He9ReJyJxGSTEreaPfEHZiX+1uSJvelVNu+Jvjd7Yk9zI8aSUe0eDpjCIYfNSuw5v/zF5In/6mU27478tXriLJvXjdSwPq1lCDTCmxjiCNav8GZYBVMwWKagX8kWjk9vCcMhYWhEFEw1+oV0wZjdPKY6Vn9EwmBDTYPwBoXCYPLGDQTJjkHQNQRJj0FQtmgs+C8wOHIIkh2DoDu5vD5Xfkz9hsTBWDyxhjDYUDqvLRYSY1JilSQGyyxXOt4QKJPX70NDQmI27gyxHcn9bH/5RFMNAUgoDI4afOAMHBiCdiDNj5woGAhgsCEYudSI1lBCRwoPL957slAoDDYEoPXb/ZVs3FE/y9072fDxsx4BMPVfGOpl1VY/y5++4EWM1Fm9LcCKpy8RpnchDGEIQxjCEIYwhCEMYQhDGMIQhjCEIQxhCEMYwhCGMIQhDGEIQxhYNlXiP+XHXLRDM5thQVpyzIfS2YtLceVEkRmzalsgMArPhp258bA6b/LEb8LqPM930VNdvY/fhMmCxw+Of+4BTcPInBo2AAAAAElFTkSuQmCC" class="imgFileMsg mr-2 d-inline"><nav class="name-file-msg-download d-inline">${data.fileName}</nav>
              <span class="icon-download-file">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 34 34" width="34" height="34"><path fill="currentColor" d="M17 2c8.3 0 15 6.7 15 15s-6.7 15-15 15S2 25.3 2 17 8.7 2 17 2m0-1C8.2 1 1 8.2 1 17s7.2 16 16 16 16-7.2 16-16S25.8 1 17 1z"></path><path fill="currentColor" d="M22.4 17.5h-3.2v-6.8c0-.4-.3-.7-.7-.7h-3.2c-.4 0-.7.3-.7.7v6.8h-3.2c-.6 0-.8.4-.4.8l5 5.3c.5.7 1 .5 1.5 0l5-5.3c.7-.5.5-.8-.1-.8z"></path></svg>
              </span>
            </div>
            </a>`;
        } else {
          if(data.typeFile == 'image') {
            if(data.comment == "") {
              data.message = `<img data-title="${data.fileName}" src="${newUrl}" class="imgFileUpload">`;
            } else {
              data.message = `<img data-title="${data.fileName}" src="${newUrl}" class="imgFileUpload">
            <div class="comment-img-file">${data.comment}</div>`;
            }
          } else if(data.typeFile == 'video') {
            if(data.comment == "") {
              data.message = `<video data-title="${data.fileName}" src="${newUrl}" class="videoFileUpload" controls download="${data.fileName}"></video>`;
            } else {
              data.message = `<video data-title="${data.fileName}" src="${newUrl}" class="videoFileUpload" controls download="${data.fileName}"></video>
            <div class="comment-img-file">${data.comment}</div>`;
            }
          } else if(data.typeFile == 'audio') {
            if(data.comment == "") {
              data.message = `<audio data-title="${data.fileName}" src="${newUrl}" class="audioFileUpload" controls download="${data.fileName}"></audio>`;
            } else {
              data.message = `<audio data-title="${data.fileName}" src="${newUrl}" class="audioFileUpload" controls download="${data.fileName}"></audio>
            <div class="comment-img-file">${data.comment}</div>`;
            }
            // if(data.comment == "") {
            //   data.message = `<video data-title="${data.fileName}" width="340" height="50" class="audioFileUpload" controls download="${data.fileName}">
            //   <source src="${newUrl}"></source>
            //   </video>`;
            // } else {
            //   data.message = `<video data-title="${data.fileName}" width="340" height="50" class="audioFileUpload" controls download="${data.fileName}">
            //   <source src="${newUrl}"></source>
            //   </video>
            // <div class="comment-img-file">${data.comment}</div>`;
            // }
          }
          
          //controlsList="nodownload"
        }
        
        // URL.revokeObjectURL(newUrl);
        if(sessionStorage.user == data.user) {
          $('.panel-files-content').find('.btnSendFile').remove();
          var div = $(".panel-files-content");

          var height = div.css({
              display: "block"
          }).height();

          div.css({
              overflow: "hidden",
              marginTop: 0,
              height: height
          }).animate({
              marginTop: height,
              height: 0
          }, 180, function () {
            $('.panel-files-content').remove();
            $('#file-upload-msg,#multimedia-upload-msg,#video-upload-msg,#audio-upload-msg').val(null);
          });
          // $('.panel-files-content').remove();
        }
      }
      loadingState = false;
      // console.log(data.message);
      data.message = data.message.replace(/class="mention-user userLink"/g, 'class="mention-user userLink redirect-user-mention"');
      if(data.message.includes(`data-user-id="${sessionStorage.user}"`)) {
        addSoundMentionMe();
      }
      // console.log(data.message.includes(`data-key-id="${sessionStorage.user}"`), data.message, `data-key-id="${sessionStorage.user}"`);
      // console.log(replace('class="mention-user"', 'class="user-data-mention"', data.message));
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
        let file = await fetch(`${audioRex}`);
        let blobFile = await file.blob();
        let newUrl = URL.createObjectURL(blobFile);
        if(sessionStorage.user == data.user) {
          let response = await fetch(`/removeAudio/${audioRex.replace('/upload/', '')}`);
          let res = await response.text();
          console.log(res);
        }
        data.message = `<video width="340" height="50" controls>
          <source src="${newUrl}" type="video/webm" />
        </video>`;
      }
      if(data.message.includes('[sticker:') && data.message.includes(']')) {
        if(!data.message.includes('STK-')) {
          let imgRex = data.message.replace('[sticker:', '').replace(']', '');
          data.message = `<img class="emoji" src="/img/emoji/${imgRex}.gif" />`;
        } else {
          let imgRex = data.message.replace('[sticker:', '').replace(']', '');
          data.message = `<img class="emoji" src="https://cotitomaster.000webhostapp.com/WhatsAppStickers/${imgRex}.webp" />`;
        }
        
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
          chatarea.offsetHeight + chatarea.scrollTop+20 >= chatarea.scrollHeight || chatarea.offsetHeight + chatarea.scrollTop == chatarea.scrollHeight) {
          confirmador = true;
      } else {
          confirmador = false;
      }
      // console.log(chatarea.offsetHeight + chatarea.scrollTop, chatarea.scrollHeight, confirmador);
      var dateTime = moment().format("hh:mm a").toUpperCase();
      let decisiveUserMessage = 'mymessage';
      
      let decisiveViewedMessage = ``;
      if(sessionStorage.user == data.user) {
        if(data.destino == "Todos") {
          decisiveViewedMessage = `<label id="check1" class="check1" data-toggle="modal" data-target="#modalViewedUser"><i class="fas fa-check-double icon-ready"></i></label>`;
        } else {
          decisiveViewedMessage = `<label id="check1" class="check1"><i class="fas fa-check-double icon-ready"></i></label>`
        }
      }
      else if(sessionStorage.user != data.user) {
        decisiveUserMessage = 'othermessage';
        decisiveViewedMessage = '';
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
            if(data.message.includes('class="mention-user') || data.message.includes('class="userLink"')) {
              $(`.${data.user}`).find('.contenidomessagenofocus').html(data.message);
             }
            else if(veriUrlFile) {
              $(`.${data.user}`).find('.contenidomessagenofocus').html(`<i class="far fa-file"></i> Ha enviado un archivo adjuntado.`);
            }
             else {
              $(`.${data.user}`).find('.contenidomessagenofocus').text(data.message);
             }
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
              <div class="res-message spacingSection">${data.message}</div> 
            </div><div class="horamessage">
              <small class="hora">${dateTime}</small>
            </div>
            ${decisiveViewedMessage}
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
            <div class="res-message">${data.message}</div>
            
            </div><div class="horamessage">
                <small class="hora">${dateTime}</small>
            </div>
            ${decisiveViewedMessage}
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
             if(data.message.includes('class="mention-user') || data.message.includes('class="userLink"')) {
              $(`.${data.destino}`).find('.contenidomessagenofocus').html(data.message);
             }
             else if(veriUrlFile) {
              $(`.${data.destino}`).find('.contenidomessagenofocus').html(`<i class="far fa-file"></i> Ha enviado un archivo adjuntado.`);
            }
             else {
              $(`.${data.destino}`).find('.contenidomessagenofocus').text(data.message);
             }
            
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
              <div class="res-message spacingSection">${data.message}</div> 
            </div><div class="horamessage">
              <small class="hora">${dateTime}</small>
            </div>
            ${decisiveViewedMessage}
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
          <div class="res-message">${data.message}</div>
          
          </div><div class="horamessage">
              <small class="hora">${dateTime}</small>
          </div>
          ${decisiveViewedMessage}
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
      if(!activeReprodAud) {
        if(confirmador || sessionStorage.user == data.user) {

          if(veriUrlFile || data.message.includes('<img')) {
            setTimeout(() => scrollDown($(chatarea)), 300);
          } else {
            scrollDown($(chatarea));
          }
        }
      }
      
      if(sessionStorage.user == data.user) {
          $('video,audio:not(.soundChat,.soundMentionMe)').on('play', function() {
            // alert('Play');
            activeReprodAud = true;
          });
          $('video,audio:not(.soundChat,.soundMentionMe)').bind('ended', function() {
            activeReprodAud = false;
          });
          $('video,audio:not(.soundChat,.soundMentionMe)').on('pause', function() {
            activeReprodAud = false;
          });
      }
      // Notificar mensaje
      if(!controlfocusmessage && sessionStorage.user != data.user) {
        //"Tienes un mensaje nuevo."
        notifyMe(data.message, data.name, data.user);
      }
      if(sessionStorage.user != data.user) {
        if(controlfocusmessage) {
          if(!$(`#content-message`).hasClass('d-none')) {
            if(data.destino == "Todos") {
              if(!$(`#${data.destino}`).parent().parent().hasClass('d-none')) {
                // console.log(data.destino, $(`#${data.destino}`)[0], $(`#${data.user}`)[0]);
                  // Vistear mensaje
                // console.log('En visto');
                socket.emit('sendViewed', {
                  user: data.user,
                  name: sessionStorage.name,
                  foto: sessionStorage.foto,
                  destino: data.destino,
                  userEmit: sessionStorage.user,
                  sessionId: sessionId
                });
              }
            } else {
              if(!$(`#${data.user}`).parent().parent().hasClass('d-none')) {
                // console.log(data.destino, $(`#${data.destino}`)[0], $(`#${data.user}`)[0]);
                  // Vistear mensaje
                // console.log('En visto');
                socket.emit('sendViewed', {
                  user: data.user,
                  name: sessionStorage.name,
                  foto: sessionStorage.foto,
                  destino: data.destino,
                  userEmit: sessionStorage.user,
                  sessionId: sessionId
                });
              }
            }
            
            // else if (!$(`#${data.user}`).hasClass('d-none')) {
            //   socket.emit('sendViewed', {
            //     user: data.user,
            //     name: data.name,
            //     foto: data.foto,
            //     destino: data.user,
            //     sessionId: sessionId
            //   });
            // }
        }
        }
      }
    });
  }
  socket.on('getViewed', getViewedUsers);

  

  function getViewedUsers(data) {
    // console.log(data);
    let vecDataViewed = [];
    // let contViewed = $(`#${data.destino}`).find('.check1').count();
    let contControl = 0;
    $(`#${data.destino}`).find('.check1').each(function() {
      if(data.destino == "Todos") {
        vecDataViewed = $(this).attr('bd-list-viewed') || [];
        if($(this).attr('bd-list-viewed')) {
          vecDataViewed = JSON.parse($(this).attr('bd-list-viewed')) || [];
        }
        let veriAddViewed = vecDataViewed.find((v) => v.user==data.userEmit);
        // console.log(veriAddViewed);
        
        if(veriAddViewed) return;
        contControl++;
        let idUserViewed = document.querySelector(`[data-key-user="${vecDataViewed.user}"]`);
        // console.log(idUserViewed);
        if(clickedViewed == this || clickedViewed == "") {
          if(!idUserViewed) {
            if(contControl<=1) {
              $('.empty-viewed').remove();
              $('.content-viewed').append(`
                <div class="user-viewed">
                  <img class="img-viewed message${data.userEmit}" src="${data.foto}">
                  <label class="name-viewed">${data.name}</label>
                 </div>
             `);
            }  
          }
        }
        
          
        
        
        vecDataViewed.push({
          // key: contViewed,
          user: data.userEmit,
          name: data.name,
          foto: data.foto
        });
        $(this).attr('bd-list-viewed', JSON.stringify(vecDataViewed));
      }
      if(!this.dataset.viewed) {
        $(this).find('.icon-ready').attr('style', `color: purple !important;`);
        this.dataset.viewed = 'viewed';
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

  if(isMobile()) {
    $('.tiptextCustom').remove();
  }

  findResponseMessage(socket);
  function addPanelMessage(idOtherUser, nameOtherUser, data) {
    let veriEmojis = '<button class="btn btn-primary btnEmojis emoji_01 btnMessageIcons"><i class="fa fa-smile-o" aria-hidden="true"></i></button>';
    if(isMobile()) {
      veriEmojis = '';
    } 
    let veriTooltipApodo = ``;
    if(noMobileAct) {
      veriTooltipApodo = `<span class="tiptextCustom">Cambiar Apodo</span>`
    }
    $('.components-message').append(`
          <div class="card panel-message" id="panelM${idOtherUser}">
          <div class="loader-page"></div>
          <img class="loader-imagen" src="/img/material-preloader.gif">
          <div class="container-destino">
            <i class="circle Blink"></i><i class="fas fa-chevron-left btn-prepanel" data-toggle="tooltip" data-placement="bottom" title="Panel anterior"></i> <label class="title-destino" id="destinoM${idOtherUser}">${nameOtherUser}</label>
            <input type="hidden" class="selectorUser" value="${idOtherUser}">
            <div class="iconEdit tooltipCustom bottomCustom" data-toggle="modal" data-target="#modalEditNick${idOtherUser}">
            ${veriTooltipApodo}
            <i class="far fa-edit"></i>
            </div>
          </div>
          <div class="card-body card-message">
            <div class="container-message" id="${idOtherUser}">
            </div>
          </div>
          <!--<div class="spaceStickers">
            <div id="emojiWrapper" class="emojiWrapper"></div>
          </div>-->
          <div class="card-footer">
            <p class="font-weight-light d-none textWarningMsg"><i class="fas fa-info-circle" style="color:rgb(60,60,60)"></i> Acá no hay nadie con quien chatear</p>
            <div class="form-group form-message">
              <div class="focus-message">
                <div contentEditable="true" placeholder="Escriba algo" id="textMessage" class="form-control textMessage" ondrop="return false;" onkeypress="return (this.innerText.length <= 3000)"></div>
                <button class="btn btn-primary btnClip btnMessageIcons">
                  <i class="fas fa-paperclip"></i>
                </button>
                ${veriEmojis}
                <button class="btn btn-primary btnAudio btnMessageIcons"><i class="fas fa-microphone"></i></button>
                <button class="btn btn-primary btnStickers btnMessageIcons"><i class="far fa-sticky-note"></i></button>
                <button class="btn btn-primary btnEnvio btnMessageIcons"><i class="far fa-paper-plane"></i></button>
                <div class="grab_audio d-none" style="">
                  <i class="far fa-check-circle confirmAudio" aria-hidden="true" style=""></i>

                  <div style="">
                    <i
                      class="circle Blink redAudioGrab"
                    ></i
                    ><span id="duracionGrab" class="duracionGrab">00:00:00</span>
                  </div>
                  <i class="far fa-times-circle cancelAudio" aria-hidden="true" style=""></i>
                </div>
                <br> 
              </div>
            </div>
          </div>
        </div>
          `);
        let filterDataUser = dataUserGlobal.find((dato) => dato.user==idOtherUser);
        if(data) {
          let compHistory = "";
            compHistory += `<div class="messageschatnoti ${idOtherUser} waveCustom" data-wave-color="" id="userhistory${idOtherUser}">
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
          .append(`<div class="messageschatnoti ${idOtherUser} waveCustom" data-wave-color="" id="userhistory${idOtherUser}">
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
        if(noMobileAct) {
          $('[data-toggle="tooltip"]').tooltip({
            delay: { "show": 250, "hide": 100 }
          });
          $('[data-toggle="tooltip"]').on('mouseleave', function() {
            $('[data-toggle="tooltip"]').tooltip('hide');
          });
        }
        
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
      if(!$('.popover-body')[0]) {
          if(noMobileAct) {
            e.target.children[0].classList.add('d-none');
          }
          $(e.target).popover('show');
      } else {
          $(e.target).popover('hide');
          $(e.target).popover('dispose');
          if(noMobileAct) {
            e.target.children[0].classList.remove('d-none');
          }
      }
      $(e.target).on('shown.bs.popover', function() {
        $('.popover-body').off('click').on('click',function() {
            
          let idOtherUser = $(e.target).prop('id').replace('popover', '');
          let nameOtherUser = $(e.target.parentElement).find(`#user${idOtherUser}`).text();
          if(!$(`#panelM${idOtherUser}`)[0]) {
            DestinoUser = addPanelMessage(idOtherUser, nameOtherUser, false);
            
          }
            panelUsers.classList.add('d-none');
            panelMessages.classList.remove('d-none');
            // navAll.forEach((nav) => {
            //   if(nav.classList.contains('btnmessage')) {
            //     nav.classList.add('selectedOption');
            //   } else {
            //     nav.classList.remove('selectedOption');
            //   }
            // });
            $('.selectedOption').removeClass('selectedOption');
            navMessages.classList.add('selectedOption');
            $('.panel-message').addClass('d-none');
            // $(`#panelM${idOtherUser}`).removeClass('d-none');
            //$(`#userhistory${idOtherUser}`).click();
            $(`#userhistory${idOtherUser}`).click();
            // console.log($(`#userhistory${idOtherUser}`)[0]);
          // console.log('Clicked Popover', idOtherUser);
        });
      });
      $("[data-toggle='popover']").on('hide.bs.popover', function(){
        popoverGlobalId = "";
      });
    }
    if(e.target.classList.contains('fa-comment-dots')) {
      popoverGlobalId = e.target.parentElement.id;   
      if(!$('.popover-body')[0]) {
          if(noMobileAct) {
            e.target.parentElement.children[0].classList.add('d-none');
          }
          $(e.target.parentElement).popover('show');
      } else {
          $(e.target.parentElement).popover('hide');
          $(e.target.parentElement).popover('dispose');
          if(noMobileAct) {
            e.target.parentElement.children[0].classList.remove('d-none');
          }
      }
      $(e.target.parentElement).on('shown.bs.popover', function() {
        $('.popover-body').off('click').on('click',function() {
          let idOtherUser = $(e.target.parentElement).prop('id').replace('popover', '');
          let nameOtherUser = $(e.target.parentElement.parentElement).find(`#user${idOtherUser}`).text();

          if(!$(`#panelM${idOtherUser}`)[0]) {
            addPanelMessage(idOtherUser, nameOtherUser, false);
           
          }
            panelUsers.classList.add('d-none');
            panelMessages.classList.remove('d-none');
            // navAll.forEach((nav) => {
            //   if(nav.classList.contains('btnmessage')) {
            //     nav.classList.add('selectedOption');
            //   } else {
            //     nav.classList.remove('selectedOption');
            //   }
            // });
            $('.selectedOption').removeClass('selectedOption');
            navMessages.classList.add('selectedOption');
            $('.panel-message').addClass('d-none');
            // $(`#panelM${idOtherUser}`).removeClass('d-none');
            $(`#userhistory${idOtherUser}`).click();
            // console.log($(`#userhistory${idOtherUser}`)[0]);
          // console.log('Clicked Popover', idOtherUser);
        });
      });
      $("[data-toggle='popover']").on('hide.bs.popover', function(){
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
  function renderImage(formData, $file) {
    const file = formData.get('archivo');
    const image = URL.createObjectURL(file);
    $file.setAttribute('src', image);
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
      renderImage(formData, document.querySelector('#imgUserConfig'));
    } else {
      alert("El archivo debe ser una imagen");
    }
  });
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
      // console.log(data.fotoPrevious, $(this).prop('src'));
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
                <span class="myNameUser" id="user${dat.user}">${dat.name}</span>
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
                <span class="otherNameUser" id="user${dat.user}">${dat.name}</span>
              </div>
            </div>
            <button
                  type="button"
                  id="popover${dat.user}"
                  class="popover1 tooltipCustom leftCustom"
                  data-container="body"
                  data-toggle="popover"
                  data-placement="left"
                  data-trigger="click"
                  data-content="Enviar mensaje"
                >
                  <span class="tiptextCustom">Controles de usuario</span>
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
  // _initialEmoji();

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
        <button class="btn float-right btnCambiarApodo text-white" data-toggle="modal" data-target="#modalChangeNick"><i class="fas fa-pencil-alt"></i> Establecer apodo</button>
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
        // console.log(DestinoUser);
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
  $('.btnActivarNoti').click(function() {
      verifyNotiUser(true);
      $(this).attr('disabled', 'disabled');
  });
  function resizePage() {
    
    if ($(window).width() <= 550) {
      if(!$('.stickersGroudPanel').hasClass('d-none')) {
        $(".card-message").css("height", $(window).height() - 525 + "px");
        $(".card-message").css("max-height", $(window).height() - 525 + "px");
      } else {
        $(".card-message").css("height", $(window).height() - 202 + "px");
        $(".card-message").css("max-height", $(window).height() - 202 + "px");
      }
      
      $(".card-users").css("height", $(window).height() - 127 + "px");
      $(".card-users").css("max-height", $(window).height() - 127 + "px");
      $(".card-config").css("height", $(window).height() - 129 + "px");
      $(".card-config").css("max-height", $(window).height() - 129 + "px");
      $(".card-history").css("height", $(window).height() - 62 + "px");
      $(".card-history").css("max-height", $(window).height() - 62 + "px");
    } else {
      if(!$('.stickersGroudPanel').hasClass('d-none')) {
        $(".card-message").css("height", $(window).height() - 561 + "px");
        $(".card-message").css("max-height", $(window).height() - 561 + "px");
      } else {
        $(".card-message").css("height", $(window).height() - 238 + "px");
        $(".card-message").css("max-height", $(window).height() - 238 + "px");
      }
      
      $(".card-users").css("height", $(window).height() - 163 + "px");
      $(".card-users").css("max-height", $(window).height() - 163 + "px");
      $(".card-config").css("height", $(window).height() - 165 + "px");
      $(".card-config").css("max-height", $(window).height() - 165 + "px");
      $(".card-history").css("height", $(window).height() - 98 + "px");
      $(".card-history").css("max-height", $(window).height() - 98 + "px");
    }
    if(DestinoUser == "Todos") {
      resizeClipFiles(document.querySelector(`#panelM`).querySelector('.btnClip'));
    } else {
      resizeClipFiles(document.querySelector(`#panelM${DestinoUser}`).querySelector('.btnClip'));
    }
  }
  $(window).resize(function () {
    resizePage();
  });
  $(window).scroll(function() {
    resizePage();
  });
  resizePage();

  function getMinutesInactive(min) {
    return min * 60000;
  }
  //getMinutesInactive(10)
  function addDetectInactivity() {
    $(document).inactivity( {
      timeout: getMinutesInactive(10), // the timeout until the inactivity event fire [default: 3000]
      mouse: true, // listen for mouse inactivity [default: true]
      keyboard: true, // listen for keyboard inactivity [default: true]
      touch: true, // listen for touch inactivity [default: true]
      customEvents: "", // listen for custom events [default: ""]
      triggerAll: true, // if set to false only the first "activity" event will be fired [default: false]
    });
  }
  
  let soundExitPage = document.querySelector('.soundExitPage');
  $(document).on("inactivity", function(){
    // function that fires on inactivity
    // alert('Logout');
    let timerInterval;
    window.onbeforeunload = () => null;
    Swal.fire({
      title: 'Tu sesión ha expirado',
      html: 'Se te declaro ausente por inactividad<br>Redireccionando...',
      allowOutsideClick:false,
      allowEscapeKey: false,
      timer: 1500,
      timerProgressBar: true,
      onBeforeOpen: () => {
        
        Swal.showLoading()
        timerInterval = setInterval(() => {
          const content = Swal.getContent()
          if (content) {
            const b = content.querySelector('b')
            if (b) {
              b.textContent = Swal.getTimerLeft()
            }
          }
        }, 100)
      },
      onClose: () => {
        clearInterval(timerInterval);
        Swal.fire({
            title:"Redireccionando...",
            allowOutsideClick:false,
            allowEscapeKey: false,
            showConfirmButton: false
          });
          soundExitPage.play();
          $(soundExitPage).bind('ended', function(){
            location.href = '/';
          });          
      }
    });
    
  });
  $(window).on('focus', function() {
    $(document).inactivity("destroy");
    addDetectInactivity();
    // $(window).click();
  });
  addDetectInactivity();
  verifyNotiUser(false);
  function verifyNotiUser(data) {
    if  (!("Notification"  in  window))  {   
      alert("Este navegador no soporta notificaciones de escritorio");  
    }  
    else  if  (Notification.permission  ===  "granted")  {
      $('.btnActivarNoti').prop('disabled', 'disabled');
    }
    else  if  (Notification.permission  !==  'denied')  {
      if(data) {
        Notification.requestPermission(function (permission)  {
          if  (!('permission'  in  Notification))  {
            Notification.permission  =  permission;
          }
          if  (permission  ===  "granted")  {
  
          } else {
            $('.btnActivarNoti').removeAttr('disabled');
          }
          
        });
      } else {
        $('.btnActivarNoti').removeAttr('disabled');
      }     
    }
  }

  function  notifyMe(message, valor, iduser)  {  
    if  (!("Notification"  in  window))  {   
        alert("Este navegador no soporta notificaciones de escritorio");  
    }  
    else  if  (Notification.permission  ===  "granted")  {
      // <video width="340" height="50" controls="">
      //     <source src="/upload/8e4c64bc-26e2-4ce8-adf0-87072e2e5871.webm" type="video/webm">
      //   </video>
      // console.log(message);
        if(message.includes('<img class="emoji" src="')) {
          message = 'Ha enviado un sticker.';
        }
        if(message.includes('<video width="340" height="50" controls>')) {
          message = 'Ha enviado un audio.';
        }
        if(message.includes('<a contenteditable="false" class="mention-user')) {
          message = $(message).text() + message.split('</a>').pop();
        }
        if(message.includes('class="userLink"')) {
          message = $(`<div>${message}</div>`).text();
        }
        if(message.includes('<a href="')) {
          message = $(`<div>${message}</div>`).text();
        }
        var  options  =   {
            body:   message,
            lang: 'ES',
            tag: iduser,
            //tag: 'notificacionmessage'+idnotify,
            icon:   "/img/ventana-de-chat.png",
            dir :   "ltr"//or auto
        };
        if(valor!=undefined&&valor!=null&&valor!=""&&message!=undefined&&message!=null&&message!=""){
        var  notification  =  new  Notification(valor, options);
        // console.log(notification);
        setTimeout(notification.close.bind(notification), 5000); 
        notification.onclick = function(event) {
            //event.preventDefault(); // Previene al buscador de mover el foco a la pestaña del Notification
            // console.log('ADD NOTIFY');
            $(window).focus();
            
            this.close();
          }
        }
    }  
    else  if  (Notification.permission  !==  'denied')  {
        // Notification.requestPermission(function (permission)  {
        //     // if  (!('permission'  in  Notification))  {
        //     //     Notification.permission  =  permission;
        //     // }
        //     if  (permission  ===  "granted")  {
        //         var  options  =   {
        //             body:   valor,
        //             lang: 'ES',
        //             //tag: 'notificacionmessage'+idnotify,
        //             icon:   "images/chat-icon.png",
        //             dir :   "ltr"//or auto
        //         };     
        //         if(valor!=undefined&&valor!=null&&valor!=""&&message!=undefined&&message!=null&&message!=""){
        //         var  notification  =  new  Notification(message, options);
        //         setTimeout(notification.close.bind(notification), 5000);
        //         notification.onclick = function(event) {
        //             //event.preventDefault(); // Previene al buscador de mover el foco a la pestaña del Notification
        //             $(window).focus();
        //             this.close();
        //           }
        //         }
        //     }   
        // });  
    }
}
const init = () => {
  const tieneSoporteUserMedia = () =>
      !!(navigator.mediaDevices.getUserMedia)

  // Si no soporta...
  // Amable aviso para que el mundo comience a usar navegadores decentes ;)
  if (typeof MediaRecorder === "undefined" || !tieneSoporteUserMedia())
      return alert("Tu navegador web no cumple los requisitos; por favor, actualiza a un navegador decente como Firefox o Google Chrome");


  // Declaración de elementos del DOM
  const $listaDeDispositivos = document.querySelector(".listaDeDispositivos"),
      $duracion = document.querySelector(".duracionGrab"),
      $btnComenzarGrabacion = document.querySelector(".btnAudio"),
      $btnDetenerGrabacion = document.querySelector(".confirmAudio"),
      $btnCancelarGrabacion = document.querySelector(".cancelAudio");
      let clickCancel = "";
      let clickGrab = "";

  // Algunas funciones útiles
  const limpiarSelect = () => {
      for (let x = $listaDeDispositivos.options.length - 1; x >= 0; x--) {
          $listaDeDispositivos.options.remove(x);
      }
  }

  const segundosATiempo = numeroDeSegundos => {
      let horas = Math.floor(numeroDeSegundos / 60 / 60);
      numeroDeSegundos -= horas * 60 * 60;
      let minutos = Math.floor(numeroDeSegundos / 60);
      numeroDeSegundos -= minutos * 60;
      numeroDeSegundos = parseInt(numeroDeSegundos);
      if (horas < 10) horas = "0" + horas;
      if (minutos < 10) minutos = "0" + minutos;
      if (numeroDeSegundos < 10) numeroDeSegundos = "0" + numeroDeSegundos;

      return `${horas}:${minutos}:${numeroDeSegundos}`;
  };
  // Variables "globales"
  let tiempoInicio, mediaRecorder, idIntervalo;
  const refrescar = () => {
          clickGrab.textContent = segundosATiempo((Date.now() - tiempoInicio) / 1000);
      }
      // Consulta la lista de dispositivos de entrada de audio y llena el select
  const llenarLista = () => {
      navigator
          .mediaDevices
          .enumerateDevices()
          .then(dispositivos => {
              limpiarSelect();
              dispositivos.forEach((dispositivo, indice) => {
                  if (dispositivo.kind === "audioinput") {
                      const $opcion = document.createElement("option");
                      // Firefox no trae nada con label, que viva la privacidad
                      // y que muera la compatibilidad
                      $opcion.text = dispositivo.label || `Dispositivo ${indice + 1}`;
                      $opcion.value = dispositivo.deviceId;
                      $listaDeDispositivos.appendChild($opcion);
                  }
              })
          })
  };
  // Ayudante para la duración; no ayuda en nada pero muestra algo informativo
  const comenzarAContar = () => {
      tiempoInicio = Date.now();
      idIntervalo = setInterval(refrescar, 500);
  };

  // Comienza a grabar el audio con el dispositivo seleccionado
  const comenzarAGrabar = (e) => {
      if (!$listaDeDispositivos.options.length) return alert("No hay dispositivos");
      // No permitir que se grabe doblemente
      if (mediaRecorder) return alert("Ya se está grabando");
      clickGrab = e.currentTarget.parentElement.querySelector('.duracionGrab');
      
      navigator.mediaDevices.getUserMedia({
              audio: {
                  deviceId: $listaDeDispositivos.value,
              }
          })
          .then(stream => {
            $('.grab_audio').removeClass('d-none');
            $('.btnMessageIcons').hide();
              // Comenzar a grabar con el stream
              mediaRecorder = new MediaRecorder(stream);
              mediaRecorder.start();
              comenzarAContar();
              // En el arreglo pondremos los datos que traiga el evento dataavailable
              const fragmentosDeAudio = [];
              // Escuchar cuando haya datos disponibles
              mediaRecorder.addEventListener("dataavailable", evento => {
                  // Y agregarlos a los fragmentos
                  //evento.data.name = 'imageUser';
                  fragmentosDeAudio.push(evento.data);
              });
              // Cuando se detenga (haciendo click en el botón) se ejecuta esto
              mediaRecorder.addEventListener("stop", () => {
                  // Detener el stream
                  stream.getTracks().forEach(track => track.stop());
                  // Detener la cuenta regresiva
                  detenerConteo();
                  // Convertir los fragmentos a un objeto binario
                  
                  if(!clickCancel.contains('confirmAudio')) {
                    clickGrab.textContent = "00:00:00";
                    $('.grab_audio').addClass('d-none');
                    $('.btnMessageIcons').show();
                    return;
                  }
                  const blobAudio = new Blob(fragmentosDeAudio);
                  const formData = new FormData();
                  // Enviar el BinaryLargeObject con FormData
                //   console.log(blobAudio);
                  formData.append("archivo", blobAudio);
              
                  const RUTA_SERVIDOR = location.origin + "/audio";
                  // $duracion.textContent = "00:00:00";
                  fetch(RUTA_SERVIDOR, {
                          method: "POST",
                          body: formData,
                      })
                      .then(respuestaRaw => respuestaRaw.text()) // Decodificar como texto
                      .then(respuestaComoTexto => {
                          // Aquí haz algo con la respuesta ;)
                          console.log("La respuesta: ", respuestaComoTexto);
                          // Abrir el archivo, es opcional y solo lo pongo como demostración
                          let destino_user = DestinoUser;
                            // $('.panel-message').each(function() {
                            //   if(!$(this).hasClass('d-none')) {
                            //     destino_user = $(this).find('.container-destino').find('input').val();
                            //   }
                            // });
                            let URLaudio = `/upload/${respuestaComoTexto}`;
                            socket.emit('sendMessage', {
                                user: sessionStorage.user,
                                name: sessionStorage.name,
                                message: `[audio:${URLaudio}]`,
                                destino: destino_user,
                                sessionId: sessionId,
                                foto: sessionStorage.foto || fotoDefault
                            });
                            clickGrab.textContent = "00:00:00";
                            $('.grab_audio').addClass('d-none');
                            $('.btnMessageIcons').show();
                        //   $duracion.innerHTML = `<strong>Audio subido correctamente.</strong>&nbsp; <a target="_blank" class="identAudio" href="/upload/${respuestaComoTexto}">Abrir</a>`;
                        //   $('.identAudio').show();
                      })
              });
             
          })
          .catch(error => {
              // Aquí maneja el error, tal vez no dieron permiso
              clickGrab.textContent = "00:00:00";
                    $('.grab_audio').addClass('d-none');
                    $('.btnMessageIcons').show();
                    alert(error);
              console.log(error);
          });
  };


  const detenerConteo = () => {
      clearInterval(idIntervalo);
      tiempoInicio = null;
      clickGrab.textContent = "";
  }

  const detenerGrabacion = (e) => {
    // console.log(e.target);
    //   if(!e.currentTarget.classList) return;
      if (!mediaRecorder) return alert("No se está grabando");
      clickCancel = e.currentTarget.classList || e.target.classList;
      mediaRecorder.stop();
      mediaRecorder = null;
  };
  
  $('body').on('click', '.btnAudio', comenzarAGrabar);
  $('body').on('click', '.confirmAudio', detenerGrabacion);
  $('body').on('click', '.cancelAudio', detenerGrabacion);
  $(document).on("click.grab_audio",function(event) {
    var target = $(event.target);   
    // console.log($('.grab_audio').hasClass('d-none'));
    if(!$('.grab_audio').hasClass('d-none')) {
      if (!target.closest(".grab_audio").length) {
        // closeMenu(function() {
        //     $(document).off("click.grab_audio");
        // });
        detenerGrabacion(event);
    }      
    }
  }); 
  // window.addEventListener('click', (e) => {
  //     if(!e.target.classList.contains('confirmAudio') && !e.target.classList.contains('btnAudio')&& !e.target.classList.contains('cancelAudio')) {
  //       detenerGrabacion(e);
  //     }
  // });
  // $btnComenzarGrabacion.addEventListener("click", comenzarAGrabar);
  // $btnDetenerGrabacion.addEventListener("click", detenerGrabacion);
  // $btnCancelarGrabacion.addEventListener("click", detenerGrabacion);
  // Cuando ya hemos configurado lo necesario allá arriba llenamos la lista

  llenarLista();
}
init();
// Esperar a que el documento esté listo...
// document.addEventListener("DOMContentLoaded", init);
async function isUrlFound(url) {
  try {
    const response = await fetch(url, {
      method: "HEAD",
      cache: "no-cache",
    });

    return response.status === 200;
  } catch (error) {
    console.log(error);
    return false;
  }
}
//https://paginacoti.000webhostapp.com/WhatsApp%20Stickers/STK-20190510-WA0001.webp
let vecStickers = vStickers.getVecStickers();
let keyHeadStickers = vStickers.getHeadersStickers();
let contentStickers = document.querySelector(".content-stickers");
let headerStickers = document.querySelector(".header-stickers");
let vecHeaderStickers = [];
let vecBodyStickers = [];
let numberStickers = 0;
// for (let i = 1; i <= 69; i++) {
//   vecStickers.push(`./emoji/${i}.gif`);
// }

// for (let i = 0; i < vecStickers.length; i++) {
//   console.log(vecStickers[i]);
//   document.write(vecStickers[i] + "<br>");
// }

// console.log(vecStickers.length);
// const keyInitialStickers = 20190511;

async function addHeadersStickers() {
  for (let i = 0; i < keyHeadStickers.length; i++) {
    if (keyHeadStickers[i].includes("gif")) {

        let repreImg = document.createElement("img");
        repreImg.onerror = function () {
          this.remove();
          // if(vecHeaderStickers.indexOf(this.src) !== -1) {
          //   vecHeaderStickers.splice(vecHeaderStickers.indexOf(this.src), 1);
          // }
          // console.log(numberStickers);
        };
        // repreImg.onload = function() {
        //   this.style.backgroundImage = 'none';
        // }
        repreImg.src = `${keyHeadStickers[i]}`;
        repreImg.className = `data-sticker-${"gif"}`;
        repreImg.classList.add("key-sticker");
        // vecHeaderStickers.push(repreImg.src);
        headerStickers.appendChild(repreImg);
      
    } else {

        let repreImg = document.createElement("img");
        repreImg.onerror = function () {
          this.remove();
          // if(vecHeaderStickers.indexOf(this.src) !== -1) {
          //   vecHeaderStickers.splice(vecHeaderStickers.indexOf(this.src), 1);
          // }
          // console.log(numberStickers);
        };
        // repreImg.onload = function() {
        //   this.style.backgroundImage = 'none';
        // }
        repreImg.src = `https://cotitomaster.000webhostapp.com/WhatsAppStickers/${keyHeadStickers[i]}`;
        repreImg.className = `data-sticker-${
          keyHeadStickers[i].split("-")[1]
        }`;
        repreImg.classList.add("key-sticker");
        // vecHeaderStickers.push(repreImg.src);
        headerStickers.appendChild(repreImg);
      
    }
  }
}
async function addStickersCustom() {
  for (let i = 0; i < vecStickers.length; i++) {
    if (vecStickers[i].includes(".gif")) {
      let img = document.createElement("img");
      img.onerror = function () {
        this.remove();
        // let newVec = vecBodyStickers.find((v) => v.src == this.src);
        // if(vecBodyStickers.indexOf(newVec) != -1) {
        //   vecBodyStickers.splice(vecBodyStickers.indexOf(newVec), 1);
        // }
        // numberStickers--;
        // console.log(numberStickers);
      };

      // img.onload = function () {
      //   // Success function
      //   this.style.backgroundImage = 'none';
      // };
      img.src = `${vecStickers[i]}`;
      img.className = "imgStickerPrivate";
      img.classList.add(`group-sticker-gif`);
      img.title = i+1;
      // vecBodyStickers.push({
      //   keyX: i,
      //   src: img.src
      // });
      numberStickers++;
      // numberStickers++;
      contentStickers.appendChild(img);
    }
  }
}

// console.log(bLazy);
async function addStickers(indiceX) {
  for (let i = 0; i < vecStickers.length; i++) {
    if (parseInt(vecStickers[i].split("-")[1]) == indiceX) {
      let img = document.createElement("img");
      img.onerror = function () {
        this.remove();
        // let newVec = vecBodyStickers.find((v) => v.src == this.src);
        // if(vecBodyStickers.indexOf(newVec) != -1) {
        //   vecBodyStickers.splice(vecBodyStickers.indexOf(newVec), 1);
        // }
        // numberStickers--;
        // console.log(numberStickers);
      };

      // img.onload = function () {
      //   // Success function
      //   this.style.backgroundImage = 'none';
      // };
      img.src = `https://cotitomaster.000webhostapp.com/WhatsAppStickers/${vecStickers[i]}`;
      img.className = "imgStickerPrivate";
      img.classList.add(`group-sticker-${vecStickers[i].split("-")[1]}`);
      img.title = vecStickers[i].replace('.webp','');
      // vecBodyStickers.push({
      //   keyX: i,
      //   src: img.src
      // });
      numberStickers++;
      // numberStickers++;
      contentStickers.appendChild(img);
    }
  }
}
function addStickersPlaceholderBody() {
  for(let i=0; i<vecStickers.length; i++) {
    
    let wrapperSticker = document.createElement('div');
    wrapperSticker.classList.add('wrapper_stickers_body');
    // wrapperSticker.classList.add('ratio_big-img');
    
    let img = document.createElement("img");
    img.onerror = function () {
      this.remove();
      // let newVec = vecBodyStickers.find((v) => v.src == this.src);
      // if(vecBodyStickers.indexOf(newVec) != -1) {
      //   vecBodyStickers.splice(vecBodyStickers.indexOf(newVec), 1);
      // }
      // numberStickers--;
      // console.log(numberStickers);
    };
    img.classList.add('b-lazy');
    img.classList.add('imgStickerPrivate');
    if(vecStickers[i].includes('gif')) {
      img.title = i+1;
      img.classList.add(`group-sticker-gif`);
    } else {
      img.title = vecStickers[i].replace('.webp','');
      img.classList.add(`group-sticker-${vecStickers[i].split("-")[1]}`);
    }
    wrapperSticker.classList.add('loading');
    
    img.src = 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==';
    if(vecStickers[i].includes('gif')) {
      img.dataset.src = `${vecStickers[i]}`;
    } else {
      
      img.dataset.src = `https://cotitomaster.000webhostapp.com/WhatsAppStickers/${vecStickers[i]}`;
      wrapperSticker.classList.add('d-none');
    }
    
    img.alt = 'SubSticker' + i;
    wrapperSticker.appendChild(img); 
    contentStickers.appendChild(wrapperSticker);
    
  }
}
// addHeadersStickers();
// // $('.loader-stickers-head').addClass('d-none');
// // addStickers(vecStickers[0].split("-")[1]);
addStickersCustom();
// addStickersPlaceholderBody();
// addAllStickers();
// $('.loader-stickers-body').addClass('d-none');
// $(`.group-sticker-${keyInitialStickers}`).show();
// addStickers();

$('body').on('click', '.key-sticker', function(e) {
  if (e.target.classList.contains("key-sticker")) {
    $(".imgStickerPrivate").hide();
    let key = e.target.classList[1].replace("data-sticker-", "");
    
    if (!$(`.group-sticker-${key}`)[0]) {
      key.includes("gif")
        ? addStickersCustom()
        : addStickers(parseInt(key));
    }
    $(`.group-sticker-${key}`).show();
    // console.log($(`.group-sticker-${key}`)[0]);
    // var bLazy2 = new Blazy({
    //   container: '.content-stickers'
    //   , success: function(element){

    //   // We want to remove the loader gif now.
    //   // First we find the parent container
    //   // then we remove the "loading" class which holds the loader image
    //   var parent = element.parentNode;
    //   // console.log(parent);
    //   parent.className = parent.className.replace(/\bloading\b/,'');

    //     },error: (err) => {
    //       alert(err)
    //     },
    // });
  }
});
$("body").on("click", ".btnRightStickers", function () {
  $(".header-stickers").scrollLeft(
    $(".header-stickers").scrollLeft() + 100
  );
});
$("body").on("click", ".btnLeftStickers", function () {
  $(".header-stickers").scrollLeft(
    $(".header-stickers").scrollLeft() - 100
  );
});
});
  
