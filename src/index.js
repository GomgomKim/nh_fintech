import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { Spin } from "antd";
import { createStore } from "redux";
import reducer from "./reducers";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import "antd/dist/antd.css";
import "./css/index.css";
import "./css/notosans.css";
import { composeWithDevTools } from "redux-devtools-extension";

let store = createStore(reducer, composeWithDevTools());

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <Provider store={store}>
        <App />
        <div
          id="loadingSpinner"
          style={{
            display: "none",
            position: "fixed",
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0,0,0,0.3)",
            top: 0,
            left: 0,
            textAlign: "center",
            zIndex: 99999,
            // pointerEvents: "none"
          }}
        >
          <Spin style={{ position: "absolute", top: "50%", zIndex: 99999 }} />
        </div>
      </Provider>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
