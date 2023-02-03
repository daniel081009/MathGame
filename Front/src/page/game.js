import { LitElement, html } from "lit-element";
import Chart from "chart.js/auto";
require("dotenv").config();

export class GameMain extends LitElement {
  init() {
    // 0: menu, 1: game ,2: End
    this.page = 0;

    this.game_id = "";
    this.game_start = false;
    this.back_game_start = false;
    this.game_setting = {
      type: 0,
      runningTime: 0,
      level: 0,
      rankgame: false,
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
    let data = await axios.post(
      process.env.ServerURL + "/game/create",
      this.game_setting,
      {
        withCredentials: true,
      }
    );
    this.problem = data.data.problem;
    this.gmae_id = data.data.ID;

    this.game_start = true;
    (async () => {
      await this.sleep(this.game_setting.runningTime * 1000);
      await this.game_end();
    })();
    if (this.game_start) {
      this.index = 0;
      this.page = 1;
      this.requestUpdate();
      this.start_time = new Date();
    }
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
      rankgame: document.getElementById("check1").checked,
    });
  }
  setting() {
    return html`
      <div class="container">
        <div class="inputcon">
          Rank
          <input class="input" type="checkbox" id="check1" />
          <label for="check1"></label>
        </div>
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
        body {
          width: 100vw;
        }
        .container {
          width: 100vw;
          height: 50vh;
        }
        .inputcon {
          margin-top: 0.2vh;
          width: 90%;
          height: min-content;
          display: flex;
          justify-content: right;
          align-items: center;
          font-size: 2rem;
        }
        .input[type="checkbox"] {
          display: none;
        }
        .input[type="checkbox"] + label {
          display: inline-block;
          width: 5vw;
          height: 5vw;
          font-size: 2rem;
          border: 3px solid #707070;
          position: relative;
        }
        .input[id="check1"]:checked + label::after {
          content: "✔";
          font-size: 3rem;
          width: 5vw;
          height: 5vw;
          text-align: center;
          position: absolute;
          left: 0;
          top: 0;
        }
        .container {
          display: flex;
          align-items: center;
          justify-content: space-around;
          flex-direction: column;
          border: 0.6vh solid rgb(61, 61, 61);
          border-radius: 5vh;
        }
        .item {
          display: flex;
          margin-left: 1rem;
          text-align: center;
          justify-content: center;
          font-size: 5rem;
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
          width: 50vw;
          font-size: 4rem;
          font-weight: 300;
          margin: 0;
          padding: 0;
          margin-top: 1rem;
          cursor: pointer;
          transition: all 0.2s ease-in-out;
          display: flex;
          align-items: center;
          justify-content: center;
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

        .item_radio {
          width: 3vh;
        }
        .item_radio:checked + label {
          color: #2196f3;
          font-weight: 500;
        }
      </style>
    `;
  }

  game_enter(e) {
    if (
      (!this.game_start && !this.back_game_start) ||
      this.index >= this.problem.length
    ) {
      this.back_game_start = true;
      this.game_end();
      return;
    } else if (!this.game_start && this.back_game_start) {
      this.page = 2;
      this.requestUpdate();
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
      process.env.ServerURL + "/game/end",
      {
        id: this.gmae_id,
        tlog: this.history,
      },
      {
        withCredentials: true,
      }
    );
    this.game_start = false;
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
        <input type="number" autofocus @keyup=${this.game_enter} />
      </div>
      <style>
        .container {
          width: 100vw;
          height: 50vh;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          border: 0.6vh solid rgb(61, 61, 61);
          border-radius: 5vh;
        }
        #problem {
          font-size: 15rem;
          font-weight: 300;
          margin: 0;
          padding: 0;
          margin-bottom: 1rem;
        }
        .container > input {
          width: 50vw;
          font-size: 2rem;
        }
      </style>
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
    function wr(game_end_data) {
      if (game_end_data.data.WrongProblem == null) {
        return html`<div class="wrongproblem">
          ${game_end_data.data.TLog.length}개중 0개의 문제를 틀렸습니다.
        </div>`;
      }
      return html`
        <div class="wrongproblem">
          ${game_end_data.data.TLog.length}개중
          ${game_end_data.data.WrongProblem.length}개의 문제를 틀렸습니다.
          <div class="wrongproblem_list">
            ${game_end_data.data.WrongProblem.map(
              (item) => html`
                <div class="wrongproblem_item">
                  <div class="wrongproblem_item_problem">
                    ${game_end_data.data.Problem[item.Problem_Id].Problem}
                  </div>
                  <div class="wrongproblem_item_user">${item.User_Answer}</div>
                  <div class="wrongproblem_item_time">
                    ${Math.round(item.Time / 1000)}초(${item.Time}ms)
                  </div>
                </div>
              `
            )}
          </div>
        </div>
      `;
    }
    let d = setTimeout(() => {
      const chart = new Chart(document.getElementById("test"), {
        type: "line",
        options: {
          interaction: {
            mode: "nearest",
          },
          // onClick: (e) => {
          //   const canvasPosition = getRelativePosition(e, chart);

          //   const dataX = chart.scales.x.getValueForPixel(canvasPosition.x);
          // },
          scales: {
            x: {
              type: "linear",
            },
            y: {
              type: "linear",
              ticks: {
                // Include a dollar sign in the ticks
                callback: function (value, index, ticks) {
                  return value + "ms";
                },
              },
            },
          },
        },
        data: {
          labels: this.game_end_data.data.TLog.map((item) => {
            return item.Problem_Id;
          }),
          datasets: [
            {
              label: "delay(ms)",
              data: this.game_end_data.data.TLog.map((item) => {
                return {
                  y: item.Time,
                  x: item.Problem_Id,
                };
              }),
              backgroundColor: [
                "rgba(255, 99, 132, 0.2)",
                "rgba(54, 162, 235, 0.2)",
                "rgba(255, 206, 86, 0.2)",
                "rgba(75, 192, 192, 0.2)",
                "rgba(153, 102, 255, 0.2)",
                "rgba(255, 159, 64, 0.2)",
              ],
              borderColor: [
                "rgba(255,99,132,1)",
                "rgba(54, 162, 235, 1)",
                "rgba(255, 206, 86, 1)",
                "rgba(75, 192, 192, 1)",
                "rgba(153, 102, 255, 1)",
                "rgba(255, 159, 64, 1)",
              ],
              borderWidth: 1,
            },
          ],
        },
      });
      clearTimeout(d);
    });

    return html`
      <div class="end_page">
        <div id="score">${this.game_end_data.data.Score}점</div>
        <div id="avgtime">
          문제당 평균 소요 시간 :
          ${Math.round(this.game_end_data.data.AverageTime / 1000)}초
        </div>

        <div class="chart">
          <canvas id="test"></canvas>
        </div>
        <div class="problem">
          ${wr(this.game_end_data)}
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
          Re Start!
        </div>
        <div
          class="sm button"
          @click=${() => {
            this.page = 0;
            this.requestUpdate();
          }}
        >
          Return Home
        </div>
      </div>
      <style>
        .end_page {
          display: flex;
          flex-flow: column;
          align-items: center;
          justify-content: center;
        }
        #score {
          font-family: "LINESeedKR-Bd";
          font-size: 5rem;
          font-weight: 300;
          margin: 0;
          padding: 0;
          margin-top: 1rem;
          cursor: pointer;
          transition: all 0.2s ease-in-out;
        }

        #score:hover {
          transform: scale(1.3);
        }
        #avgtime {
          font-size: 3rem;
          font-weight: 300;
          margin: 0;
          padding: 0;
          margin-top: 1rem;
          cursor: pointer;
          transition: all 0.2s ease-in-out;
        }
        .problem {
          display: flex;
          margin: 10vw;
          gap: 1rem;

          font-size: 1.5rem;
          font-weight: 300;
          margin: 0;
          padding: 0;
          margin-top: 1rem;
          cursor: pointer;
          transition: all 0.2s ease-in-out;
        }

        .wrongproblem {
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .wrongproblem_item {
          display: flex;
          gap: 2vw;
        }
        .wrongproblem_item_problem {
          font-weight: 400;
        }
        .longproblem {
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .longproblem_item {
          display: flex;
          gap: 2vw;
        }

        .longproblem_item_problem {
          font-weight: 400;
        }
        .button {
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
          border-radius: 2vh;
          font-family: "GmarketSansMedium";
          font-weight: 500;
        }
        .button:hover {
          transform: scale(1.1);
        }
        .sm {
          color: #6a6a6a;
          font-size: 1.5rem;
        }
        .chart {
          width: 60vw;
        }
      </style>
    `;
  }
}

customElements.define("game-main", GameMain);
