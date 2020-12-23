$(document).ready(function() {

  const socket = io();
  $('.btn-reconnect').on('click', function() {
    socket.emit('verifySession', sessionStorage.sessionReconnect);
  });
  socket.on('getSession', (url) => {
    delete sessionStorage.sessionReconnect;
    location.href = `/session/${url}`;
  });
  $('.btn-home').on('click', function() {
    delete sessionStorage.sessionReconnect;
    location.href = '/';
  });
});