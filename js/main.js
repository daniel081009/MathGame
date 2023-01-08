class UI {
  constructor(body) {
    this.body = body;
    this.timer = null;
    this.Chose = new Add();

    window.onload = () => {
      this.MainPage();
    };
  }

  MainPage() {
    function AllChclear() {
      document.body.querySelector("#plus").classList = ["item"];
      document.body.querySelector("#sub").classList = ["item"];
      document.body.querySelector("#mult").classList = ["item"];
      document.body.querySelector("#division").classList = ["item"];
    }
    this.body.innerHTML = `
    <h1>Math Game</h1>
    <div class="grid">
      <div class="item ch" id="plus">+</div>
      <div class="item" id="sub">-</div>
      <div class="item" id="mult">✕</div>
      <div class="item" id="division">÷</div>
    </div>
    <div id="start">Start</div>
    `;
    document.body.querySelector("#plus").onclick = () => {
      this.Chose = new Add();
      AllChclear();
      document.body.querySelector("#plus").classList.add("ch");
    };
    document.body.querySelector("#sub").onclick = () => {
      this.Chose = new subtraction();
      AllChclear();
      document.body.querySelector("#sub").classList.add("ch");
    };
    document.body.querySelector("#mult").onclick = () => {
      this.Chose = new multiplication();
      AllChclear();
      document.body.querySelector("#mult").classList.add("ch");
    };
    document.body.querySelector("#division").onclick = () => {
      this.Chose = new division();
      AllChclear();
      document.body.querySelector("#division").classList.add("ch");
    };
    this.startbutton();
  }
  GamePage() {
    this.body.innerHTML = `
    <div id= "plus">A + B</div>
    <input id="input" type="number" />
    `;
    document.getElementById("plus").innerText = this.Chose.Make();
    document.getElementById("input").onkeypress = (e) => {
      if (e.key === "Enter") {
        if (this.Chose.Check(document.getElementById("input").value)) {
          document.getElementById("plus").innerText = this.Chose.Make();
          document.getElementById("plus").style.color = "";
        } else {
          document.getElementById("plus").style.color = "red";
        }
        document.getElementById("input").value = "";
      }
    };
  }
  EndPage() {
    this.body.innerHTML = `
      <h1>End!</h1>
      <div class="end"></div>
      <div id="start">Start</div>
    `;
    console.log(this.Chose.score);
    document.body.querySelector(".end").innerText = this.Chose.score;
    this.startbutton();
  }
  startbutton() {
    if (this.Chose == null) {
      return;
    }
    document.onkeypress = (e) => {
      console.log(e.key);
      if (e.key === "spacebar") {
        this.start();
      }
    };
    document.body.querySelector("#start").onclick = () => {
      this.start();
    };
  }
  start() {
    this.Chose.score = 0;
    this.GamePage();
    this.timer = setTimeout(() => {
      this.EndPage();
    }, 1000 * 60);
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
class subtraction {
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
    if (a< b) {
      return Make() 
    }
    this.Ok = a - b;
    return a + " - " + b + " = ?";
  }
  RandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}
class multiplication {
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
    this.Ok = a * b;
    return a + " ⨯ " + b + " = ?";
  }
  RandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}
class division {
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
    if (a % b != 0) {
      return Make()
    }
    this.Ok = a / b;
    return a + " / " + b + " = ?";
  }
  RandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}

const Ui = new UI(document.getElementById("main"));
