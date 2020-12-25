import helpers from './helpers.js';

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
let btnInfoUser = document.querySelector('.btnInfoUser');
btnInfoUser.addEventListener('click', function() {
let elem = this;
let newElem = document.querySelector('.panel_menu_user');
newElem.classList.toggle('d-none');
  newElem.style.position = 'absolute';
  newElem.style.top = parseFloat(getOffsetTop(elem) + 53) + 'px';

  newElem.style.right = 10 + 'px';
  
});
$(document).ready(function() {
  const socket = io();
  const btnUnirse = document.querySelector('.joinSession');
  const codUrl = document.querySelector('.inputSendCod');
  const btnCrearSala = document.querySelector('.addSession');
  btnCrearSala.addEventListener('click', async (e) => {
    let newUrl = helpers.generateUUID();
    socket.emit('addSession', newUrl);
  });
  socket.on('newSession', detectNewSession);
  function detectNewSession(newUrl) {
    location.href = location.origin + `/session/${newUrl}`;
  }
  function isUrl(s) {   
    var regexp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/
    return regexp.test(s);
  }
  codUrl.addEventListener('keydown', function(e) {
    if($(this).val() == "") {
      $('.joinSession').attr('disabled', 'disabled');
    } else {
      $('.joinSession').removeAttr('disabled');
    }
  });
  codUrl.addEventListener('keyup', async function(e) {
    if($(this).val() == "") {
      $('.joinSession').attr('disabled', 'disabled');
    } else {
      $('.joinSession').removeAttr('disabled');
    }
    if(e.keyCode == 13) {
      e.preventDefault();
      btnUnirse.click();
    }
  });
  btnUnirse.addEventListener('click', async () => {
    if(codUrl.value == "") return;
      let urlEncode = codUrl.value;
      if(isUrl(urlEncode) || urlEncode.substr(urlEncode.length-4, urlEncode.length-1) == '.com') {
        if(!urlEncode.includes(`/`)) 
        {
          // (async() => {
          //   swal("Error!", "Url no válida", "error");
          // })();
          errorFunction();
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
          // (async() => {
          //   swal("Error!", "La sala ingresada no existe", "error");
          // })();
          errorFunction();
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
          // (async() => {
          //   swal("Error!", "La sala ingresada no existe", "error");
          // })();
          errorFunction();
        }
      }
  });
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
  if(!isMobile()) {
    $('[data-toggle=tooltip]').tooltip();
  }
  
  $('#change_foto').on('change', function() {
    let imgPreviewUrl;
    if($(this).val() == "" || $(this).val() == null) {
     return; 
    }
    const $form = document.querySelector('#form_foto');
    const formData = new FormData($form);
    imgPreviewUrl = URL.createObjectURL(formData.get('archivo'));
    $('.imgPreview').prop('src', imgPreviewUrl);
    $('.block-preview-foto').removeClass('d-none');
    $('.preview-img-foto').removeClass('d-none');
    
  });

  $('.btnChangeFoto').on('click', async function() {
    $('.btnChangeFoto').replaceWith(`<div class="loading-upload"><div class="spinner-border text-light" role="status">
  </div></div>`);
    var form = $('#form_foto')[0];
    var formData = new FormData(form);
    const urlDirect = location.origin + '/images';
    const response = await fetch(urlDirect, {
      method: 'POST', // or 'PUT'
      body: formData, // data can be `string` or {object}!
    });
    let datos = await response.text();
    // sessionStorage.foto = datos;
    $('.img-info-user').prop('src', datos);
    $('.img_user_help').prop('src', datos);
    $('.loading-upload').replaceWith(`<div class="btn btn-success btnChangeFoto">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 30" width="30" height="30"><path fill="currentColor" d="M9.9 21.25l-6.7-6.7-2.2 2.2 8.9 8.9L29 6.55l-2.2-2.2-16.9 16.9z"></path></svg>
  </div>`);
    $('.block-preview-foto').addClass('d-none');
    $('.preview-img-foto').addClass('d-none');
    console.log(datos);
  });

  $('.close-preview').on('click', function() {
    let previousImg = $('.imgPreview').prop('src');
    URL.revokeObjectURL(previousImg);
    $('.block-preview-foto').addClass('d-none');
    $('.preview-img-foto').addClass('d-none');
    $('#change_foto').val(null);
  });
  let intervalOut;
    function errorFunction() {
      var x = document.getElementById("snackbar");
      x.className = "show";
      clearTimeout(intervalOut);
      intervalOut = setTimeout(function(){ x.className = x.className.replace("show", ""); }, 4000);
    }
    $('#snackbar').click(function() {
      $(this).removeClass('show');
    });
  $(document).on("click.panel_menu_user",function(event) {
  
    var target = $(event.target);   
    // console.log($('.grab_audio').hasClass('d-none'));
    if(!$('.panel_menu_user').hasClass('d-none')) {
      if (!target.closest(".btnInfoUser").length && !target.closest(".panel_menu_user").length) {
        // closeMenu(function() {
        //     $(document).off("click.grab_audio");
        // });
        $('.panel_menu_user').addClass('d-none');
      }      
    }
    
  }); 
});
