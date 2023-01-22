import { LitElement, html } from "lit-element";

const BaseURL = "http://localhost:8080";
export class GameMain extends LitElement {
  init() {
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
  }
  constructor() {
    super();
    this.init();
  }
  createRenderRoot() {
    return this;
  }
  async sleep(ms) {
    return new Promise((r) => setTimeout(r, ms));
  }

  async Start_System(game_setting) {
    this.game_setting = game_setting;
    let data = await axios.post(BaseURL + "/game/create", this.game_setting, {
      withCredentials: true,
    });
    this.problem = data.data.problem;
    this.gmae_id = data.data.ID;
    (async () => {
      await this.sleep(this.game_setting.runningTime * 1000);
      await this.game_end();
    })();
    this.index = 0;
    this.page = 1;
    this.requestUpdate();
    this.start_time = new Date();
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
    this.Start_System({
      type: Number(ri.value),
      runningTime: Number(ti.value),
      level: Number(le.value),
    });
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
        .start:hover {
          transform: scale(1.1);
        }
      </style>
    `;
  }

  game_enter(e) {
    if (this.index >= this.problem.length) {
      this.game_end();
      return;
    }
    if (e.keyCode === 13) {
      let temp = {
        Problem_Id: this.index,
        Problem: this.problem[this.index].Problem,
        User_Answer: Number(e.target.value),
        Time: (this.start_time - new Date()) * -1,
      };

      this.history[this.index] = temp;
      this.index++;
      this.requestUpdate();

      this.start_time = new Date();
      e.target.value = "";
    }
  }
  async game_end() {
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
    this.page = 2;
    await this.sleep(100);
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
    if (this.game_end_data == null) {
      this.init();
      this.page = 0;
      this.requestUpdate();
      this.render();
      return;
    }
    return html`
      <div class="end_page">
        <div id="score">${this.game_end_data.data.Score}점</div>
        <div id="avgtime">
          문제당 평균 소요 시간 :
          ${Math.round(this.game_end_data.data.AverageTime / 1000)}초
        </div>
        <div class="problem">
          <div class="wrongproblem">
            ${this.game_end_data.data.TLog.length}개중
            ${this.game_end_data.data.WrongProblem.length}개의 문제를
            틀렸습니다.
            <div class="wrongproblem_list">
              ${this.game_end_data.data.WrongProblem.map(
                (item) => html`
                  <div class="wrongproblem_item">
                    <div class="wrongproblem_item_problem">
                      ${this.game_end_data.data.Problem[item.Problem_Id]
                        .Problem}
                    </div>
                    <div class="wrongproblem_item_time">
                      ${Math.round(item.Time / 1000)}초
                    </div>
                  </div>
                `
              )}
            </div>
          </div>
          <div class="longproblem">
            ${this.game_end_data.data.LongProblem.length}개의 문제를 평균보다
            오래 풀었습니다.
            <div class="longproblem_list">
              ${this.game_end_data.data.LongProblem.map(
                (item) => html`
                  <div class="longproblem_item">
                    <div class="longproblem_item_problem">
                      ${this.game_end_data.data.Problem[item.Problem_Id]
                        .Problem}
                    </div>
                    <div class="longproblem_item_time">
                      ${Math.round(item.Time / 1000)}초
                    </div>
                  </div>
                `
              )}
            </div>
          </div>
        </div>
        <div
          class="button"
          @click=${() => {
            let setting = this.game_setting;
            this.init();
            this.Start_System(setting);
          }}
        >
          다시하기!
        </div>
        <div
          class="sm button"
          @click=${() => {
            this.page = 0;
            this.requestUpdate();
          }}
        >
          홈화면으로!
        </div>
      </div>
    `;
  }
}

customElements.define("game-main", GameMain);
