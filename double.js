var idDiv = document.getElementById("id");
var questionDiv = document.getElementById("question");
var answerDiv = document.getElementById("answer");
var question = '';
var answer = '';
var userAnswer = 0;
var startTime;
var deafultTime = 20000;//20s=100分

var totalTime = 0;
var correct = 0;
var count = 0;
var maxCount = parseInt(new URL(location.href).searchParams.get("c") || "20");

//答案按钮点击事件
function clk() {
    if (answer == '') return;
    var thisAnswer = Number.parseInt(this.getAttribute("data-value"));
    if (thisAnswer & userAnswer & 0xff00) {
        //same digit
        if (thisAnswer & 0xf00 > 0) {
            userAnswer = userAnswer & 0xf0f0;
        } else {
            userAnswer = userAnswer & 0xf0f;
        }
    }
    userAnswer = userAnswer | thisAnswer;
    // update style
    var buttons = document.getElementsByClassName("button");
    for (var i = 0; i < 20; i++) {
        var buttonValue = Number.parseInt(buttons[i].getAttribute("data-value"));
        if ((i < 10 ? (userAnswer & 0xf0f0) : (userAnswer & 0xf0f)) == buttonValue) {
            buttons[i].className = "button select";
        } else {
            buttons[i].className = "button";
        }
    }

    if ((userAnswer & 0xff00) != 0xff00) {
        return;
    }
    var myAnswer = ((userAnswer & 0xf0) >> 4) * 10 + (userAnswer & 0xf);
    questionDiv.innerText += " " + answer;
    questionDiv.className = answer == myAnswer ? 'right' : 'wrong';
    var cost = new Date().getTime() - startTime;
    cost = cost * 1.434;//分数缩放
    var thisCorrect = answer == myAnswer;
    if (thisCorrect) {
        correct++;
    }
    totalTime += cost;
    count++;
    answer = '';
    userAnswer = 0;
    if (count < maxCount) {
        setTimeout(gen, thisCorrect ? 1000 : 3000);
    } else {
        setTimeout(() => {
            //标准用时：2000ms=1000分
            questionDiv.innerText = Math.round(1.0 * correct / totalTime / (1.0 / 2000) * 1000 * 3.8);
        }, 1000);
    }
}

//初始答案按钮
function initButtion() {
    var isTouch = idDiv.ontouchstart === null;

    var line1 = document.createElement("div");
    line1.id = "line1";
    var line2 = document.createElement("div");
    line2.id = "line2";
    for (var i = 0; i < 20; i++) {
        var btn = document.createElement("div");
        btn.innerText = i % 10;
        btn.setAttribute("data-value", (i < 10 ? 0xf000 : 0xf00) | (i < 10 ? (i % 10 << 4) : i % 10));
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

function getRandomQuestion() {
    do {
        var a = Math.floor(Math.random() * 100);
        var b = Math.floor(Math.random() * 200) - 100;
        if (a + b >= 0 && a + b < 100 && Math.abs(a) > 10 && Math.abs(b) > 10) {
            return { question: "" + a + (b > 0 ? " + " : " - ") + Math.abs(b) + " =", answer: a + b };
        }
    } while (true);
}

//初始化题目
function gen() {
    var qa = getRandomQuestion();
    idDiv.innerText = "第" + (count + 1) + "/" + maxCount + "题";
    questionDiv.innerText = qa.question;
    questionDiv.className = '';
    question = qa.question;
    answer = qa.answer;
    startTime = new Date().getTime();
    var buttons = document.getElementsByClassName("button");
    for (var i = 0; i < 20; i++) {
        buttons[i].className = "button";
    }
}
gen();
