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
import { Store } from "../middleware/Store";
import { selectVocabCollection } from "../middleware/features/VocabCollectionStore";
import { addIndexCard } from "../middleware/features/LearnStore";

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
    Store.dispatch(selectVocabCollection(props.vocabCollection));
    setTimeout(() => {
      dismiss();
      history.push("/vocab/edit");
    }, 5);
  };

  const overview = () => {
    Store.dispatch(selectVocabCollection(props.vocabCollection));
    setTimeout(() => {
      dismiss();
      history.push("/vocab/overview");
    }, 5);
  };

  const practice = () => {
    Store.dispatch(selectVocabCollection(props.vocabCollection));

    setTimeout(() => {
      dismiss();
      history.push("/vocab/practice");
    }, 5);
  };

  const learn = () => {
    chunk(props.vocabCollection.indexCards, 10).forEach((array, index) => {
      const date = new Date();
      date.setHours(0, 0, 0, 0);
      date.setDate(date.getDate() + index);

      array.forEach((indexCard) => {
        Store.dispatch(
          addIndexCard({
            indexCard: indexCard,
            date: date,
          })
        );
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
          <IonItem button detail className="item">
            <IonLabel onClick={edit}>Bearbeitungsmodus</IonLabel>
          </IonItem>
          <IonItem button detail className="item">
            <IonLabel onClick={overview}>Karteikarten-Übersicht</IonLabel>
          </IonItem>
        </IonList>

        <IonGrid className="buttonsGrid">
          <IonRow className="ion-justify-content-evenly">
            <IonCol>
              <IonButton onClick={practice} color="light" className="button">
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
                  <IonLabel>{indexCard.content.word}</IonLabel>
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
