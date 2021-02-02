import * as React from "react";
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";

const DisciteTab: React.FC<{
  title: string;
  className?: string;
}> = ({ children, title, className }) => {
  return (
    <IonPage className={className}>
      <IonHeader>
        <IonToolbar>
          <IonTitle>{title}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>{children}</IonContent>
    </IonPage>
  );
};

export default DisciteTab;
