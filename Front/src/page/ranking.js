import { LitElement, html } from "lit-element";
require("dotenv").config();

class rank extends LitElement {
  constructor() {
    super();
    this.data = {};
    this.loding = false;
    this.getdata();
  }
  async getdata() {
    try {
      let res = await axios.get(`${process.env.ServerURL}/rank/all`, {
        withCredentials: true,
      });
      this.data = res.data.rank;
      this.loding = true;
      this.requestUpdate();
    } catch (e) {
      console.log(e);
    }
  }

  createRenderRoot() {
    return this;
  }
  text(data) {
    let text = "";
    let d = data.split("_");
    console.log(d);
    if (Number(d[0]) == 0) {
      text = "+";
    } else if (Number(d[0]) == 1) {
      text = "-";
    } else if (Number(d[0]) == 2) {
      text = "✕";
    } else if (Number(d[0]) == 3) {
      text = "÷";
    }
    if (Number(d[1]) == 0) {
      text += " 0~10";
    } else if (Number(d[1]) == 1) {
      text += " 0~20";
    } else if (Number(d[1]) == 2) {
      text += " 0~50";
    }
    if (Number(d[2]) == 30) {
      text += " 30sec";
    } else if (Number(d[2]) == 60) {
      text += " 1min";
    } else if (Number(d[2]) == 180) {
      text += " 3min";
    } else if (Number(d[2]) == 3000) {
      text += " 5min";
    }
    return text;
  }
  render() {
    if (this.loding == false) {
      return html`<div class="chart">로딩중</div>`;
    }

    return html`
      <div class="wow">
        <h1>Ranking</h1>
        <div class="grid">
          ${Object.keys(this.data).map((key) => {
            return html`
              <div class="asdf">
                <h1>${this.text(key)}</h1>
                <table>
                  <tr class="gamelist">
                    <th>ranking</th>
                    <th>username</th>
                    <th>score</th>
                  </tr>
                  ${this.data[key].Rank.map((v, i) => {
                    console.log(v);
                    return html` <tr>
                      <th>${i + 1}</th>
                      <th>${v.UserName}</th>
                      <th>${v.Game.Score}</th>
                    </tr>`;
                  })}
                </table>
              </div>
            `;
          })}
        </div>
      </div>
      <style>
        .asdf {
          display: flex;
          flex-flow: column;
          align-items: center;
          justify-content: center;
        }
        .grid {
          width: 100vw;
          display: grid;
          padding: 1vw;
          grid-template-columns: repeat(2, 1fr);
          grid-auto-rows: 1fr;
          gap: 5vw;
        }
        table {
          width: 100%;
          border-top: 1px solid #444444;
          border-collapse: collapse;
          gap: 5vw;
          align-items: center;
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
        .wow {
          display: flex;
          flex-flow: column;
          align-items: center;
          justify-content: center;
        }
      </style>
    `;
  }
}

customElements.define("rank-page", rank);
