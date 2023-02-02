import { LitElement, html } from "lit-element";
import React from "react";
import { createRoot } from "react-dom/client";
import Chart from "chart.js/auto";
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
              className="heatmap"
              fontSize={20}
              fontWeight={700}
              rectSize={13}
              value={value}
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

        root.render(<App />);
        clearTimeout(d);

        let arr = [0, 0, 0, 0, 0];
        for (let key of Object.keys(this.data)) {
          arr[this.data[key].Setting.type] += 1;
        }
        new Chart(document.getElementById("Chart"), {
          type: "polarArea",
          data: {
            labels: ["더하기", "빼기", "나누기", "곱하기", "전부"],
            datasets: [
              {
                label: "My Data",
                data: arr,
                backgroundColor: [
                  "rgb(255, 99, 132)",
                  "rgb(54, 162, 235)",
                  "rgb(75, 192, 192)",
                  "rgb(255, 205, 86)",
                  "rgb(11, 203, 207)",
                ],
              },
            ],
          },
          options: {
            responsive: false,
          },
        });
      }, 10);
    }

    return html`
      <div class="chartd">
        <div id="root"></div>
        <div className="chart">
          <canvas id="Chart"></canvas>
        </div>
      </div>

      <style>
        #root {
          display: flex;
          justify-content: center;
        }
        .heatmap {
          width: 830px;
          overflow-x: scroll;
        }
        .chartd {
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .chart {
          width: 50vw;
        }
      </style>
    `;
  }
}
export default Chartd;
