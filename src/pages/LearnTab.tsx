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
import JoyrideTour from "../components/JoyrideTour";
import { tours } from "../classes/Tours";
import { database } from "../middleware/Storage";
import { useLiveQuery } from "dexie-react-hooks";
import {
  endTodayTimestamp,
  endTomorrowTimestamp,
  startTomorrowTimestamp,
} from "../middleware/Calendar";

const { useEffect, useState } = React;

const getData = async () => {
  const data: any[] = [];
  const date = new Date();
  date.setHours(0, 0, 0, 0);

  for (let index = 0; index < (window.innerWidth >= 800 ? 7 : 5); index++) {
    date.setDate(date.getDate() - 1);

    const end = new Date(date.toJSON());
    end.setHours(23, 59, 59, 999);

    const entries = await database.stats
      .where("date")
      .between(date.getTime(), end.getTime())
      .toArray();

    data.push([
      `${date.getUTCDate()}.${date.getUTCMonth() + 1}`,
      entries.length,
    ]);
  }

  return data.reverse();
};

const LearnTab: React.FC = () => {
  const [showToast, setShowToast] = useState(false);
  const [statsLearned, setStatsLearned] = useState<any[]>([]);
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

  useEffect(() => {
    getData().then(setStatsLearned);
  }, []);

  if (!(entriesToday && entriesTomorrow && learnEntries)) return null;

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
                      Davon ist nächste Eintrag für{" "}
                      <IonText color="primary">
                        {new Date(entriesToday[0].date).getHours()}:
                        {new Date(entriesToday[0].date).getMinutes()}
                      </IonText>{" "}
                      geplant.
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
                </section>
              </IonCardContent>
            </IonCard>
          </IonCol>
        </IonRow>
      </IonGrid>

      <IonCard className="tourLearnStats">
        <IonCardHeader>
          <IonCardTitle>Wiederholungen</IonCardTitle>
        </IonCardHeader>
        <IonCardContent>
          <LineChart data={statsLearned} />
        </IonCardContent>
      </IonCard>

      <IonCard>
        <IonCardHeader>
          <IonCardTitle>Dein Wortschatz</IonCardTitle>
        </IonCardHeader>
        <IonCardContent>
          <section>
            <p>Deine Wörter: {learnEntries.length}</p>
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
