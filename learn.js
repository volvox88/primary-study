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

//答案按钮点击事件
function clk() {
    if (answer == '') return;
    var myAnswer = this.innerText;
    questionDiv.innerText += " " + answer;
    questionDiv.className = answer == myAnswer ? 'right' : 'wrong';
    var cost = new Date().getTime() - startTime;
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
    for (var i = 0; i < 20; i++) {
        var btn = document.createElement("div");
        btn.innerText = i + 1;
        btn.onmousedown = clk;
        btn.className = 'button';
        answerDiv.appendChild(btn);
        if (i % 10 == 9) {
            answerDiv.appendChild(document.createElement("br"));
        }
    }
}
initButtion();

//初始化题目
function gen() {
    var qa = wheelSelection();
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

// 轮盘赌问题选择函数
function wheelSelection() {
    var board = getScoreBoard();
    var totalTime = 0;
    // 计算所有问题的总时间
    for (var question in board) {
        totalTime += board[question].time;
    }
    // 生成一个 0 到总时间之间的随机数
    var randomValue = Math.random() * totalTime;
    var cumulativeTime = 0;
    // 遍历每个问题，根据累积时间来选择问题
    for (var question in board) {
        cumulativeTime += board[question].time;
        if (randomValue <= cumulativeTime) {
            return { question: question, answer: board[question].answer };
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