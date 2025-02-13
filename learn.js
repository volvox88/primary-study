var idDiv = document.getElementById("id");
var questionDiv = document.getElementById("question");
var answerDiv = document.getElementById("answer");
var question = '';
var answer = '';
var startTime;
var deafultTime = 20000;//20s=100分

var totalTime = 0;
var correct = 0;
var count = 0;
var maxCount = parseInt(new URL(location.href).searchParams.get("c") || "20");
var user = new URL(location.href).searchParams.get("u") || "default"

document.title = "练习 | 用户: " + user;

//答案按钮点击事件
function clk() {
    if (answer == '') return;
    var myAnswer = this.innerText;
    questionDiv.innerText += " " + answer;
    questionDiv.className = answer == myAnswer ? 'right' : 'wrong';
    var cost = new Date().getTime() - startTime;
    cost = cost * 1.434;//分数缩放
    if (answer == myAnswer) {
        correct++;
        updateScoreBoard(question, cost);
    } else {
        updateScoreBoard(question, deafultTime);
    }
    totalTime += cost;
    count++;
    answer = '';
    if (count < maxCount) {
        setTimeout(gen, 1000);
    } else {
        setTimeout(() => {
            //标准用时：2000ms=1000分
            questionDiv.innerText = Math.round(1.0 * correct / totalTime / (1.0 / 2000) * 1000);
        }, 1000);
    }
}

//初始答案按钮
function initButtion() {
    var isTouch = idDiv.ontouchstart === null;

    var line1 = document.createElement("div");
    var line2 = document.createElement("div");
    for (var i = 0; i < 20; i++) {
        var btn = document.createElement("div");
        btn.innerText = i + 1;
        if (isTouch) {
            btn.ontouchstart = clk;
        } else {
            btn.onmousedown = clk;
        }
        btn.className = 'button';
        if (i < 10) {
            line1.appendChild(btn);
        } else {
            line2.appendChild(btn);
        }
    }
    answerDiv.appendChild(line1);
    answerDiv.appendChild(line2);
}
initButtion();

//初始化题目
function gen() {
    var qa = getRandomQuestion();
    idDiv.innerText = "第" + (count + 1) + "/" + maxCount + "题";
    questionDiv.innerText = qa.question;
    questionDiv.className = '';
    question = qa.question;
    answer = qa.answer;
    startTime = new Date().getTime();
}
gen();

function getScoreBoard() {
    var board = JSON.parse(localStorage.getItem("board-" + user) || "{}");
    //init
    for (var a = 1; a < 10; a++) {
        for (var b = 1; b <= a; b++) {
            var q = a + " + " + b + " =";
            if (board[q] == null) {
                board[q] = { answer: a + b, time: deafultTime };
            }
        }
    }
    return board;
}

function updateScoreBoard(question, time) {
    var board = getScoreBoard();
    board[question].time = Math.round((board[question].time + time) / 2);
    localStorage.setItem("board-" + user, JSON.stringify(board));
}

function cumulatedProbability(n) {
    return 2 / (1 + Math.pow(Math.E, -0.2198 * n)) - 1;
}

function getWeight(n) {
    return cumulatedProbability(n) - cumulatedProbability(n - 1);
}

function getRandomQuestion() {
    var board = getScoreBoard();
    var questions = Object.keys(board);

    // 对问题按 time 值进行降序排序
    questions.sort((a, b) => board[b].time - board[a].time);

    var weights = questions.map((q, index) => getWeight(index + 1));

    // 计算权重总和
    var totalWeight = weights.reduce((sum, w) => sum + w, 0);

    // 生成一个介于 0 和 totalWeight 之间的随机数
    var rand = Math.random() * totalWeight;

    // 根据随机数选择问题
    let cumulative = 0;
    for (let i = 0; i < questions.length; i++) {
        cumulative += weights[i];
        if (rand < cumulative || i == questions.length - 1) {
            return { question: questions[i], answer: board[questions[i]].answer };;
        }
    }
}

//积分榜显示
idDiv.ondblclick = function () {
    var board = getScoreBoard();
    for (var a = 1; a < 10; a++) {
        var row = document.createElement("div");
        row.className = "board"
        for (var b = 1; b <= a; b++) {
            var cell = document.createElement("div");
            var q = a + " + " + b + " =";
            var score = Math.round(2000000.0 / board[q].time);
            cell.innerHTML = "[" + q + "]<br/>" + score;
            cell.style.backgroundColor = "hsl(" + Math.round(score / 1000.0 * 120) + " 100% 50%)";
            row.appendChild(cell);
        }
        answerDiv.appendChild(row);
    }
}