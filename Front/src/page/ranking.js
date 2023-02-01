import { LitElement, html } from "lit-element";

class rank extends LitElement {
  constructor() {
    super();
  }
  createRenderRoot() {
    return this;
  }
  render() {
    return html`
      <div>
        <h1>Ranking</h1>
      </div>
    `;
  }
}

customElements.define("ranking-page", rank);
