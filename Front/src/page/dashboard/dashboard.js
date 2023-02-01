import { LitElement, html } from "lit-element";
import Chartd from "./dashboard-chart";
import GameList from "./dashboard-gamelist";

const BaseURL = "http://localhost:8080";
export class dashboard extends LitElement {
  constructor() {
    super();
    this.dd = null;
    this.load = false;
  }

  async getdata() {
    try {
      let res = await axios.get(`${BaseURL}/game/get`, {
        withCredentials: true,
      });
      this.data = res.data.data;
      this.load = true;
      localStorage.setItem("data", JSON.stringify(res.data.data));
      this.requestUpdate();
    } catch (e) {
      localStorage.removeItem("username");
      localStorage.removeItem("Token");
      location.reload(true);
      location;
      console.log(e);
    }
  }
  createRenderRoot() {
    return this;
  }
  render() {
    if (this.load == false) {
      (async () => {
        await this.getdata();
      })();
      return html`<div class="chart">로딩중</div>`;
    }
    console.log(JSON.parse(localStorage.getItem("data")));

    return html`
      <div class="dashboard">
        <div class="toptop">${localStorage.getItem("username")}</div>
        <dashboard-gamelist></dashboard-gamelist>
        <dashboard-chart></dashboard-chart>
      </div>
      <style>
        .toptop {
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 4rem;
          font-family: "KorailRoundGothicBold";
          margin-bottom: 1vh;
        }
        .dashboard {
          width: 100%;
          height: 100%;
        }

        .chart {
          disflex: flex;
          justify-content: center;
          align-items: center;
          width: 100vw;
        }

        @font-face {
          font-family: "KorailRoundGothicBold";
          src: url("https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_2212@1.0/KorailRoundGothicBold.woff2")
            format("woff2");
          font-weight: 700;
          font-style: normal;
        }
      </style>
    `;
  }
}

customElements.define("dashboard-chart", Chartd);
customElements.define("dashboard-gamelist", GameList);
customElements.define("dashboard-page", dashboard);
