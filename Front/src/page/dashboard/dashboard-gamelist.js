import { LitElement, html } from "lit-element";

const BaseURL = "http://localhost:8080";
class GameList extends LitElement {
  constructor() {
    super();
    this.dd = null;
    this.data = {};
    this.game_pro_item_arr = [];
    this.getdata();
  }
  async getdata() {
    this.data = JSON.parse(localStorage.getItem("data"));
    this.requestUpdate();
  }
  async gamelistitemclick(data) {
    this.game_pro_item_arr = [];
    console.log("click");

    let res = await axios.get(`${BaseURL}/game/get/${data.target.id}`, {
      withCredentials: true,
    });
    for (let data of res.data.data.TLog) {
      let class_name = "no";
      if (
        Number(data.User_Answer) ==
        res.data.data.Problem[data.Problem_Id].Answer
      ) {
        class_name = "ok";
      }
      this.game_pro_item_arr.push(html`
        <tr class=${class_name}>
          <th>
            <div>${res.data.data.Problem[data.Problem_Id].Problem}</div>
          </th>
          <th>${res.data.data.Problem[data.Problem_Id].Answer}</th>
          <th>${data.User_Answer}</th>
        </tr>
      `);
    }
    this.requestUpdate();
  }
  render() {
    this.data_arr = Object.keys(this.data).sort(
      (a, b) => new Date(this.data[a].EndTime) - new Date(this.data[b].EndTime)
    ); // 날짜순으로 정렬 (내림차순)
    this.data_arr = this.data_arr.reverse(); // 날짜순으로 정렬 (오름차순)

    let game_list_arr = [];
    function text(a) {
      if (a == 1) return "완료";
      else if (a == 2) return "비정상 종료";
    }
    for (let key of this.data_arr) {
      if (this.data[key].EndGame == 0) continue;
      game_list_arr.push(html`
        <tr @click=${this.gamelistitemclick} class="list-item">
          <th id=${key}>${this.data[key].Id}</th>
          <th id=${key}>${this.data[key].Score}</th>
          <th id=${key}>
            ${new Date(this.data[key].EndTime).toLocaleString()}
          </th>
          <th id=${key}>${this.data[key].Setting.rankgame}</th>
          <th id=${key}>${text(this.data[key].EndGame)}</th>
        </tr>
      `);
    }

    return html`
      <div class="game">
        <div class="game-list">
          <table>
            <tr class="gamelist">
              <th>Id</th>
              <th>Score</th>
              <th>Date</th>
              <th>RankGame</th>
              <th>State</th>
            </tr>
            ${game_list_arr}
          </table>
        </div>
        <div class="game-pro">
          <table>
            <tr class="gamelist">
              <th>Problem</th>
              <th>Answer</th>
              <th>User_Answer</th>
            </tr>
            ${this.game_pro_item_arr}
          </table>
        </div>
      </div>
      <style>
        .game {
          width: 100vw;
          display: flex;
          align-items: center;
          gap: 3vw;
        }
        .game-list {
          width: 60vw;
          height: 30vh;
          /* border: 0.4vw solid black; */
          border-radius: 1vw;
          overflow: auto;
          margin: 1vw;
        }
        .game-list-item {
          display: flex;
          justify-content: space-around;
          font-size: 1.5rem;
          gap: 1vw;
        }
        .game-list-item:hover {
          background-color: #e6e6e6;
          border-radius: 1vw;
        }
        .ok {
          background-color: #79cf9f;
        }
        .no {
          background-color: #db4455;
        }

        table {
          width: 100%;
          border-top: 1px solid #444444;
          border-collapse: collapse;
          overflow: auto;
        }
        table::-webkit-scrollbar {
          width: 10px;
        }
        table::-webkit-scrollbar-thumb {
          background-color: #2f3542;
          border-radius: 10px;
        }
        table::-webkit-scrollbar-track {
          background-color: grey;
          border-radius: 10px;
          box-shadow: inset 0px 0px 5px white;
        }
        .gamelist {
          background-color: black;
          color: white;
          border: 0;
        }
        th,
        td {
          border-bottom: 1px solid #444444;
          padding: 10px;
        }
        .list-item:hover {
          background-color: #e6e6e6;
        }
        .game-pro {
          width: 40vw;
          height: 30vh;

          /* border: 0.4vw solid black; */
          border-radius: 1vw;
          overflow: auto;
          margin: 1vw;
        }
      </style>
    `;
  }
}
export default GameList;
