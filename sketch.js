let state = "start";
let nameInput, emailInput, startButton;
let questionCounter = 0;
let testQuestions = [
    { text: "Is the sky not blue?", type: "yesno" },
    { text: "Are you afraid of heights?", type: "yesno" },
    { text: "Have you ever been to France?", type: "yesno" },
    { text: "Can you tell me a secret?", type: "text" },
    { text: "Do you frequent religious places of worship?", type: "yesno" },
    { text: "Do you prefer cats or dogs?", type: "yesno" },
    { text: "Do you enjoy Tate Modern?", type: "yesno" },
    { text: "What's your favorite book?", type: "text" },
    { text: "Are you happy?", type: "yesno" },
    { text: "Do you enjoy coding?", type: "yesno" }
];

let nextButton, input, yesButton, noButton, angle = 0;
let answers = [];
let viewAnswersButton;

function setup() {
    createCanvas(windowWidth, windowHeight);
    setupStartScreen();
    nextButton = createButton("Next");
    nextButton.position(width / 2 - 30, height / 2 + 100);
    nextButton.mousePressed(nextQuestion);
    input = createInput(""); // Ensure the input is created
    input.position(width / 2 - input.width / 2, height / 2 - 10);
    input.hide(); // Hide the input initially
    createYesNoButtons();
    createViewAnswersButton(); // Add a button to view answers
    hideQuestionElements();
}

function draw() {
    drawDynamicBackground();
    textSize(16);
    fill(0);
    textAlign(CENTER);

    if (state === "start") {
        text("Please enter your name and email:", width / 2, height / 2 - 60);
    } else if (state === "questions") {
        text(`Question ${questionCounter + 1}:`, width / 2, height / 2 - 140);
        text(testQuestions[questionCounter].text, width / 2, height / 2 - 100);
        if (testQuestions[questionCounter].type === "text") {
            showTextInput();
        } else {
            hideTextInput();
            showYesNoButtons();
        }
    } else if (state === "finished") {
        text("Questionnaire finished. Thank you!", width / 2, height / 2 - 60);
        hideQuestionElements();
    }
}

function setupStartScreen() {
    nameInput = createInput("Name");
    nameInput.position(width / 2 - nameInput.width / 2, height / 2 - 30);

    emailInput = createInput("Email");
    emailInput.position(width / 2 - emailInput.width / 2, height / 2);

    startButton = createButton("Start");
    startButton.position(width / 2 - startButton.width / 2, height / 2 + 30);
    startButton.mousePressed(startQuiz);
}

function startQuiz() {
    state = "questions";
    questionCounter = 0; // Reset question counter
    nameInput.hide();
    emailInput.hide();
    startButton.hide();
    answers = []; // Reset answers array
    showQuestionElements();
}

function createYesNoButtons() {
    yesButton = createButton("Yes");
    yesButton.position(width / 2 - 60, height / 2);
    yesButton.mousePressed(() => {
        recordAnswer("Yes");
        nextQuestion();
    });

    noButton = createButton("No");
    noButton.position(width / 2 + 10, height / 2);
    noButton.mousePressed(() => {
        recordAnswer("No");
        nextQuestion();
    });
}

function createViewAnswersButton() {
    viewAnswersButton = createButton("View Answers");
    viewAnswersButton.position(width / 2 - 60, height - 40);
    viewAnswersButton.mousePressed(viewAnswers);
}

function nextQuestion() {
    if (testQuestions[questionCounter].type === "text") {
        recordAnswer(input.value());
        input.value(''); // Clear input for the next question
    }
    if (questionCounter >= testQuestions.length - 1) {
        state = "finished";
        nextButton.show();
        sendDataToServer({
            name: nameInput.value(),
            email: emailInput.value(),
            answers: answers
        });
    } else {
        questionCounter++;
        hideQuestionElements();
        showQuestionElements();
    }
}

function recordAnswer(answer) {
    answers.push({
        question: testQuestions[questionCounter].text,
        answer: answer
    });
}

function viewAnswers() {
    let answerText = "Answers:\n";
    for (let i = 0; i < answers.length; i++) {
        answerText += `${i + 1}. ${answers[i].question}: ${answers[i].answer}\n`;
    }
    alert(answerText);
}

function showTextInput() {
    input.show();
    input.position(width / 2 - input.width / 2, height / 2 - 10);
}

function hideTextInput() {
    input.hide();
}

function showYesNoButtons() {
    yesButton.show();
    noButton.show();
}

function hideYesNoButtons() {
    yesButton.hide();
    noButton.hide();
}

function showQuestionElements() {
    nextButton.show();
    if (testQuestions[questionCounter].type === "text") {
        showTextInput();
    } else {
        showYesNoButtons();
    }
}

function hideQuestionElements() {
    nextButton.hide();
    hideTextInput();
    hideYesNoButtons();
}

function drawDynamicBackground() {
    background(150); // Dark grey background
    translate(width / 2, height / 2);
    for (let i = 0; i < 300; i++) {
        push();
        rotate(angle + TWO_PI * i / 300);
        let lineColor = color(0, 0, 100 + i * 20 / 300); // Navy blue and purple
        stroke(lineColor);
        line(0, 0, max(width, height), 9); // Adjusted line length
        pop();
    }
    angle += 0.04;
    resetMatrix();
}

function sendDataToServer(data) {
    httpPost('http://localhost:3000/submit', 'json', data, function(response) {
        console.log(response);
    });
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    positionElements();
}

function positionElements() {
    nameInput.position(width / 2 - nameInput.width / 2, height / 2 - 30);
    emailInput.position(width / 2 - emailInput.width / 2, height / 2);
    startButton.position(width / 2 - startButton.width / 2, height / 2 + 30);
    nextButton.position(width / 2 - 30, height / 2 + 100);
    yesButton.position(width / 2 - 60, height / 2);
    noButton.position(width / 2 + 10, height / 2);
    viewAnswersButton.position(width / 2 - 60, height - 40);
    input.position(width / 2 - input.width / 2, height / 2 - 10);
}
