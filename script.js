var initialtext = [["I want to play with a . . . ",'sub-heading-type'],["friend","human"],["or","or"],["robot","robot"]]
performAnimation(initialtext);
$("header.hide").fadeIn();
function performAnimation(text){ //Performs the writing on its own animation using recursion.
  function animateText(textString,textId,index){
    var i = 0;
    var animation = setInterval(function(){
      if(!textString.charAt(i)) {
        i = 0;
        clearInterval(animation);
        if(index < text.length-1){
          animateText(text[index+1][0],document.getElementById(text[index+1][1]),index+1);
        }
      } else {
      textId.innerHTML += textString[i];
      i++;
    }
    },40);
  }
  animateText(text[0][0],document.getElementById(text[0][1]),0);
}

function clickFirstButton(elem){ //When the first choice is made.
  console.log("clicked");
  var type = elem;
  if(type === 'human') {
    $("#game-type").hide();
    $(".container,#reset").show();
    startDoublePlayer(); //If player wants to play against another player.
  }
  else {
  $("#game-type").hide();
  $("#player-choice").show();
  performAnimation([["I Want to play as . . .","sub-heading-choice"],["X","X"],["O","O"]]); //Performs the animation for the second choice.
  $(".player").click(function(){
    var player = $(this).attr('id');
    $("#player-choice").hide();
    $(".container,#reset").show();
    startSinglePlayer(player); //if player wants to play with computer.
  });
  }
}

