import * as React from "react";
import { useHistory } from "react-router";
import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonCol,
  IonFab,
  IonFabButton,
  IonGrid,
  IonIcon,
  IonRow,
  IonText,
  IonToast,
} from "@ionic/react";
import { layersOutline } from "ionicons/icons";

import "./LearnTab.sass";
import DisciteTab from "../layouts/DisciteTab";
import JoyrideTour from "../components/JoyrideTour";
import { tours } from "../classes/Tours";
import { database } from "../middleware/Storage";
import { useLiveQuery } from "dexie-react-hooks";
import {
  endTodayTimestamp,
  endTomorrowTimestamp,
  startTomorrowTimestamp,
} from "../middleware/Calendar";
import { humanDifference } from "../middleware/Scheduler";
import DisciteCalendarHeatmap from "../components/DisciteCalendarHeatmap";

const { useState } = React;

const LearnTab: React.FC = () => {
  const [showToast, setShowToast] = useState(false);
  const history = useHistory();

  const entriesToday = useLiveQuery(() =>
    database.learn
      .where("date")
      .belowOrEqual(endTodayTimestamp())
      .sortBy("date")
  );
  const entriesTomorrow = useLiveQuery(() =>
    database.learn
      .where("date")
      .between(startTomorrowTimestamp(), endTomorrowTimestamp())
      .toArray()
  );
  const learnEntries = useLiveQuery(() => database.learn.toArray());

  const learn = () =>
    entriesToday!.length > 0
      ? history.push("/learn/daily")
      : setShowToast(true);

  if (!(entriesToday && entriesTomorrow && learnEntries)) return null;

  return (
    <DisciteTab title="Lernen" className="learnTab">
      <JoyrideTour tour={tours.learn} />

      <IonGrid className="learnGrid">
        <IonRow>
          <IonCol className="learnCol tourLearnToday">
            <IonCard
              className={`dateCard ${
                entriesToday.length > 0 ? "danger" : "success"
              }`}
            >
              <IonCardHeader>
                <IonCardTitle>Heute</IonCardTitle>
              </IonCardHeader>
              <IonCardContent>
                <section>
                  <p>
                    Heute musst du{" "}
                    <IonText color="primary">
                      {`${entriesToday.length} ${
                        entriesToday.length === 1 ? "Eintrag" : "Einträge"
                      }`}
                    </IonText>{" "}
                    lernen.
                  </p>
                  {entriesToday.length > 0 && (
                    <p>
                      Nächster Eintrag:{" "}
                      <IonText color="primary">
                        {humanDifference(entriesToday[0].date)}
                      </IonText>{" "}
                    </p>
                  )}
                </section>
              </IonCardContent>
            </IonCard>
          </IonCol>
          <IonCol className="learnCol tourLearnTomorrow">
            <IonCard
              className={`dateCard ${
                entriesTomorrow.length > 0 ? "danger" : "success"
              }`}
            >
              <IonCardHeader>
                <IonCardTitle>Morgen</IonCardTitle>
              </IonCardHeader>
              <IonCardContent>
                <section>
                  <p>
                    Du musst morgen{" "}
                    <IonText color="primary">
                      {`${entriesTomorrow.length} ${
                        entriesTomorrow.length === 1 ? "Eintrag" : "Einträge"
                      }`}
                    </IonText>{" "}
                    lernen.
                  </p>
                </section>
              </IonCardContent>
            </IonCard>
          </IonCol>
        </IonRow>
        <IonRow>
          <IonCol id="heatmapCol" className="learnCol tourLearnStats">
            <IonCard className="statsCard">
              <IonCardHeader>
                <IonCardTitle>Wiederholungen</IonCardTitle>
              </IonCardHeader>
              <IonCardContent>
                <DisciteCalendarHeatmap />
              </IonCardContent>
            </IonCard>
          </IonCol>
          <IonCol className="learnCol">
            <IonCard className="statsCard">
              <IonCardHeader>
                <IonCardTitle>Dein Wortschatz</IonCardTitle>
              </IonCardHeader>
              <IonCardContent>
                <section>
                  <p className="marginBottom">
                    Deine Wörter:{" "}
                    <IonText color="primary">{learnEntries.length}</IonText>
                  </p>
                  <p>
                    Neu:{" "}
                    {
                      learnEntries.filter(
                        (entry) => !entry.graduated && !entry.relearning
                      ).length
                    }
                  </p>
                  <p>
                    Neu-Lernen:{" "}
                    {learnEntries.filter((entry) => entry.relearning).length}
                  </p>
                  <p>
                    Andere:{" "}
                    {learnEntries.filter((entry) => entry.graduated).length}
                  </p>
                </section>
              </IonCardContent>
            </IonCard>
          </IonCol>
        </IonRow>
      </IonGrid>

      <IonFab
        vertical="bottom"
        horizontal="end"
        slot="fixed"
        className="tourLearnButton"
      >
        <IonFabButton onClick={learn}>
          <IonIcon icon={layersOutline} />
        </IonFabButton>
      </IonFab>

      <IonToast
        isOpen={showToast}
        onDidDismiss={() => setShowToast(false)}
        message="Du musst zurzeit keine Vokabeln lernen!"
        color="danger"
        duration={1000}
      />
    </DisciteTab>
  );
};

export default LearnTab;
