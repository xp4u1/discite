import * as React from "react";
import ReactDOM from "react-dom";

import App from "./App";
import * as serviceWorker from "./serviceWorker";
import { initDarkMode } from "./middleware/DarkMode";

initDarkMode();
ReactDOM.render(<App />, document.getElementById("root"));
serviceWorker.register();
