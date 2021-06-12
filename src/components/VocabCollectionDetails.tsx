import * as React from "react";
import {
  IonButton,
  IonButtons,
  IonCol,
  IonContent,
  IonGrid,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonNote,
  IonRow,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { modalController } from "@ionic/core";
import { useHistory } from "react-router";
import { close } from "ionicons/icons";

import "./VocabCollectionDetails.sass";
import VocabCollection from "../classes/VocabCollection";
import { getSetting } from "../middleware/Storage";
import { defaultMaxNewCards } from "../middleware/Defaults";
import { addCard } from "../middleware/Scheduler";

/**
 * Teilt einen beliebigen Array in kleinere Stücke auf.
 * @param array Array, der aufgeteilt werden soll
 * @param size Größe der einzelnen neuen Arrays
 */
export const chunk = (array: any[], size: number) => {
  const chunked_array: any[][] = [];

  for (let i = 0; i < array.length; i++) {
    const last = chunked_array[chunked_array.length - 1];

    if (!last || last.length === size) {
      chunked_array.push([array[i]]);
    } else {
      last.push(array[i]);
    }
  }

  return chunked_array;
};

const VocabCollectionDetails: React.FC<{
  vocabCollection: VocabCollection;
}> = (props) => {
  let history = useHistory();

  const dismiss = () => {
    modalController.dismiss();
  };

  const edit = () => {
    dismiss();
    history.push(`/vocab/edit/${props.vocabCollection.id}`);
  };

  const overview = () => {
    dismiss();
    history.push(`/vocab/overview/${props.vocabCollection.id}`);
  };

  const practice = () => {
    dismiss();
    history.push(`/vocab/practice/${props.vocabCollection.id}`);
  };

  const learn = async () => {
    // Karteikarten werden aufgeteilt.
    chunk(
      props.vocabCollection.indexCards,
      await getSetting("maxNewCards", defaultMaxNewCards)
    ).forEach((array, index) => {
      const date = new Date();
      date.setDate(date.getDate() + index);

      array.forEach((indexCard) => {
        addCard(indexCard, date);
      });
    });

    setTimeout(() => {
      dismiss();
      history.push("/learn");
    }, 5);
  };

  return (
    <>
      <IonHeader translucent>
        <IonToolbar>
          <IonButtons slot="start">
            <IonButton onClick={dismiss}>
              <IonIcon icon={close} />
            </IonButton>
          </IonButtons>
          <IonTitle>{props.vocabCollection.title}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <section className="image">
          <img src={props.vocabCollection.image} alt="" />
        </section>

        <IonList lines="none" className="detailsList">
          <IonItem>
            <IonLabel>Vokabeln</IonLabel>
            <IonNote color="primary" slot="end">
              {props.vocabCollection.indexCards.length}
            </IonNote>
          </IonItem>
          <IonItem>
            <IonLabel>Zuletzt gelernt</IonLabel>
            <IonNote color="primary" slot="end">
              {new Date(props.vocabCollection.lastLearnt).toLocaleDateString(
                "de-DE",
                {}
              )}
            </IonNote>
          </IonItem>
          <IonItem button detail>
            <IonLabel onClick={edit}>Bearbeitungsmodus</IonLabel>
          </IonItem>
          <IonItem button detail>
            <IonLabel onClick={overview}>Karteikarten-Übersicht</IonLabel>
          </IonItem>
        </IonList>

        <IonGrid className="buttonsGrid">
          <IonRow className="ion-justify-content-evenly">
            <IonCol>
              <IonButton
                onClick={practice}
                disabled={props.vocabCollection.indexCards.length <= 1}
                color="light"
                className="button"
              >
                Für Test üben
              </IonButton>
            </IonCol>
            <IonCol>
              <IonButton onClick={learn} className="button">
                Lernen
              </IonButton>
            </IonCol>
          </IonRow>
        </IonGrid>

        <IonGrid className="indexCardsGrid">
          <IonRow>
            <h2>Übersicht</h2>
          </IonRow>
          <IonRow>
            {props.vocabCollection.indexCards.map((indexCard, index) => (
              <IonCol key={index}>
                <IonItem lines="none">
                  <IonLabel>{indexCard.word}</IonLabel>
                </IonItem>
              </IonCol>
            ))}
          </IonRow>
        </IonGrid>
      </IonContent>
    </>
  );
};

export default VocabCollectionDetails;
