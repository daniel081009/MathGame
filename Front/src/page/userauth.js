import { LitElement, html } from "lit-element";

const BaseURL = "http://localhost:8080";

export class Login extends LitElement {
  constructor() {
    super();
    /*
      0: login, 1: register  
    */
    this.page = 0;
  }
  ChangePage(page) {
    this.page = page;
    this.requestUpdate();
  }
  createRenderRoot() {
    return this;
  }

  async clicklogin() {
    const username = document.getElementsByTagName("input")[0].value;
    const password = document.getElementsByTagName("input")[1].value;
    const req = {
      username: username,
      password: password,
    };
    try {
      let data = await axios.post(`${BaseURL}/user/login`, req, {
        withCredentials: true,
      });
      if (data.status == 200) {
        localStorage.setItem("username", username);
        localStorage.setItem("Token", data.data.Token);
        location.reload(true);
        location.href = location.href;
      }
    } catch (e) {
      document.getElementById("errmsg").innerText =
        "아이디 비밀번호를 확인해주세요";
    }
  }
  async clickregister() {
    const username = document.getElementsByTagName("input")[0].value;
    const password = document.getElementsByTagName("input")[1].value;
    const repassword = document.getElementsByTagName("input")[2].value;
    if (password != repassword) {
      document.getElementById("errmsg").innerText =
        "비밀번호가 일치하지 않습니다";
      return;
    }
    const req = {
      username: username,
      password: password,
    };
    try {
      let data = await axios.post(`${BaseURL}/user/register`, req);
      if (data.status == 200) {
        this.ChangePage(0);
      } else {
        document.getElementById("errmsg").innerText = "아이디가 중복됩니다";
      }
    } catch (e) {
      document.getElementById("errmsg").innerText =
        "아이디 비밀번호를 확인해주세요";
    }
  }

  login() {
    return html`
      <div class="container">
        <div class="row">
          <div class="col-lg-3 col-md-2"></div>
          <div class="col-lg-6 col-md-8 login-box">
            <div class="col-lg-12 login-title">Login</div>
            <div class="col-lg-6 login-btm login-text" id="errmsg"></div>

            <div class="col-lg-12 login-form">
              <div class="col-lg-12 login-form">
                <div>
                  <div class="form-group">
                    <label class="form-control-label">USERNAME</label>
                    <input type="text" class="form-control" />
                  </div>
                  <div class="form-group">
                    <label class="form-control-label">PASSWORD</label>
                    <input type="password" class="form-control" i />
                  </div>

                  <div class="col-lg-12 loginbttm">
                    <button
                      class="col-lg-12 btn btn-outline-primary"
                      @click=${this.clicklogin}
                    >
                      LOGIN
                    </button>
                    <button
                      class="col-lg-5 btn btn-outline-primary"
                      @click=${() => {
                        this.ChangePage(1);
                      }}
                    >
                      register
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div class="col-lg-3 col-md-2"></div>
          </div>
        </div>
        <link
          href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css"
          rel="stylesheet"
          integrity="sha384-GLhlTQ8iRABdZLl6O3oVMWSktQOp6b7In1Zl3/Jr59b6EGGoI1aFkw7cmDA6j6gD"
          crossorigin="anonymous"
        />

        ${this.css()}
      </div>
    `;
  }
  register() {
    return html`
      <div class="container">
        <div class="row">
          <div class="col-lg-3 col-md-2"></div>
          <div class="col-lg-6 col-md-8 login-box">
            <div class="col-lg-12 login-title">Register</div>
            <div class="col-lg-12 login-form">
              <div class="col-lg-12 login-form">
                <div>
                  <div class="col-lg-6 login-btm login-text" id="errmsg"></div>
                  <div class="form-group">
                    <label class="form-control-label">USERNAME</label>
                    <input type="text" class="form-control" />
                  </div>
                  <div class="form-group">
                    <label class="form-control-label">PASSWORD</label>
                    <input type="password" class="form-control" i />
                  </div>
                  <div class="form-group">
                    <label class="form-control-label">Re PASSWORD</label>
                    <input type="password" class="form-control" i />
                  </div>

                  <div class="col-lg-12 loginbttm">
                    <button
                      class="col-lg-12 btn btn-outline-primary"
                      @click=${this.clickregister}
                    >
                      register
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div class="col-lg-3 col-md-2"></div>
          </div>
        </div>
        <link
          href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css"
          rel="stylesheet"
          integrity="sha384-GLhlTQ8iRABdZLl6O3oVMWSktQOp6b7In1Zl3/Jr59b6EGGoI1aFkw7cmDA6j6gD"
          crossorigin="anonymous"
        />
        ${this.css()}
      </div>
    `;
  }
  css() {
    return html`
      <style>
        body {
          background: #60c3f0;
          font-family: "Roboto", sans-serif;
        }

        .login-box {
          margin-top: 75px;
          height: auto;
          background: #1a2226;
          text-align: center;
          box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16),
            0 3px 6px rgba(0, 0, 0, 0.23);
        }

        .login-key {
          height: 100px;
          font-size: 80px;
          line-height: 100px;
          background: -webkit-linear-gradient(#27ef9f, #0db8de);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .login-title {
          margin-top: 15px;
          text-align: center;
          font-size: 30px;
          letter-spacing: 2px;
          margin-top: 15px;
          font-weight: bold;
          color: #ecf0f5;
        }

        .login-form {
          margin-top: 25px;
          text-align: left;
        }

        input[type="text"] {
          background-color: #1a2226;
          border: none;
          border-bottom: 2px solid #0db8de;
          border-top: 0px;
          border-radius: 0px;
          font-weight: bold;
          outline: 0;
          margin-bottom: 20px;
          padding-left: 0px;
          color: #ecf0f5;
        }

        input[type="password"] {
          background-color: #1a2226;
          border: none;
          border-bottom: 2px solid #0db8de;
          border-top: 0px;
          border-radius: 0px;
          font-weight: bold;
          outline: 0;
          padding-left: 0px;
          margin-bottom: 20px;
          color: #ecf0f5;
        }

        .form-group {
          margin-bottom: 40px;
          outline: 0px;
        }

        .form-control:focus {
          border-color: inherit;
          -webkit-box-shadow: none;
          box-shadow: none;
          border-bottom: 2px solid #0db8de;
          outline: 0;
          background-color: #1a2226;
          color: #ecf0f5;
        }

        input:focus {
          outline: none;
          box-shadow: 0 0 0;
        }

        label {
          margin-bottom: 0px;
        }

        .form-control-label {
          font-size: 10px;
          color: #6c6c6c;
          font-weight: bold;
          letter-spacing: 1px;
        }

        .btn-outline-primary {
          border-color: #0db8de;
          color: #0db8de;
          border-radius: 0px;
          font-weight: bold;
          letter-spacing: 1px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12),
            0 1px 2px rgba(0, 0, 0, 0.24);
        }

        .btn-outline-primary:hover {
          background-color: #0db8de;
          right: 0px;
        }

        .login-btm {
          float: left;
        }

        .login-button {
          padding-right: 0px;
          text-align: right;
          margin-bottom: 25px;
        }

        .login-text {
          text-align: left;
          padding-left: 0px;
          color: #a2a4a4;
        }

        .loginbttm {
          padding: 0px;
        }
      </style>
    `;
  }
  render() {
    if (this.page == 1) {
      return this.register();
    }
    return this.login();
  }
}
customElements.define("login-page", Login);
