import * as React from "react";
import {
  IonAlert,
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonCol,
  IonGrid,
  IonIcon,
  IonItem,
  IonList,
  IonRow,
  IonText,
} from "@ionic/react";
import { bug, school } from "ionicons/icons";

import DictionaryEntry from "../classes/DictionaryEntry";
import "./DictionaryEntryCard.sass";
import { addCard } from "../middleware/Scheduler";
import { useLiveQuery } from "dexie-react-hooks";
import { database } from "../middleware/Storage";

const { useState } = React;

const DictionaryEntryCard: React.FC<{
  dictionaryEntry: DictionaryEntry;
  actionButtons?: boolean;
}> = (props) => {
  const [showAlert, setShowAlert] = useState<boolean>(false);

  const learnEntries = useLiveQuery(() =>
    database.learn
      .filter((entry) => entry.content.word === props.dictionaryEntry.word)
      .toArray()
  );

  if (!learnEntries) return null;

  return (
    <IonCard className="dictionaryEntryCard">
      <IonCardHeader className="header">
        <IonCardSubtitle>{props.dictionaryEntry.description}</IonCardSubtitle>
        <IonCardTitle>{props.dictionaryEntry.word}</IonCardTitle>
      </IonCardHeader>
      <IonCardContent className="content">
        <IonText color="primary">
          {props.dictionaryEntry.forms.join(", ")}
        </IonText>
        <p className="european">{props.dictionaryEntry.european}</p>

        <IonList class="meanings">
          {props.dictionaryEntry.meanings.length !== 1 &&
            props.dictionaryEntry.meanings.map((meaning, index) => (
              <IonItem key={index} lines="none" className="ion-no-padding">
                {index + 1}. {meaning}
              </IonItem>
            ))}
          {props.dictionaryEntry.meanings.length === 1 && (
            <IonItem lines="none" className="ion-no-padding">
              {props.dictionaryEntry.meanings[0]}
            </IonItem>
          )}
        </IonList>

        {props.actionButtons && (
          <IonGrid>
            <IonRow>
              <IonCol className="buttons">
                <IonButton
                  href={`mailto:development@hoerenz.com?subject=Fehler%20im%20Discite-W%C3%B6rterbuch%20bei%20%E2%80%9E${encodeURI(
                    props.dictionaryEntry.word
                  )}%E2%80%9C`}
                  className="buttonClear"
                  fill="clear"
                  size="small"
                >
                  <IonIcon icon={bug} slot="icon-only" size="small" />
                </IonButton>
                <IonButton
                  onClick={() => setShowAlert(true)}
                  className="buttonClear"
                  fill="clear"
                  size="small"
                >
                  <IonIcon icon={school} slot="icon-only" size="small" />
                </IonButton>
              </IonCol>
            </IonRow>
          </IonGrid>
        )}
      </IonCardContent>

      <IonAlert
        isOpen={showAlert}
        onDidDismiss={() => setShowAlert(false)}
        header={
          learnEntries.length === 0
            ? "Willst du diesen Eintrag lernen?"
            : "Vorsicht!"
        }
        message={
          learnEntries.length === 0
            ? "Diese Aktion <strong>nicht rückgängig</strong> gemacht werden"
            : "Es existiert bereits ein Eintrag zu diesem Wort. Möchtest du den Eintrag dennoch hinzufügen?"
        }
        buttons={[
          {
            text: "Abbrechen",
            role: "cancel",
            cssClass: "secondary",
            handler: () => setShowAlert(false),
          },
          {
            text: "Lernen",
            handler: () => addCard(props.dictionaryEntry, new Date()),
          },
        ]}
      />
    </IonCard>
  );
};

export default DictionaryEntryCard;
