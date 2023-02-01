import { LitElement, html } from "lit-element";
import React from "react";
import { createRoot } from "react-dom/client";
import HeatMap from "@uiw/react-heat-map";

class Chartd extends LitElement {
  constructor() {
    super();
    this.data = {};
    this.wow = false;
    this.getdata();
  }
  createRenderRoot() {
    return this;
  }
  async getdata() {
    this.data = JSON.parse(localStorage.getItem("data"));
    this.wow = true;
    this.requestUpdate();
  }
  render() {
    if (this.wow) {
      let value = [];
      for (let key of Object.keys(this.data)) {
        value.push({
          date: new Date(this.data[key].EndTime).toLocaleDateString(),
          count: 1,
        });
      }

      let d = setTimeout(() => {
        function App() {
          return (
            <HeatMap
              fontSize={20}
              fontWeight={700}
              rectSize={15}
              value={value}
              width={940}
              height={300}
              weekLabels={["주일", "월", "화", "수", "목", "금", "토"]}
              monthLabels={[
                "1월",
                "2월",
                "3월",
                "4월",
                "5월",
                "6월",
                "7월",
                "8월",
                "9월",
                "10월",
                "11월",
                "12월",
              ]}
              style={{ color: "#ad001d" }}
              startDate={new Date(new Date().getFullYear() + "/01/01")}
              endDate={new Date(new Date().getFullYear() + "/12/31")}
            />
          );
        }

        const rootElement = document.getElementById("root");
        const root = createRoot(rootElement);

        root.render(
          <App
            callback={() => {
              console.log("renderered");
            }}
          />
        );
        clearTimeout(d);
      }, 10);
      // const chart = new Chart(document.getElementById("Chart"));
    }

    return html`
      <div id="root"></div>
      <canvas id="Chart"></canvas>

      <style>
        #root {
          width: 100vw;
          display: flex;
          justify-content: center;
        }
      </style>
    `;
  }
}
export default Chartd;
