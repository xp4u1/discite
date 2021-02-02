import * as React from "react";
import {
  IonBackButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";

const DiscitePage: React.FC<{
  title: string;
  defaultBackHref: string;
  backText?: string;
  className?: string;
}> = ({ children, title, defaultBackHref, backText, className }) => {
  return (
    <IonPage className={className}>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton
              text={backText ? backText : "Zurück"}
              defaultHref={defaultBackHref}
            />
          </IonButtons>

          <IonTitle>{title}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>{children}</IonContent>
    </IonPage>
  );
};

export default DiscitePage;
