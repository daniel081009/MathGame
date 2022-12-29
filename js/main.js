class UI {
  constructor(body) {
    this.body = body;
    this.timer = null;
    this.Add = new Add();
    this.AddMainPage();
  }
  AddMainPage() {
    this.body.innerHTML = `
      <h1>ADD Game</h1>
      <div id="start">Start</div>
    `;
    document.body.querySelector("#start").onclick = () => {
      this.Add.score = 0;
      this.AddGamePage();
      this.timer = setTimeout(() => {
        this.AddEndPage();
      }, 1000 * 60);
    };
  }
  AddGamePage() {
    this.body.innerHTML = `
    <div id= "plus">A + B</div>
    <input id="number" type="text" />
    `;
    document.getElementById("plus").innerText = this.Add.Make();
    document.getElementById("input").onkeypress = (e) => {
      if (e.key === "Enter") {
        if (this.Add.Check(document.getElementById("input").value)) {
          document.getElementById("plus").innerText = this.Add.Make();
          document.getElementById("plus").style.color = "";
        } else {
          document.getElementById("plus").style.color = "red";
        }
        document.getElementById("input").value = "";
      }
    };
  }
  AddEndPage() {
    this.body.innerHTML = `
      <h1>ADD Game End</h1>
      <div class="end"></div>
      <div id="start">Start</div>
    `;
    console.log(this.Add.score);
    document.body.querySelector(".end").innerText = this.Add.score;
    document.body.querySelector("#start").onclick = () => {
      this.Add.score = 0;
      this.AddGamePage();
      this.timer = setTimeout(() => {
        this.AddEndPage();
      }, 1000 * 60);
    };
  }
}

class Add {
  constructor() {
    this.level = 10;
    this.score = 0;
    this.Ok = 0;
  }
  Check(temp_Ok) {
    if (this.Ok == temp_Ok) {
      this.score++;
      return true;
    } else {
      this.score--;
      return false;
    }
  }
  Make() {
    let a = this.RandomInt(0, this.level);
    let b = this.RandomInt(0, this.level);
    this.Ok = a + b;
    return a + " + " + b + " = ?";
  }
  RandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}
const Ui = new UI(document.getElementById("main"));
