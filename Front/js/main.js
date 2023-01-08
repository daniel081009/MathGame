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
    this.body.innerHTML = `<div class="container">
    <fieldset>
      <div>
        <input type="radio" name="ri" class="item" id="huey" value="0" />
        <label for="huey">+</label>
      </div>
      <div>
        <input type="radio" name="ri" class="item" id="huey" value="1" />
        <label for="huey">-</label>
      </div>
      <div>
        <input type="radio" name="ri" class="item" id="huey" value="2" />
        <label for="huey">✕</label>
      </div>
      <div>
        <input type="radio" name="ri" class="item" id="huey" value="3" />
        <label for="huey">÷</label>
      </div>
    </fieldset>

    <fieldset>
      <div>
        <input type="radio" name="le" class="item" id="huey" value="0" />
        <label for="huey">0~10</label>
      </div>
      <div>
        <input type="radio" name="le" class="item" id="huey" value="1" />
        <label for="huey">0~20</label>
      </div>
      <div>
        <input type="radio" name="le" class="item" id="huey" value="2" />
        <label for="huey">0~50</label>
      </div>
    </fieldset>

    <fieldset>
      <div>
        <input type="radio" name="ti" class="item" id="huey" value="30" />
        <label for="huey">30s</label>
      </div>
      <div>
        <input type="radio" name="ti" class="item" id="huey" value="60" />
        <label for="huey">1m</label>
      </div>
      <div>
        <input type="radio" name="ti" class="item" id="huey" value="180" />
        <label for="huey">3m</label>
      </div>
      <div>
        <input type="radio" name="ti" class="item" id="huey" value="3000" />
        <label for="huey">5m</label>
      </div>
    </fieldset>
  </div>
  <div id="start" class="start">Start</div>
    `;

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
      <h1>ADD Game End</h1>
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
    if (a < b) {
      return this.Make();
    }
    this.Ok = a / b;
    return a + " / " + b + " = ?";
  }
  RandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}

const Ui = new UI(document.getElementById("main"));
