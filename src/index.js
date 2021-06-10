import { Spin } from "antd";
import "antd/dist/antd.css";
import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { createStore } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import App from "./App";
import "./css/index.css";
import "./css/notosans.css";
import reducer from "./reducers";
import reportWebVitals from "./reportWebVitals";

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
            backgroundColor: "none",
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
