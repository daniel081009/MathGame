import { LitElement, html } from "lit-element";
import "./page/userauth";
import "./page/game";
import "./page/dashboard/dashboard";
import "./page/ranking";

function CheckToken() {
  if (localStorage.getItem("Token") == null) {
    return false;
  } else {
    document.cookie = `Token=${localStorage.getItem("Token")}`;
    return true;
  }
}

export class Main extends LitElement {
  constructor() {
    super();
    if (!CheckToken()) this.page = 0;
    else this.page = 1;
  }
  createRenderRoot() {
    return this;
  }
  top() {
    return html`
      <div class="top">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div class="dropdown">
          <span>${localStorage.getItem("username")}</span>
          <div class="dropdown-content">
            <div
              @click=${() => {
                this.page = 1;
                this.requestUpdate();
              }}
            >
              menu
            </div>
            <div
              @click=${() => {
                this.page = 2;
                this.requestUpdate();
              }}
            >
              Dashboard
            </div>
            <div
              @click=${() => {
                this.page = 3;
                this.requestUpdate();
              }}
            >
              Ranking
            </div>
            <!-- <div
              @click=${() => {
              // TODO : 관련 설정이 필요할때 추가
            }}
            >
              Setting
            </div> -->
            <div
              @click=${() => {
                localStorage.removeItem("username");
                localStorage.removeItem("Token");
                location.reload(true);
                location;
              }}
            >
              Logout
            </div>
          </div>
        </div>
      </div>
      <style>
        .top {
          height: fit-content;
          display: flex;
          justify-content: space-around;
          align-items: center;
          font-size: 2rem;
        }
        .dropdown > span {
          width: 20vw;
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 2rem;
          font-family: "GmarketSansMedium";
        }
        .dropdown {
          display: block;
          width: 20vw;
        }
        .dropdown-content {
          width: 20vw;
          display: none;
          position: absolute;
          background-color: #f9f9f9;
          color: #242424;
          min-width: 160px;
          box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
          padding: 2px;
          z-index: 1;
        }
        .dropdown-content > div {
          display: flex;
          align-items: center;
          flex-flow: column;
          width: 100%;
        }
        .dropdown-content > div:hover {
          background-color: #f1f1f1;
        }
        .dropdown:hover .dropdown-content {
          display: flex;
          align-items: center;
          flex-flow: column;
        }
      </style>
    `;
  }
  render() {
    // this.page = 3;
    if (this.page == 0) return html` <login-page></login-page>`;
    else if (this.page == 1)
      return html`
        <div class="main">
          ${this.top()}

          <game-main></game-main>
          <div></div>
          <div></div>
        </div>
      `;
    else if (this.page == 2)
      return html`
        <div class="main">
          ${this.top()}
          <dashboard-page></dashboard-page>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
      `;
    else if (this.page == 3)
      return html`
        <div class="main">
          ${this.top()}
          <rank-page></rank-page>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
      `;
  }
}
customElements.define("main-menu", Main);
