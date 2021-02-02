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
import { LineChart } from "react-chartkick";
import "chart.js";

import "./LearnTab.sass";
import DisciteTab from "../layouts/DisciteTab";
import { Store } from "../middleware/Store";
import { getEntries, getEntriesToday } from "../middleware/features/LearnStore";
import JoyrideTour from "../components/JoyrideTour";
import { tours } from "../classes/Tours";

const { useState } = React;

const getData = (): any[] => {
  const data: any[] = [];
  const date = new Date();

  for (let index = 0; index < (window.innerWidth >= 800 ? 7 : 5); index++) {
    const day = new Date(date.setDate(date.getDate() - 1));
    day.setHours(0, 0, 0, 0);

    const entries = Store.getState().learn.stats.progress.filter((entry) => {
      const date = new Date(entry.date);
      return date.getTime() === day.getTime();
    });

    data.push([
      `${day.getUTCDate()}.${day.getUTCMonth() + 1}`,
      entries.reduce((sum, current) => sum + current.cardsLearnt, 0),
    ]);
  }

  return data.reverse();
};

const LearnTab: React.FC = () => {
  const [showToast, setShowToast] = useState(false);
  const [stats] = useState<any[]>(getData());
  const history = useHistory();

  const entriesToday = getEntriesToday(Store.getState().learn);
  const entriesTomorrow = getEntries(Store.getState().learn, 1);

  const newEntriesToday = entriesToday.filter(
    (entry) => entry.indexCard.repetition === 0
  );
  const newEntriesTomorrow = entriesTomorrow.filter(
    (entry) => entry.indexCard.repetition === 0
  );

  const learn = () => {
    if (entriesToday.length > 0) {
      history.push("/learn/daily");
    } else {
      setShowToast(true);
    }
  };

  return (
    <DisciteTab title="Lernen" className="learnTab">
      <JoyrideTour tour={tours.learn} />

      <IonGrid className="dateGrid">
        <IonRow>
          <IonCol className="dateCol tourLearnToday">
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
                    Du musst heute noch{" "}
                    <IonText color="primary">
                      {`${entriesToday.length} ${
                        entriesToday.length === 1 ? "Eintrag" : "Einträge"
                      }`}
                    </IonText>{" "}
                    lernen.
                  </p>

                  {newEntriesToday.length === 1 && (
                    <p>
                      Davon ist <IonText color="primary">eine Vokabel</IonText>{" "}
                      neu für dich.
                    </p>
                  )}
                  {newEntriesToday.length > 1 && (
                    <p>
                      Davon sind{" "}
                      <IonText color="primary">
                        {newEntriesToday.length} Vokabeln
                      </IonText>{" "}
                      neu für dich.
                    </p>
                  )}
                </section>
              </IonCardContent>
            </IonCard>
          </IonCol>
          <IonCol className="dateCol tourLearnTomorrow">
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

                  {newEntriesTomorrow.length === 1 && (
                    <p>
                      Davon ist <IonText color="primary">eine Vokabel</IonText>{" "}
                      neu für dich.
                    </p>
                  )}
                  {newEntriesTomorrow.length > 1 && (
                    <p>
                      Davon sind{" "}
                      <IonText color="primary">
                        {newEntriesTomorrow.length} Vokabeln
                      </IonText>{" "}
                      neu für dich.
                    </p>
                  )}
                </section>
              </IonCardContent>
            </IonCard>
          </IonCol>
        </IonRow>
      </IonGrid>

      <IonCard className="tourLearnStats">
        <IonCardHeader>
          <IonCardTitle>Geübte Vokabeln</IonCardTitle>
        </IonCardHeader>
        <IonCardContent>
          <LineChart data={stats} />
        </IonCardContent>
      </IonCard>

      <IonCard>
        <IonCardHeader>
          <IonCardTitle>Dein Wortschatz</IonCardTitle>
        </IonCardHeader>
        <IonCardContent>
          <section>
            <p>Deine Wörter: {Store.getState().learn.entries.length}</p>
            <p>
              Im Langzeitgedächtnis:{" "}
              {
                Store.getState().learn.entries.filter(
                  (entry) => entry.indexCard.repetition === 9
                ).length
              }
            </p>
          </section>
        </IonCardContent>
      </IonCard>

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
        message="Du musst heute keine Vokabeln lernen!"
        color="danger"
        duration={1000}
      />
    </DisciteTab>
  );
};

export default LearnTab;
