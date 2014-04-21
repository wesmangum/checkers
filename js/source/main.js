(function () {
  'use strict';

  $(document).ready(init);

  var currentPiece;
  var selectedLocation;

  function init() {
    $('#board').on('click', 'td.black.player.current', select);
    $('#board').on('click', 'td.black:empty', move);
    $('#endMove').click(endMove);
    setBoard();
  }

  function setBoard() {
    var $black = $('td.black[data-y=0], td.black[data-y=1], td.black[data-y=2]');
    var $white = $('td.black[data-y=5], td.black[data-y=6], td.black[data-y=7]');

    for(var i = 0; i < $black.length; i++){
      var $bPiece = $('<img>').attr('src', './media/black.png');
      var $wPiece = $('<img>').attr('src', './media/white.png');

      $($black[i]).append($bPiece).addClass('player X');
      $($white[i]).append($wPiece).addClass('player Y current');
    }
  }

  function select() {
    if (currentPiece) {
      currentPiece.removeClass('selected');
    }

    var $target =  $(this).addClass('clicked');
    currentPiece = $target;
  }

  function move() {
    selectedLocation = $(this);

    var locationX = selectedLocation.data('x');
    var locationY = selectedLocation.data('y');

    var pieceX = currentPiece.data('x');
    var pieceY = currentPiece.data('y');

    var vector = [];
    vector.push(locationX - pieceX);
    vector.push(locationY - pieceY);

    if(Math.abs(vector[0]) + Math.abs(vector[1]) === 4){
      if(direction(currentPiece, selectedLocation)){
        var $deadPiece = generateDead(currentPiece, selectedLocation);

        if(checkDead($deadPiece)){
          $deadPiece.empty();
          $deadPiece.removeClass('player');
          movePiece();
          if (checkPotential() > 3) {
              endMove();
          }
        }
      }
    }else if(Math.abs(vector[0]) + Math.abs(vector[1]) === 2){
      if(direction(currentPiece, selectedLocation)){
        movePiece();
        endMove();
      }
    }
  }

  function checkDead(deadPiece) {
    return deadPiece.hasClass('player') && !deadPiece.hasClass('current');
  }

  function generateDead(jQuerycurrentPiece, jQueryselectedLocation) {
    var avgx = Math.floor((jQuerycurrentPiece.data('x') + jQueryselectedLocation.data('x')) / 2);
    var avgy = Math.floor((jQuerycurrentPiece.data('y') + jQueryselectedLocation.data('y')) / 2);
    return $('td[data-x=' + avgx + '][data-y=' + avgy + ']');
  }

  function direction(jQuerycurrentPiece, jQueryselectedLocation) {
    if(jQuerycurrentPiece.hasClass('king')){
      return true;
    }

    if(jQuerycurrentPiece.hasClass('Y')){
      if(jQueryselectedLocation.data('y') < jQuerycurrentPiece.data('y')){
        return true;
      }else{
        return false;
      }
    }else{
      if(jQueryselectedLocation.data('y') > jQuerycurrentPiece.data('y')){
        return true;
      }
      return false;
    }
  }

  function movePiece() {
    if(!selectedLocation.hasClass('player')){
      var $token = currentPiece.find('img');
      currentPiece.empty();
      selectedLocation.append($token);

      currentPiece.removeClass('clicked').removeClass('player').removeClass('current');
      selectedLocation.addClass('player').addClass('current');

      if (currentPiece.hasClass('Y')) {
        currentPiece.removeClass('Y');
        selectedLocation.addClass('Y');
        if (selectedLocation.data('y') === 0) {
          selectedLocation.addClass('king');
          selectedLocation.empty();
          selectedLocation.prepend($('<img>').attr('src', './media/whiteking.png'));
        }
      }else{
        currentPiece.removeClass('X');
        selectedLocation.addClass('X');
        if (selectedLocation.data('y') === 7) {
          selectedLocation.addClass('king');
          selectedLocation.empty();
          selectedLocation.prepend($('<img>').attr('src', './media/blackking.png'));
        }
      }

      if (currentPiece.hasClass('king')) {
        currentPiece.removeClass('king');
        selectedLocation.addClass('king');
      }
    }
  }

  function checkPotential() {
    var potentialTargets = [];
    var translatedX = [];
    var translatedY = [];

    translatedX.push(selectedLocation.data('x') + 2);
    translatedY.push(selectedLocation.data('y') + 2);
    translatedX.push(selectedLocation.data('x') - 2);
    translatedY.push(selectedLocation.data('y') - 2);

    for (var i = 0; i < 2; i++) {
      for (var j = 0; j < 2; j++) {
        potentialTargets.push($('td[data-x=' + translatedX[i] + '][data-y =' + translatedY[j] + ']'));
      }
    }

    var spliceIndeces = [];
    for (var k = 0; k < potentialTargets.length; k++) {
      var $dead = generateDead(selectedLocation, potentialTargets[k]);
      if (potentialTargets[i].hasClass('player') || !checkDead($dead) || !direction(selectedLocation, potentialTargets[k])) {
        spliceIndeces.push(k);
      }
    }

    console.log(spliceIndeces.length);

    return spliceIndeces.length;
  }

  function endMove() {
    endGame();
    var $currentPlayer = $('td.player.current');
    var $otherPlayer = $('td.player');

    $otherPlayer.addClass('current');
    $currentPlayer.removeClass('current');
  }

  function endGame() {
    debugger;
    var $xPiecesLeft = $('.X');
    var $yPiecesLeft = $('.Y');

    if(!$xPiecesLeft[0] || !$yPiecesLeft[0]){
      alert('You win!');
    }
  }


//
// for(var i = 0; i < 8; i++){
//   var y = $('td[data-y='+ i + ']');
//   for(var j = 0; j < 8; j++){
//     var x = $('td[data-x=' + j + ']');
//     console.log(x, y);
//   }
// }

})();
