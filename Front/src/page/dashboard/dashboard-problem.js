import { LitElement, html } from "lit-element";

export default class problem extends LitElement {
  constructor() {
    super();
    this.data = {};
    this.loding = false;
    this.getdata();
  }

  async getdata() {
    this.data = JSON.parse(localStorage.getItem("data"));
    this.loding = true;
    this.requestUpdate();
  }
  render() {
    let wrong = [];
    let slow = [];
    for (let key of Object.keys(this.data)) {
      if (this.data[key].WrongProblem != null) {
        this.data[key].WrongProblem.map((v) => {
          return this.data[key].Problem[v.Problem_Id].Problem;
        }).forEach((element) => {
          wrong.push(element);
        });
      }
      if (this.data[key].LongProblem != null) {
        this.data[key].LongProblem.map((v) => {
          return this.data[key].Problem[v.Problem_Id].Problem;
        }).forEach((element) => {
          slow.push(element);
        });
      }
    }
    return html`
      <div class="problem">
        <div class="ll">
          <h1>오답 문제</h1>
          <table>
            <tr class="gamelist">
              <th>Problem</th>
            </tr>
            ${wrong.map((v) => {
              return html` <tr>
                <th>${v}</th>
              </tr>`;
            })}
          </table>
        </div>
        <div class="ll">
          <h1>느린 문제</h1>
          <table>
            <tr class="gamelist">
              <th>Problem</th>
            </tr>
            ${slow.map((v) => {
              return html`
                <tr>
                  <th>${v}</th>
                </tr>
              `;
            })}
          </table>
        </div>
        <style>
          th {
            font-size: 1.5rem;
          }
          .ll {
            width: 100vw;
            display: flex;
            flex-direction: column;
            align-items: center;
          }
          .problem {
            width: 100vw;
            display: flex;
            flex-direction: column;
            justify-content: space-around;
            gap: 5vw;
          }
          .gamelist {
            background-color: black;
            color: white;
            border: 0;
          }
          table {
            width: 100vw;
            height: 30vh;
            overflow: auto;
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
        </style>
      </div>
    `;
  }
}
