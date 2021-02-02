import * as React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";

import App from "./App";
import * as serviceWorker from "./serviceWorker";
import { RootState, Store } from "./middleware/Store";
import { loadStore, saveStore } from "./middleware/Storage";
import { initDarkMode } from "./middleware/DarkMode";
import { replaceStore } from "./utils";

/* Dark Mode */

initDarkMode();

/* Redux */

// Lädt den Store aus dem Speicher.
loadStore().then((result) => {
  if (!result) return;
  replaceStore(result as RootState);
});

// Speichert den Redux Store, wenn er sich ändert.
Store.subscribe(() => {
  saveStore(Store.getState());
});

/* React */

ReactDOM.render(
  <Provider store={Store}>
    <App />
  </Provider>,
  document.getElementById("root")
);

serviceWorker.register();
