var game = [0,1,2,3,4,5,6,7,8];
var turn = 0;
var currentPlayer = "X";
var computer,human;
  $(".type").click(function(){
    var gameType = $(this).attr('id')
    $('#game-type').hide();
    $('#player-choice').fadeIn();
    if(gameType === 'human'){

    } else {
      $('.player').click(function(){
        human = $(this).text();
        computer = human === 'X'?'O':'X';
        $("#container-ai").removeClass('hide');
        if(turn === 0 && computer === 'X'){
          game[0] = computer;
          $('#0').html(computer);
          currentPlayer = human;
          turn++;
          console.log(turn);
        }
    });
  }
});
$(".box").click(function(){ //When player clicks on a box.
  var boxId = $(this).children("h1").attr("id");
  console.log(game);
  if(game[boxId] !== "X" && game[boxId] !== "O"){
    console.log(human);
    if( currentPlayer === human ){
      game[boxId] = human;
      $('#'+boxId).html(human);
      turn++;
      console.log(turn);
      currentPlayer = computer;
      var result = checkForResult(game);
      if(result) afterResult(result);
      else takeActionAi();
    }
}
});

function takeActionAi(){
  // if(turn < 3 && turn > 0 && currentPlayer === computer){
  //   //console.log("hit");
  //   for(var i = 0 ; i < 9 ; i+=2){
  //     if(game[i] !== "X" && game[i] !== "O"){
  //       game[i] = computer;
  //       $('#'+i).html(computer);
  //       turn++;
  //       console.log(turn);
  //       currentPlayer = human;
  //       break;
  //     }
  //   }
  // } else if(turn >= 3 ){
    var maxPlayer = computer==="X"?true:false;
    console.log(computer);
    var scoreList = [];
    var currTurn = turn+1;
    for(var i = 0 ; i < 9 ; i++){
      if(game[i] !== "X" && game[i] !== "O"){
        var state = game.slice(0);
        state[i] = computer;
        console.log(state);
        scoreList[i] = minimax(state,currTurn,!maxPlayer);
        console.log("THE FINAL VALUE RETURNED  "+i+"   "+scoreList[i]);
      }
    }
    console.log(scoreList);
    var scoreCopy = scoreList.slice(0);
    if(maxPlayer){
      scoreList.sort(function(a,b){
        return b-a;
      })
    } else {
      scoreList.sort(function(a,b){
        return a-b;
      })
    }
    console.log("scoreList after sort:"+scoreList);
    console.log(scoreCopy.indexOf(scoreList[0]));
    game[scoreCopy.indexOf(scoreList[0])] = computer;
    $('#'+scoreCopy.indexOf(scoreList[0])).html(computer);
    turn++;
    console.log(turn);
    currentPlayer = human;
  //} else if bracket
  var result = checkForResult(game);
  console.log(result);
  if(result) afterResult(result);
}

function minimax(currState,depth,maxPlayer){
  var state = currState.slice(0),player;
  var result = checkForResult(state);
    //console.log("currState : "+currState+"   Depth: "+depth+"  maxPlayer: "+maxPlayer+"  Result: "+result);
  //console.log(result);
  if(depth === 9 || result){
    //console.log(state + "  " + result +"   "+depth);
    return setScore(result);
  }
  if(maxPlayer){
    var bestValue = -Infinity;
    for(var i = 0 ; i < 9 ; i++){
      if(state[i] !== "X" && state[i] !== "O"){
        state[i] = "X";
        //console.log("maxloopState : "+state+"  Loop: "+i+"   Depth: "+depth+"  maxPlayer: "+maxPlayer);
        //console.log(state + depth);
        var value = minimax(state,depth+1,false);
        state = currState.slice(0);
        //console.log("Before change in bestValue: "+bestValue);
        bestValue = Math.max(bestValue,value);
        //console.log("Value returned  is: "+value+" current depth: "+depth+" and current loop: "+i+" and current bestValue: "+ bestValue+" Player:"+maxPlayer);
      }
    }
    return bestValue;
  } else {
    var bestValue = Infinity;
    for(var i = 0 ; i < 9 ; i++){
      if(state[i] !== "X" && state[i] !== "O"){
        state[i] = "O";
        //console.log(state + "  " + i);
        //console.log("minloopState : "+state+"  Loop: "+i+"   Depth: "+depth+"  maxPlayer: "+maxPlayer);
        var value = minimax(state,depth+1,true);
        state = currState.slice(0);
        //console.log("Before change in bestValue: "+bestValue);
        bestValue = Math.min(bestValue,value);
        //console.log("Value returned is: "+value+" current depth: "+depth+" and current loop: "+i+" and current bestValue: "+ bestValue+" Player:"+maxPlayer);
      }
    }

    return bestValue;
  }
}

function checkForResult(matrix){
  if((matrix[0] === matrix[4] && matrix[4] === matrix[8]) || (matrix[2] === matrix[4] && matrix[4] === matrix[6])) return matrix[4];
      else {
        for(var i = 0 ; i < 3 ; i++){
          var draw = true;
          if((matrix[i] === matrix[i+3] && matrix[i+3] === matrix[i+6])) return matrix[i];
          else {
            var j = i;
            if(j !== 0){
              j += 2*i;
            }
            if((matrix[j] === matrix[j+1] && matrix[j+1] === matrix[j+2])) return matrix[j];
          }
      }
      return checkForDraw(matrix);
    }
    return false;
}

function checkForDraw(matrix){
  var draw = true;
  for(var i = 0 ; i < 9 ; i++){
    if(matrix[i] !== "X" && matrix[i] !== "O") draw = false;
  }
  return draw?'draw':false;
}

function afterResult(result){
  if(result === "draw"){
    $("#overlay h1").html("It's a draw");
    $("#overlay").removeClass('hide');
    $(".container").addClass('hide');
  } else {
    $("#overlay h1").html(result+": Won");
    $("#overlay").removeClass('hide');
    $(".container").addClass('hide');
  }
  $('#overlay').css('backgroundColor','#162626');
}
function setScore(result){
    if(result === 'draw') return 0;
    else if(result === "X") {
      return 10;
    }
    else if(result === "O") {
      return -10;
    } else return 0;
}
