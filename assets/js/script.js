var startButtonEl = $('.start');
var questionEl = $('#question')
var answerButtonsEl = $('#answer-buttons');
var answerEl = $('#answer')
var nameInput = $('#name');
var scoresDisplayEl = $('#scores');
var submitButtonEl = $('#submit');
var backButtonEl = $('#back');
var welcomeEl = $('#welcome');
var quizEl = $('#quiz');
var quizCompleteEl = $('#quiz-completion');
var messageEl = $('#message');
var highScoresEl = $('#high-scores');
var timerEl = $('#timer');
var userScoreEl = $('#user-score')
var formInputEl = $('#name');
var viewScoresEl = $('.view-scores');
var vsTextEl = $('#vs-text');
var scoreDisplayEl = $('#score-display')
var clearScoresEl = $('#clear-scores');
var storedNames = [];
var storedScores = [];
var score = 0;
var timeLeft = 11;
var quizDuration = 60;
var questionIndex = 0;
var wrongAnswer = false;
var questionIndexArray = [];
var correctAnswer;
var questions = [
    "Inside of which HTML element do we put the JavaScript?",
    "Where is the correct place to insert JavaScript?",
    "How do you create a function in JavaScript?",
    "How do you call a function named 'myFunction'",
    "Which is the CORRECT way of writing an IF statment in JavaScript?",
    "If x=9\nThen what does x > 10 return?",
    "Which of the following is the CORRECT way of writing a FOR loop?",
    "Which of the following FOR loops will return an ERROR?"
];
var answers = [
    ["<script>","<javascript>","<scripting>","<js>"],
    ["<body> section","<head> section","Both <head> and <body>"],
    ["function myFunction(){}","function:myFunction(){}","function=myFunction(){}"],
    ["myFunction()","myFunction","call:myFunction","function:myFunction()"],
    ["if (condition) {}","if condition {}","if (condition) thenDo","I have no idea"],
    ["false","true"],
    ["for (i=0; i<5; i++) {}","for i=0; i<5; i++; then","for (i=0, i<5, i++) {}"],
    ["for (i>0; i=10; i--){}","for (i=10; i>0; i--){}","for (i=0; i<1000; i+=10){}","I can't read"]
];

//call init function
init();

//function for initializing the page
function init(){
    welcomeEl.show();
    quizEl.hide();
    quizCompleteEl.hide();
    highScoresEl.hide();
    timerEl.hide();
    retriveStoredData();
}

//this function retrieves the stored user data
function retriveStoredData(){
    if(!localStorage.names){
        return;
    }
    storedNames = JSON.parse(localStorage.names);
    storedScores = JSON.parse(localStorage.scores);
}

//add click event listener for the start buttons
startButtonEl.click(function(event){
    event.preventDefault();
    startTimer();
    startQuiz();
});

//this function will start the quiz timer
function startTimer(){
    timeLeft = quizDuration;
    renderTimer();
    //creates a timer that changes each second
    var timerInterval = setInterval(function(){
        timeLeft--;
        //if the timer ends, continue to the quiz completion page
        if(timeLeft < 0){
            quizEl.hide();
            timerEl.hide();
            quizCompleteEl.show();
            clearInterval(timerInterval);
            messageEl.text("You Ran Out of Time!");
            userScoreEl.text(score);
            return;
        }
        //if the quiz is complete, stop timer
        if(quizComplete()){
            clearInterval(timerInterval);
            return;
        }
        renderTimer();
    },1000);
}

//function used to render the timer
function renderTimer(){
    timerEl.text('Time Left: ' + timeLeft);
}

//this function is used to initialize the quiz
function startQuiz(){
    welcomeEl.hide();
    vsTextEl.hide();
    highScoresEl.hide();
    quizEl.show();
    timerEl.show();
    score = 0;
    questionIndexArray = [];
    //generate an array for the question Index
    for (i = 0; i < questions.length; i++){
        questionIndexArray.push(i);
    }
    //shuffle the question Index array
    questionIndexArray.sort(()=>Math.random() - 0.5);
    answerEl.text("");
    renderQA();
}

//function used to render the question and answers
function renderQA(){
    wrongAnswer = false;
    //get question index from randomized question index array
    questionIndex = questionIndexArray[0]
    answerButtonsEl.empty();
    //render question
    questionEl.text(questions[questionIndex]);
    correctAnswer = answers[questionIndex][0];
    //randomize answers on the page
    console.log(answers[questionIndex]);
    var tempIndex = [];
    for (i=0; i<answers[questionIndex].length; i++){
        tempIndex.push(i);
    }
    tempIndex.sort(()=>Math.random() - 0.5);
    console.log(answers[questionIndex]);
    //render randomized answers
    for (i = 0; i < tempIndex.length; i++){
        var answerButton = $('<button>');
        answerButton.addClass('ans-button');
        answerButton.text(answers[questionIndex][tempIndex[i]]);
        answerButtonsEl.append(answerButton);
        answerButtonsEl.append($('<br>'));
    }
}