function startSinglePlayer(human){
  var game = [0,1,2,3,4,5,6,7,8];
  //var running = true;
  var turn = 0;
  var currentPlayer = "X";
  var computer = human === 'X'?'O':'X';
  if(turn === 0 && computer === 'X'){ //If computer has the first move.Currently Plays in the 1st index,can be randomized for the corners or the center.
    game[0] = computer;
    $('#0').html(computer);
    currentPlayer = human;
    turn++;
    console.log("turn:"+turn);
  }
  $(".box").click(function(){ //When player clicks on a box.
    var boxId = $(this).children("h1").attr("id");
    //console.log(game);
    if(game[boxId] !== "X" && game[boxId] !== "O"){
      //console.log(human);
      if( currentPlayer === human ){ //If it is player's turn then update the board.
        game[boxId] = human;
        $('#'+boxId).html(human);
        turn++;
        console.log("turnin:"+turn);
        currentPlayer = computer;
        var result = checkForResult(game); //check if the current board has a result.
        if(result) {
          afterResult(result); //If there is a result terminate the game.
        }
        else takeActionAi(); //else get the computer's move.
      }
  }
  });
  function takeActionAi(){ //Plays the move returned by minimax.
      var maxPlayer = computer==="X"?true:false;
      var scoreList = [];
      var currTurn = turn+1;
      for(var i = 0 ; i < 9 ; i++){ //for every possible move for the computer on the current board get its score.
        if(game[i] !== "X" && game[i] !== "O"){
          var state = game.slice(0);
          state[i] = computer;
          scoreList[i] = minimax(state,currTurn,!maxPlayer); //Call minimax which returns the score for the current position on the board.
        }
      }
      var scoreCopy = scoreList.slice(0); //maintain a copy of the array so that the index of the desired score can be found.
      if(maxPlayer){  //Sort the arrays accordingly(descending for X and ascending for O,in our case)
        scoreList.sort(function(a,b){
          return b-a;
        })
      } else {
        scoreList.sort(function(a,b){
          return a-b;
        })
      }
      game[scoreCopy.indexOf(scoreList[0])] = computer; //update the board with the computer's move.
      $('#'+scoreCopy.indexOf(scoreList[0])).html(computer);
      turn++;
      currentPlayer = human;
      var result = checkForResult(game); //check if result.
      if(result) {
        afterResult(result);
      }
  }

  function minimax(currState,depth,maxPlayer){ //implements the minimax algorithm
    var state = currState.slice(0),player;
    var result = checkForResult(state);//check for result
      //console.log("currState : "+currState+"   Depth: "+depth+"  maxPlayer: "+maxPlayer+"  Result: "+result);
    //console.log(result);
    if(depth === 9 || result){ //If there is a result then return the score
      //console.log(state + "  " + result +"   "+depth);
      return setScore(result);
    }
    if(maxPlayer){ //If it is maxplayer's turn(X) then update the board and call minimax for the next possible moves.
      var bestValue = -Infinity;
      for(var i = 0 ; i < 9 ; i++){
        if(state[i] !== "X" && state[i] !== "O"){
          state[i] = "X";
          //console.log("maxloopState : "+state+"  Loop: "+i+"   Depth: "+depth+"  maxPlayer: "+maxPlayer);
          //console.log(state + depth);
          var value = minimax(state,depth+1,false);
          state = currState.slice(0);
          //console.log("Before change in bestValue: "+bestValue);
          bestValue = Math.max(bestValue,value); //Update the bestValue with the max between the returned value and itself,as we look through possiblities for the current state.
          //console.log("Value returned  is: "+value+" current depth: "+depth+" and current loop: "+i+" and current bestValue: "+ bestValue+" Player:"+maxPlayer);
        }
      }
      return bestValue; //after looping through all possiblities return the best value.
    } else {  //If it is minplayer's turn(O) then update the board and call minimax for the next possible moves.
      var bestValue = Infinity;
      for(var i = 0 ; i < 9 ; i++){
        if(state[i] !== "X" && state[i] !== "O"){
          state[i] = "O";
          //console.log(state + "  " + i);
          //console.log("minloopState : "+state+"  Loop: "+i+"   Depth: "+depth+"  maxPlayer: "+maxPlayer);
          var value = minimax(state,depth+1,true);
          state = currState.slice(0);
          //console.log("Before change in bestValue: "+bestValue);
          bestValue = Math.min(bestValue,value); //same as 130 but we look for the minimum value.
          //console.log("Value returned is: "+value+" current depth: "+depth+" and current loop: "+i+" and current bestValue: "+ bestValue+" Player:"+maxPlayer);
        }
      }

      return bestValue; //after looping through all possiblities return the best value.
    }
  }
  function setScore(result){ //Called when there is a result to return a score accordingly
      if(result === 'draw') return 0; //does not take the depth into account.
      else if(result === "X") {
        return 10;
      }
      else if(result === "O") {
        return -10;
      } else return 0;
  }
}

function startDoublePlayer(){ //Start the human vs human game.
  console.log("running");
  var running = true;
  var game = [0,1,2,3,4,5,6,7,8];
  var turn = 0;
  var currentPlayer = "X";
  $(".box").click(function(){
    var boxId = $(this).children("h1").attr("id");
    if(game[boxId] !== "X" && game[boxId] !== "O" && running){
      game[boxId] = currentPlayer;
      $("#"+boxId).html(currentPlayer);
      currentPlayer = currentPlayer==="X"?"O":"X";
      var result = checkForResult(game);
      if(result) {
        afterResult(result);
        running = false;
      }
    }
  });
}

function checkForResult(matrix){ //Check for result in the passed board state.
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
    function checkForDraw(matrix){
      var draw = true;
      for(var i = 0 ; i < 9 ; i++){
        if(matrix[i] !== "X" && matrix[i] !== "O") draw = false;
      }
      return draw?'draw':false;
    }
} //

function afterResult(result){ //Display the result
  $("#result").show();
  if(result === "draw"){
    $("#result").html("It's a draw")
  } else {
    $("#result").html("It's a WIN for "+result)
  }
}

function resetGame(){ //reset to initial state.
  $("body").children("*").hide();
  $("#game-type,header").fadeIn();
  $(".sub-heading").text("");
  $(".type,.player,#or,.box-heading").text("");
  performAnimation(initialtext);
}
