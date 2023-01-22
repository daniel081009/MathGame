import { LitElement, html } from "lit-element";
import "./page/userauth";
import "./page/game";

function CheckToken() {
  if (localStorage.getItem("Token") == null) {
    return false;
  } else {
    document.cookie = `Token=${localStorage.getItem("Token")}`;
    return true;
  }
}

export class Top extends LitElement {
  constructor() {
    super();
  }
  createRenderRoot() {
    return this;
  }
  render() {
    return html`
      <div class="top">
        <div id="nickname">${localStorage.getItem("username")}</div>

        <div class="super_item">Dashboard</div>
        <div class="super_item">Ranking</div>
        <div class="super_item">Setting</div>
        <div class="super_item">Logout</div>
      </div>
    `;
  }
}

export class Main extends LitElement {
  constructor() {
    super();
    if (!CheckToken()) this.page = 0;
    else this.page = 1;
  }
  changePage(page) {
    this.page = page;
    this.requestUpdate();
  }
  createRenderRoot() {
    return this;
  }
  startClick() {
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
    const data = {
      type: ri.value,
      runningTime: ti.value,
      level: le.value,
    };
    console.log(data);
    // TODO : fetch
  }
  render() {
    if (this.page == 0) return html` <login-page></login-page>`;
    else if (this.page == 1)
      return html`
        <div class="main">
          <top-bar></top-bar>
          <div id="blockwow"></div>

          <game-main></game-main>
        </div>
      `;
  }
}
customElements.define("main-menu", Main);
customElements.define("top-bar", Top);