//this function checks if the quiz is completed and returns result
function quizComplete(){
    if(questionIndexArray.length !== 0){
        return false;
    }
    return true;
}

//event listener for when the answer button is clicked
answerButtonsEl.click('.ans-button', function(event){
    event.preventDefault();
    //check if the user has gotten a wrong answer, if so, the user cant answer any questions
    if(wrongAnswer){
        console.log("can't answer right now");
        return;
    }
    checkAnswer(event);
    // console.log($(event.target).text());
});

//this function checks the answer the user has clicked on
function checkAnswer(event){
    var answer = $(event.target).text();
    //check if the answer matches the correct answer
    if(answer === correctAnswer){
        score++;
        answerEl.text("Correct!")
        questionIndexArray.splice(0,1);
        //check if the quiz has been completed. If
        if(quizComplete()){
            quizEl.hide();
            quizCompleteEl.show();
            timerEl.hide();
            messageEl.text("Nice Job!");
            score += timeLeft;
            userScoreEl.text(score);
            return;
        }
        //render next question
        renderQA();
        return;
    }
    // console.log("wrong");
    //call the got wrong answer function
    gotWrongAnswer(event);
}  

//this function reds out wrong questions and creates a 3 second timer in which the user cant answer any questions
function gotWrongAnswer(event){
    wrongAnswer = true;
    //set background of the wrong question to red
    $(event.target).css("background","#e3655b")
    var wrongTimer = 3
    //render the message to the user
    answerEl.text("Wrong! Try again in " + wrongTimer + " seconds")
    //create timer for how long the user can't answer questions
    var intervalTimer = setInterval(function(){
        wrongTimer--;
        //if the timer runs out, reset the interval timer and let the user answer questions again
        if(wrongTimer < 0){
            answerEl.text("Try again!")
            wrongAnswer = false;
            clearInterval(intervalTimer);
            return;
        }
        answerEl.text("Wrong! Try again in " + wrongTimer + " seconds")
    },1000);
}

//event listener for when the form submit button is pressed
submitButtonEl.click(function(event){
    event.preventDefault();
    //if there is no input return an alert
    if(!formInputEl.val()){
        alert("No name was entered");
        return;
    }
    //if the name is longer than 15 characters return an alert
    if(formInputEl.val().length>15){
        alert("The name was too long")
        return;
    }
    sortScores();
    console.log(storedScores);
});

//function for ranking the scores
function sortScores(){
    retriveStoredData();
    //check if there is any previous scores, if not, store the data in the first position of the array
    if (storedScores.length === 0){
        storedNames.push(formInputEl.val());
        storedScores.push(score);
        storeData();
        return;
    }
    //check to see if the score is better than any of the previous stored scores. if it is splice it into that location
    for(i = 0;i<storedScores.length;i++){
        if(score >= storedScores[i]){
            storedNames.splice(i,0,formInputEl.val());
            storedScores.splice(i,0,score);
            storeData();
            return;
        }
    }
    //push the score at the end since it will be the lowest score
    storedNames.push(formInputEl.val())
    storedScores.push(score);
    storeData();
}

//this function stores the data
function storeData(){
    correctDataLength();
    localStorage.names = JSON.stringify(storedNames);
    localStorage.scores = JSON.stringify(storedScores);
}

//this function makes sure the data only stores up to 10 values
function correctDataLength(){
    while(storedScores.length > 10){
        // console.log("i am here")
        storedNames.splice(storedScores.length -1,1);
        storedScores.splice(storedScores.length -1,1);
    }
}

//add event listner for when a view high scores element is clicked
viewScoresEl.click(function(){
    quizCompleteEl.hide();
    welcomeEl.hide();
    vsTextEl.hide();
    highScoresEl.show();
    renderScores();
});

//this function renders the top 10 scores
function renderScores(){
    scoreDisplayEl.empty();
    retriveStoredData();
    //check if there are previous scores, if not, display message
    if(storedNames.length === 0){
        scoreDisplayEl.append($('<li>There are no stored scores</li>'));
        scoreDisplayEl.append($('<li>Take quiz to add a score</li>'));
        return;
    }
    //render the stored scores and names
    for(i = 0; i < storedScores.length; i++){
        scoreDisplayEl.append($('<li>' + storedScores[i] + '-' + storedNames[i] + '</li>'));
    }
}

//add event listener for when the clear scores button is pressed
clearScoresEl.click(function(event){
    storedNames=[];
    storedScores=[];
    storeData();
    renderScores();
});

//add event listener for when the back button is clicked
backButtonEl.click(function(event){
    highScoresEl.hide();
    welcomeEl.show();
    vsTextEl.show();
});



