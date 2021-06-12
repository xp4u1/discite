import * as React from "react";
import { useHistory } from "react-router";
import { IonButton, IonRow, IonFooter, IonAlert, IonCol } from "@ionic/react";

import "./LearnPage.sass";
import DictionaryEntryCard from "../components/DictionaryEntryCard";
import DiscitePage from "../layouts/DiscitePage";
import { shuffle } from "../utils";
import { LearnEntry } from "../middleware/database/DisciteDatabase";
import { database, getSetting } from "../middleware/Storage";
import { calculate, humanDifference } from "../middleware/Scheduler";
import { defaultPreStudy, defaultShowTimespan } from "../middleware/Defaults";
import dayjs from "dayjs";

const { useState, useEffect } = React;

const DailyPage: React.FC = () => {
  const [queue, setQueue] = useState<LearnEntry[]>([]);
  const [showSolution, setShowSolution] = useState<boolean>(false);
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [showTimespan, setShowTimespan] =
    useState<boolean>(defaultShowTimespan);
  const [intervals, setIntervals] = useState<string[]>([]);
  const history = useHistory();

  const finish = () => {
    history.replace("/learn");
  };

  const handleClick = async (button: number) => {
    const newCard = await calculate(queue[0], button);
    database.learn.put(newCard);

    // In die Statistiken eintragen.
    database.stats.add({
      button: button,
      date: new Date().getTime(),
      graduated: queue[0].graduated,
      lastInterval: queue[0].lastInterval,
      relearning: queue[0].relearning,
    });

    const startOfToday = +dayjs(Date.now()).startOf("day");
    database.activity.get({ date: startOfToday }).then((result) => {
      if (result)
        database.activity.put({
          ...result,
          count: result.count + 1,
        });
      else
        database.activity.add({
          date: startOfToday,
          count: 1,
        });
    });

    setQueue(queue.slice(1));
    setShowSolution(false);
  };

  useEffect(() => {
    database.learn
      .where("date")
      .belowOrEqual(new Date().getTime())
      .toArray()
      .then((entries) => setQueue(shuffle(entries)));

    getSetting("showTimespan", defaultShowTimespan).then((result) => {
      setShowTimespan(result);
    });
  }, []);

  useEffect(() => {
    if (queue.length === 0) {
      getSetting("preStudy", defaultPreStudy).then((result) => {
        database.learn
          .where("date")
          .belowOrEqual(new Date().getTime() + result * 60000)
          .toArray()
          .then((entries) =>
            entries.length > 0 ? setQueue(shuffle(entries)) : setShowAlert(true)
          );
      });
    } else {
      const result: string[] = [];

      for (let index = 0; index < 4; index++) {
        if (queue[0].relearning && index > 1) continue;
        if (!queue[0].graduated && index > 2) continue;

        calculate(queue[0], index).then((entry) => {
          result[index] = `(${humanDifference(entry.date)})`;
        });
      }

      setIntervals(result);
    }
  }, [queue]);

  return (
    <DiscitePage
      title="Lernen"
      defaultBackHref="/learn"
      backText="Abbrechen"
      className="learnPage"
    >
      {queue.length !== 0 && (
        <>
          <h1 className="ion-margin">{queue[0].content.word}</h1>
          {showSolution && (
            <DictionaryEntryCard dictionaryEntry={queue[0].content} />
          )}

          <IonFooter className="actionFooter">
            {!showSolution && (
              <IonRow className="ion-justify-content-evenly">
                <IonCol>
                  <IonButton
                    onClick={() => setShowSolution(true)}
                    expand="block"
                    color="primary"
                  >
                    Aufdecken
                  </IonButton>
                </IonCol>
              </IonRow>
            )}
            {/* Graduated */}
            {showSolution && queue[0].graduated && (
              <>
                <IonRow className="ion-justify-content-evenly">
                  <IonCol>
                    <IonButton
                      onClick={() => handleClick(0)}
                      expand="block"
                      color="danger"
                    >
                      Nochmal
                      {showTimespan && (
                        <>
                          <br />
                          {intervals[0]}
                        </>
                      )}
                    </IonButton>
                  </IonCol>
                  <IonCol>
                    <IonButton
                      onClick={() => handleClick(1)}
                      expand="block"
                      color="warning"
                    >
                      Schwer
                      {showTimespan && (
                        <>
                          <br />
                          {intervals[1]}
                        </>
                      )}
                    </IonButton>
                  </IonCol>
                  <IonCol>
                    <IonButton
                      onClick={() => handleClick(3)}
                      expand="block"
                      color="light"
                    >
                      Zu leicht
                      {showTimespan && (
                        <>
                          <br />
                          {intervals[3]}
                        </>
                      )}
                    </IonButton>
                  </IonCol>
                </IonRow>
                <IonRow>
                  <IonCol>
                    <IonButton
                      onClick={() => handleClick(2)}
                      expand="block"
                      color="success"
                    >
                      Gut
                      {showTimespan && (
                        <>
                          <br />
                          {intervals[2]}
                        </>
                      )}
                    </IonButton>
                  </IonCol>
                </IonRow>
              </>
            )}
            {/* Learning */}
            {showSolution && !queue[0].graduated && !queue[0].relearning && (
              <>
                <IonRow className="ion-justify-content-evenly">
                  <IonCol>
                    <IonButton
                      onClick={() => handleClick(0)}
                      expand="block"
                      color="danger"
                    >
                      Nochmal
                      {showTimespan && (
                        <>
                          <br />
                          {intervals[0]}
                        </>
                      )}
                    </IonButton>
                  </IonCol>
                  <IonCol>
                    <IonButton
                      onClick={() => handleClick(2)}
                      expand="block"
                      color="light"
                    >
                      Zu leicht
                      {showTimespan && (
                        <>
                          <br />
                          {intervals[2]}
                        </>
                      )}
                    </IonButton>
                  </IonCol>
                </IonRow>
                <IonRow>
                  <IonCol>
                    <IonButton
                      onClick={() => handleClick(1)}
                      expand="block"
                      color="success"
                    >
                      Gut
                      {showTimespan && (
                        <>
                          <br />
                          {intervals[1]}
                        </>
                      )}
                    </IonButton>
                  </IonCol>
                </IonRow>
              </>
            )}
            {/* Relearning */}
            {showSolution && queue[0].relearning && (
              <>
                <IonRow className="ion-justify-content-evenly">
                  <IonCol>
                    <IonButton
                      onClick={() => handleClick(0)}
                      expand="block"
                      color="danger"
                    >
                      Nochmal
                      {showTimespan && (
                        <>
                          <br />
                          {intervals[0]}
                        </>
                      )}
                    </IonButton>
                  </IonCol>
                  <IonCol>
                    <IonButton
                      onClick={() => handleClick(1)}
                      expand="block"
                      color="success"
                    >
                      Gut
                      {showTimespan && (
                        <>
                          <br />
                          {intervals[1]}
                        </>
                      )}
                    </IonButton>
                  </IonCol>
                </IonRow>
              </>
            )}
          </IonFooter>
        </>
      )}

      <IonAlert
        isOpen={showAlert}
        onDidDismiss={finish}
        header="Super!"
        message={"Du bist alle Karten durchgegangen."}
        buttons={["Abschließen"]}
      />
    </DiscitePage>
  );
};

export default DailyPage;
