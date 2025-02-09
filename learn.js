var idDiv = document.getElementById("id");
var questionDiv = document.getElementById("question");
var answerDiv = document.getElementById("answer");
var answer='';
var startTime;

var totalTime = 0;
var correct = 0;
var count = 0;
var maxCount = parseInt(new URL(location.href).searchParams.get("c") || "20");

function clk() {
    if(answer=='') return;
    var myAnswer = this.innerText;
    questionDiv.innerText += " " + answer;
    questionDiv.className = answer == myAnswer ? 'right' : 'wrong';
    var cost = new Date().getTime() - startTime;
    if (answer == myAnswer) {
        correct++;
    }
    totalTime += cost;
    count++;
    answer='';
    if (count < maxCount) {
        setTimeout(gen, 1000);
    } else {
        setTimeout(() => {
            questionDiv.innerText = Math.round(1.0 * correct / totalTime / (1.0 / 2000) * 1000);
        }, 1000);
    }
}

//初始化界面
for (var i = 0; i < 20; i++) {
    var btn = document.createElement("button");
    btn.innerText = i + 1;
    btn.onclick = clk;
    answerDiv.appendChild(btn);
    if (i % 10 == 9) {
        answerDiv.appendChild(document.createElement("br"));
    }
}

//初始化题目
function gen() {
    var a = 1 + Math.floor(Math.random() * 9);
    var b = 1 + Math.floor(Math.random() * 9);
    idDiv.innerText = "第" + (count + 1) + "/" + maxCount + "题";
    questionDiv.innerText = a + " + " + b + " =";
    questionDiv.className = '';
    answer = a + b;
    startTime = new Date().getTime();
}
gen();