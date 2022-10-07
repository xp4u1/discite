import * as React from "react";
import { Redirect, Route } from "react-router-dom";
import {
  IonApp,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  setupIonicReact,
} from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import {
  searchOutline,
  albumsOutline,
  optionsOutline,
  extensionPuzzleOutline,
} from "ionicons/icons";

/* Core CSS required for Ionic components to work properly */
import "@ionic/react/css/core.css";

/* Basic CSS for apps built with Ionic */
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";

/* Optional CSS utils that can be commented out */
import "@ionic/react/css/padding.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/display.css";

/* Theme variables */
import "./theme/variables.scss";

import "./theme/global.scss";

/* Custom components & pages */
import VocabTab from "./pages/VocabTab";
import SearchTab from "./pages/SearchTab";
import EditPage from "./pages/EditPage";
import PracticePage from "./pages/PracticePage";
import SettingsTab from "./pages/SettingsTab";
import OverviewPage from "./pages/OverviewPage";
import LearnTab from "./pages/LearnTab";
import DailyPage from "./pages/DailyPage";
import DatabasePage from "./pages/DatabasePage";

setupIonicReact({
  mode: "ios",
});

const App: React.FC = () => (
  <IonApp>
    <IonReactRouter>
      <IonTabs>
        <IonRouterOutlet>
          <Route path="/search" component={SearchTab} />
          <Route path="/settings" component={SettingsTab} />

          <Route path="/vocab" component={VocabTab} exact />
          <Route path="/vocab/edit/:id" component={EditPage} />
          <Route path="/vocab/practice/:id" component={PracticePage} />
          <Route path="/vocab/overview/:id" component={OverviewPage} />

          <Route path="/learn" component={LearnTab} exact />
          <Route path="/learn/daily" component={DailyPage} />
          <Route path="/learn/database" component={DatabasePage} />

          <Route path="/" render={() => <Redirect to="/search" />} exact />
        </IonRouterOutlet>

        <IonTabBar slot="bottom">
          <IonTabButton tab="search" href="/search">
            <IonIcon icon={searchOutline} />
            <IonLabel>Suche</IonLabel>
          </IonTabButton>
          <IonTabButton tab="learn" href="/learn">
            <IonIcon icon={extensionPuzzleOutline} />
            <IonLabel>Lernen</IonLabel>
          </IonTabButton>
          <IonTabButton tab="vocab" href="/vocab">
            <IonIcon icon={albumsOutline} />
            <IonLabel>Vokabeln</IonLabel>
          </IonTabButton>
          <IonTabButton tab="settings" href="/settings">
            <IonIcon icon={optionsOutline} />
            <IonLabel>Einstellungen</IonLabel>
          </IonTabButton>
        </IonTabBar>
      </IonTabs>
    </IonReactRouter>
  </IonApp>
);

export default App;
