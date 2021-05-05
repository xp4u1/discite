import * as React from "react";
import { useState } from "react";
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
  IonRow,
  isPlatform,
} from "@ionic/react";
import { shareSocial, trash } from "ionicons/icons";

import VocabCollection from "../classes/VocabCollection";
import "./VocabCollectionCard.sass";
import { downloadFile } from "../middleware/Backup";

const VocabCollectionCard: React.FC<{
  vocabCollection: VocabCollection;
  openHandler: Function;
  removeHandler: Function;
}> = (props) => {
  const [showAlert, setShowAlert] = useState<boolean>(false);

  const open = () => {
    props.openHandler(props.vocabCollection.id);
  };

  const confirmRemove = () => {
    setShowAlert(true);
  };

  const remove = () => {
    props.removeHandler(props.vocabCollection.id);
  };

  const share = async () => {
    downloadFile(
      JSON.stringify(props.vocabCollection),
      props.vocabCollection.title.toLowerCase().replaceAll(" ", "-") +
        ".vokabeln.json",
      "application/json"
    );
  };

  return (
    <IonCard className="vocabCollectionCard">
      <section className="imageContainer">
        <img src={props.vocabCollection.image} alt="" />
      </section>

      <IonCardHeader>
        <IonCardSubtitle>{props.vocabCollection.subtitle}</IonCardSubtitle>
        <IonCardTitle>{props.vocabCollection.title}</IonCardTitle>
      </IonCardHeader>

      <IonCardContent>
        {props.vocabCollection.description}

        <IonGrid>
          <IonRow>
            <IonCol>
              <IonButton onClick={open} size="small">
                Öffnen
              </IonButton>
            </IonCol>
            <IonCol className="extraButtons">
              <IonButton
                className="buttonClear"
                onClick={confirmRemove}
                fill="clear"
                size="small"
              >
                <IonIcon icon={trash} slot="icon-only" size="small" />
              </IonButton>
              {!isPlatform("capacitor") && (
                <IonButton
                  className="buttonClear"
                  onClick={share}
                  fill="clear"
                  size="small"
                >
                  <IonIcon icon={shareSocial} slot="icon-only" size="small" />
                </IonButton>
              )}
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonCardContent>

      <IonAlert
        isOpen={showAlert}
        onDidDismiss={() => setShowAlert(false)}
        header={"Achtung!"}
        message={
          "Das Löschen kann <strong>nicht rückgängig</strong> gemacht werden"
        }
        buttons={[
          {
            text: "Abbrechen",
            role: "cancel",
            cssClass: "secondary",
            handler: () => setShowAlert(false),
          },
          {
            text: "Löschen",
            handler: () => {
              setShowAlert(false);
              remove();
            },
          },
        ]}
      />
    </IonCard>
  );
};

export default VocabCollectionCard;
