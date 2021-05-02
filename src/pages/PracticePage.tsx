import * as React from "react";
import { useHistory, useParams } from "react-router";
import { IonButton, IonRow, IonFooter, IonAlert, IonCol } from "@ionic/react";

import "./LearnPage.sass";
import DictionaryEntryCard from "../components/DictionaryEntryCard";
import IndexCard from "../classes/IndexCard";
import DiscitePage from "../layouts/DiscitePage";
import { shuffle } from "../utils";
import { database } from "../middleware/Storage";

const { useState, useEffect } = React;

const PracticePage: React.FC = () => {
  const [progress, setProgress] = useState<{
    queue?: IndexCard[];
    knownWords: IndexCard[];
    unknownWords: IndexCard[];
    lastRound: boolean;
  }>({
    knownWords: [],
    unknownWords: [],
    lastRound: false,
  });
  const [showSolution, setShowSolution] = useState<boolean>(false);
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [lastIndexCard, setLastIndexCard] = useState<IndexCard>();
  const history = useHistory();
  const params = useParams<{ id: string | undefined }>();

  const setStatus = (known: boolean) => {
    setLastIndexCard(progress.queue![0]);

    if (known) {
      setProgress({
        ...progress,
        queue: progress.queue!.filter((_card, index) => index !== 0),
        knownWords: [...progress.knownWords, progress.queue![0]],
      });
    } else {
      setProgress({
        ...progress,
        queue: progress.queue!.filter((_card, index) => index !== 0),
        unknownWords: [...progress.unknownWords, progress.queue![0]],
      });
    }

    setShowSolution(false);
  };

  const finish = () => {
    database.collections.update(Number.parseInt(params.id!), {
      lastLearnt: new Date().toJSON(),
    });

    setShowAlert(false);
    history.push("/vocab");
  };

  useEffect(() => {
    database.collections.get(Number.parseInt(params.id!)).then((result) => {
      setProgress({
        ...progress,
        queue: shuffle(result!.indexCards),
      });
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // Daten müssen geladen sein.
    if (!progress.queue) return;

    // Wird nur aufgerufen, wenn keine Vokabelkarten mehr da sind.
    if (progress.queue!.length !== 0) return;

    // Alle Vokabeln werden beherrscht.
    if (progress.unknownWords.length === 0) {
      if (progress.lastRound) {
        setShowAlert(true);
      } else {
        // Alle Vokabeln werden noch einmal wiederholt.
        let queue;
        do {
          queue = shuffle(progress.knownWords);
        } while (queue[0] === lastIndexCard);

        setProgress({
          queue: queue,
          knownWords: [],
          unknownWords: [],
          lastRound: true,
        });
      }
    } else {
      // Nicht beherrschte Vokabeln werden wieder in die Warteschleife geschoben.
      let queue;
      do {
        queue = shuffle(progress.unknownWords);

        if (progress.unknownWords.length === 1) break;
      } while (queue[0] === lastIndexCard);

      setProgress({
        ...progress,
        queue: queue,
        unknownWords: [],
      });
    }
  }, [progress, lastIndexCard]);

  return (
    <DiscitePage
      title="Üben"
      defaultBackHref="/vocab"
      backText="Abbrechen"
      className="learnPage"
    >
      {progress.queue && progress.queue!.length !== 0 && (
        <>
          <h1 className="ion-margin">{progress.queue![0].content.word}</h1>
          {showSolution && (
            <DictionaryEntryCard dictionaryEntry={progress.queue![0].content} />
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
                    onClick={() => setStatus(false)}
                    expand="block"
                    color="danger"
                  >
                    Nicht gewusst
                  </IonButton>
                </IonCol>
                <IonCol>
                  <IonButton
                    onClick={() => setStatus(true)}
                    expand="block"
                    color="success"
                  >
                    Gewusst
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
        header="Glückwunsch"
        message={`Du beherrscht nun alle Vokabeln aus dieser Sammlung.`}
        buttons={["Fertig"]}
      />
    </DiscitePage>
  );
};

export default PracticePage;
