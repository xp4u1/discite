import * as React from "react";
import { useHistory } from "react-router";
import { IonButton, IonRow, IonFooter, IonAlert, IonCol } from "@ionic/react";

import "./LearnPage.sass";
import { Store } from "../middleware/Store";
import DictionaryEntryCard from "../components/DictionaryEntryCard";
import DiscitePage from "../layouts/DiscitePage";
import LearnEntry from "../classes/LearnEntry";
import {
  addProgressToday,
  getEntriesToday,
  nextRepetition,
  setEntries,
} from "../middleware/features/LearnStore";
import { shuffle } from "../utils";

const { useState, useEffect } = React;

interface Progress {
  queue: LearnEntry[];
  repeat: LearnEntry[];
  learnt: LearnEntry[];
}

enum Status {
  Easy,
  Known,
  NotKnown,
}

const DailyPage: React.FC = () => {
  const [progress, setProgress] = useState<Progress>({
    queue: shuffle(getEntriesToday(Store.getState().learn)),
    repeat: [],
    learnt: [],
  });
  const [lastEntry, setLastEntry] = useState<LearnEntry>();
  const [showSolution, setShowSolution] = useState<boolean>(false);
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const history = useHistory();

  const setStatus = (status: Status) => {
    let learnEntry = progress.queue[0];
    setLastEntry(learnEntry);

    switch (status) {
      case Status.Easy:
        const newEntry = {
          ...learnEntry,
          indexCard: {
            ...learnEntry.indexCard,
            repetition: learnEntry.indexCard.repetition + 1,
          },
        };

        setProgress({
          ...progress,
          queue: progress.queue.filter((entry) => entry !== learnEntry),
          learnt: [...progress.learnt, newEntry],
        });
        break;

      case Status.Known:
        setProgress({
          ...progress,
          queue: progress.queue.filter((entry) => entry !== learnEntry),
          repeat: [...progress.repeat, learnEntry],
        });
        break;

      case Status.NotKnown:
        const newEntry2 = {
          ...learnEntry,
          indexCard: {
            ...learnEntry.indexCard,
            repetition: 0,
          },
        };

        setProgress({
          ...progress,
          queue: progress.queue.filter((entry) => entry !== learnEntry),
          repeat: [...progress.repeat, newEntry2],
        });
        break;
    }

    setShowSolution(false);
  };

  const finish = () => {
    const entries = Store.getState().learn.entries;
    const entriesToday = getEntriesToday(Store.getState().learn);
    const otherEntries = entries.filter(
      (entry) => entriesToday.indexOf(entry) === -1
    );

    const newEntries = progress.learnt.map((entry) => ({
      ...entry,
      nextRepetition: nextRepetition(entry.indexCard.repetition).toJSON(),
    }));

    Store.dispatch(setEntries([...otherEntries, ...newEntries]));
    Store.dispatch(addProgressToday(progress.learnt.length));

    setShowAlert(true);
    history.push("/learn");
  };

  useEffect(() => {
    if (progress.queue.length === 0) {
      if (progress.repeat.length === 0) {
        setShowAlert(true);
      } else {
        let queue;
        do {
          queue = shuffle(progress.repeat);

          if (progress.repeat.length === 1) break;
        } while (queue[0] === lastEntry);

        setProgress({
          ...progress,
          queue: queue,
          repeat: [],
        });
      }
    }
  }, [progress, lastEntry]);

  return (
    <DiscitePage
      title="Lernen"
      defaultBackHref="/learn"
      backText="Abbrechen"
      className="learnPage"
    >
      {progress.queue.length !== 0 && (
        <>
          <h1 className="ion-margin">
            {progress.queue[0].indexCard.content.word}
          </h1>
          {showSolution && (
            <DictionaryEntryCard
              dictionaryEntry={progress.queue[0].indexCard.content}
            />
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
            {showSolution && (
              <IonRow className="ion-justify-content-evenly">
                <IonCol>
                  <IonButton
                    onClick={() => setStatus(Status.NotKnown)}
                    expand="block"
                    color="danger"
                  >
                    Unsicher
                  </IonButton>
                </IonCol>
                <IonCol>
                  <IonButton
                    onClick={() => setStatus(Status.Known)}
                    expand="block"
                    color="warning"
                  >
                    Gewusst
                  </IonButton>
                </IonCol>
                <IonCol>
                  <IonButton
                    onClick={() => setStatus(Status.Easy)}
                    expand="block"
                    color="success"
                  >
                    Leicht
                  </IonButton>
                </IonCol>
              </IonRow>
            )}
          </IonFooter>
        </>
      )}

      <IonAlert
        isOpen={showAlert}
        onDidDismiss={finish}
        header="Super!"
        message={`Du bist alle Vokabeln für heute durchgegangen. Schau doch morgen wieder vorbei!`}
        buttons={["Abschließen"]}
      />
    </DiscitePage>
  );
};

export default DailyPage;
