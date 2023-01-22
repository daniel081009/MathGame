import { LitElement, html } from "lit-element";

const BaseURL = "http://localhost:8080";
export class GameMain extends LitElement {
  constructor() {
    super();
    // 0: menu, 1: game ,2: End
    this.page = 0;

    this.game_id = "";
    this.game_setting = {
      type: 0,
      runningTime: 0,
      level: 0,
    };
    this.start_time = 0; // 게임 시작 시간
    this.problem = [];
    this.history = [];
    this.index = 0;
    this.semple = {
      Problem: "",
      Answer: 0,
      User_Answer: 0,
      Time: 0,
    };
  }
  createRenderRoot() {
    return this;
  }
  async sleep(ms) {
    return new Promise((r) => setTimeout(r, ms));
  }

  async Start() {
    const ri = document.querySelector('input[name="ri"]:checked');
    const le = document.querySelector('input[name="le"]:checked');
    const ti = document.querySelector('input[name="ti"]:checked');

    if (ri == null || le == null || ti == null) {
      let temp = document.createElement("div");
      temp.innerText = "선택좀;;";
      temp.style.color = "red";
      temp.style.fontSize = "2rem";
      temp.id = "error";
      document.getElementsByClassName("container")[0].appendChild(temp);
      return;
    } else {
      try {
        let temp = document.getElementById("error");
        temp.remove();
      } catch (e) {}
    }
    this.game_setting = {
      type: Number(ri.value),
      runningTime: Number(ti.value),
      level: Number(le.value),
    };
    let data = await axios.post(BaseURL + "/game/create", this.game_setting, {
      withCredentials: true,
    });
    this.problem = data.data.problem;
    this.gmae_id = data.data.ID;
    (async () => {
      console.log("start");
      await this.sleep(this.game_setting.runningTime * 1000);
      console.log("end");
      await this.game_end();
    })();
    // this.a = setInterval(async () => {
    //   await this.game_end();
    //   clearInterval(this.a);
    // }, this.game_setting.runningTime * 1000);
    this.index = 0;
    this.page = 1;
    this.requestUpdate();
    this.start_time = new Date();
  }
  setting() {
    return html`
      <div class="container">
        <fieldset>
          <label class="item">
            <input
              type="radio"
              name="ri"
              class="item_radio"
              id="huey"
              value="0"
            />
            <label for="huey">+</label>
          </label>
          <label class="item">
            <input
              type="radio"
              name="ri"
              class="item_radio"
              id="huey"
              value="1"
            />
            <label for="huey">-</label>
          </label>
          <label class="item">
            <input
              type="radio"
              name="ri"
              class="item_radio"
              id="huey"
              value="2"
            />
            <label for="huey">✕</label>
          </label>
          <label class="item">
            <input
              type="radio"
              name="ri"
              class="item_radio"
              id="huey"
              value="3"
            />
            <label for="huey">÷</label>
          </label>
          <label class="item">
            <input
              type="radio"
              name="ri"
              class="item_radio"
              id="huey"
              value="4"
            />
            <label for="huey">ALL</label>
          </label>
        </fieldset>

        <fieldset>
          <label class="item">
            <input
              type="radio"
              name="le"
              class="item_radio"
              id="huey"
              value="0"
            />
            <label for="huey">0~10</label>
          </label>
          <label class="item">
            <input
              type="radio"
              name="le"
              class="item_radio"
              id="huey"
              value="1"
            />
            <label for="huey">0~20</label>
          </label>
          <label class="item">
            <input
              type="radio"
              name="le"
              class="item_radio"
              id="huey"
              value="2"
            />
            <label for="huey">0~50</label>
          </label>
        </fieldset>

        <fieldset>
          <label class="item">
            <input
              type="radio"
              name="ti"
              class="item_radio"
              id="huey"
              value="30"
            />
            <label for="huey">30s</label>
          </label>
          <label class="item">
            <input
              type="radio"
              name="ti"
              class="item_radio"
              id="huey"
              value="60"
            />
            <label for="huey">1m</label>
          </label>
          <label class="item">
            <input
              type="radio"
              name="ti"
              class="item_radio"
              id="huey"
              value="180"
            />
            <label for="huey">3m</label>
          </label>
          <label class="item">
            <input
              type="radio"
              name="ti"
              class="item_radio"
              id="huey"
              value="3000"
            />
            <label for="huey">5m</label>
          </label>
        </fieldset>
      </div>
      <button @click=${this.Start} class="start">start</button>
      <style>
        .container {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          border: 0.6vh solid rgb(61, 61, 61);
          border-radius: 5vh;
        }
        fieldset {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          border: none;
          font-size: 3rem;
        }
        .start {
          font-size: 2.5rem;
          font-weight: 300;
          margin: 0;
          padding: 0;
          margin-top: 1rem;
          cursor: pointer;
          transition: all 0.2s ease-in-out;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 15vw;
          padding-left: 8vw;
          padding-right: 8vw;
          border: 0.6vh solid rgb(61, 61, 61);
          border-radius: 2vh;
          font-family: "GmarketSansMedium";
          font-weight: 500;
        }
      </style>
    `;
  }
  // game_en/

  game_enter(e) {
    if (this.index >= this.problem.length) {
      this.game_end();
      return;
    }
    if (e.keyCode === 13) {
      console.log(this.semple, e.target.value);
      let temp = this.semple;
      temp.Problem = this.problem[this.index].Problem;
      temp.Answer = this.problem[this.index].Answer;
      temp.Time = this.start_time - new Date();
      temp.Time *= -1;
      temp.User_Answer = Number(e.target.value);

      console.log(this.problem[this.index], temp, this.history);
      this.history.push(temp);
      this.index++;
      this.requestUpdate();

      this.start_time = new Date();
      e.target.value = "";
    }
  }
  async game_end() {
    console.log(this.history, "end!");
    console.log(this.gmae_id, this.problem, this.history);
    let data = await axios.post(
      "http://localhost:8080/game/end",
      {
        id: this.gmae_id,
        tlog: this.history,
      },
      {
        withCredentials: true,
      }
    );
    this.game_end_data = data.data;
    console.log(this.game_end_data);
    this.page = 2;
    this.requestUpdate();
  }
  render() {
    if (this.page === 0) {
      return this.setting();
    } else if (this.page === 1) {
      return this.game();
    } else {
      return this.end();
    }
  }

  game() {
    return html`
      <div class="container">
        <div id="problem">${this.problem[this.index].Problem}</div>
        <input type="number" autofocus @keypress=${this.game_enter} />
      </div>
    `;
  }
  end() {
    return html`
      <div class="container">
        <div id="problem">end</div>
      </div>
    `;
  }
}

customElements.define("game-main", GameMain);
