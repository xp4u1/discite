import * as React from "react";
import { modalController } from "@ionic/core";
import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonItemDivider,
  IonLabel,
  IonList,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { close } from "ionicons/icons";

import "./AdvancedSettingsModal.sass";
import { getSetting, setSetting } from "../middleware/Storage";
import {
  defaultEase,
  defaultIntervalModifier,
  defaultLearnIntervals,
  defaultMaxNewCards,
  defaultPreStudy,
  defaultRelearningInterval,
  defaultRelearningModifier,
} from "../middleware/Defaults";
import JoyrideTour from "./JoyrideTour";
import { tours } from "../classes/Tours";

const { useEffect, useState } = React;

const AdvancedSettingsModal: React.FC = () => {
  const [learnIntervals, setLearnIntervals] = useState<string>("");
  const [ease, setEase] = useState<string>("");
  const [maxNewCards, setMaxNewCards] = useState<string>("");
  const [intervalModifier, setIntervalModifier] = useState<string>("");
  const [relearningInterval, setRelearningInterval] = useState<string>("");
  const [relearningModifier, setRelearningModifier] = useState<string>("");
  const [preStudy, setPreStudy] = useState<string>("");

  const dismiss = () => {
    modalController.dismiss();
  };

  // Standartwerte beim Einbinden laden.
  useEffect(() => {
    getSetting("learnIntervals", defaultLearnIntervals).then((result) =>
      setLearnIntervals(result)
    );
    getSetting("ease", defaultEase).then((result) => setEase(result));
    getSetting("maxNewCards", defaultMaxNewCards).then((result) =>
      setMaxNewCards(result)
    );
    getSetting("intervalModifier", defaultIntervalModifier).then((result) =>
      setIntervalModifier(result)
    );
    getSetting("relearningInterval", defaultRelearningInterval).then((result) =>
      setRelearningInterval(result)
    );
    getSetting("relearningModifier", defaultRelearningModifier).then((result) =>
      setRelearningModifier(result)
    );
    getSetting("preStudy", defaultPreStudy).then((result) =>
      setPreStudy(result)
    );
  }, []);

  // --- Übernehmen die Änderungen in den Speicher ---

  useEffect(() => {
    setSetting("learnIntervals", learnIntervals);
  }, [learnIntervals]);

  useEffect(() => {
    setSetting("ease", Number.parseFloat(ease));
  }, [ease]);

  useEffect(() => {
    setSetting("maxNewCards", Number.parseInt(maxNewCards));
  }, [maxNewCards]);

  useEffect(() => {
    setSetting("intervalModifier", Number.parseFloat(intervalModifier));
  }, [intervalModifier]);

  useEffect(() => {
    setSetting("relearningInterval", Number.parseInt(relearningInterval));
  }, [relearningInterval]);

  useEffect(() => {
    setSetting("relearningModifier", Number.parseFloat(relearningModifier));
  }, [relearningModifier]);

  useEffect(() => {
    setSetting("preStudy", Number.parseFloat(preStudy));
  }, [preStudy]);

  // ---

  return (
    <>
      <JoyrideTour tour={tours.advancedSettings} />

      <IonHeader translucent>
        <IonToolbar>
          <IonButtons slot="start">
            <IonButton onClick={dismiss}>
              <IonIcon icon={close} />
            </IonButton>
          </IonButtons>
          <IonTitle class="tourIntro">Erweiterte Einstellungen</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen class="advancedSettingsModal">
        <IonList lines="full">
          <IonItemDivider>Neue Sammlung</IonItemDivider>
          <IonItem lines="none">
            <IonLabel class="tourCardsPerDay">Karten pro Tag</IonLabel>
            <IonInput
              value={maxNewCards}
              onIonChange={(event) => setMaxNewCards(event.detail.value!)}
            />
          </IonItem>

          <IonItemDivider>Lernphase</IonItemDivider>
          <IonItem>
            <IonLabel class="tourLearnIntervals">Intervalle</IonLabel>
            <IonInput
              value={learnIntervals}
              onIonChange={(event) => setLearnIntervals(event.detail.value!)}
            />
          </IonItem>
          <IonItem lines="none">
            <IonLabel class="tourEaseFactor">Ease-Faktor</IonLabel>
            <IonInput
              value={ease}
              onIonChange={(event) => setEase(event.detail.value!)}
            />
          </IonItem>

          <IonItemDivider>Wiederholungen</IonItemDivider>
          <IonItem>
            <IonLabel class="tourIntervalModifier">Intervallfaktor</IonLabel>
            <IonInput
              value={intervalModifier}
              onIonChange={(event) => setIntervalModifier(event.detail.value!)}
            />
          </IonItem>
          <IonItem lines="none">
            <IonLabel class="tourPreLearning">Vorlernen (min)</IonLabel>
            <IonInput
              value={preStudy}
              onIonChange={(event) => setPreStudy(event.detail.value!)}
            />
          </IonItem>

          <IonItemDivider>Neu-Lernen</IonItemDivider>
          <IonItem>
            <IonLabel class="tourRelearningInterval">Intervall</IonLabel>
            <IonInput
              value={relearningInterval}
              onIonChange={(event) =>
                setRelearningInterval(event.detail.value!)
              }
            />
          </IonItem>
          <IonItem lines="none">
            <IonLabel class="tourRelearningModifier">Neues Intervall</IonLabel>
            <IonInput
              value={relearningModifier}
              onIonChange={(event) =>
                setRelearningModifier(event.detail.value!)
              }
            />
          </IonItem>
        </IonList>
      </IonContent>
    </>
  );
};

export default AdvancedSettingsModal;
