import * as React from "react";
import { IonCol, IonGrid, IonRow } from "@ionic/react";

import "./OverviewPage.sass";
import { Store } from "../middleware/Store";
import DictionaryEntryCard from "../components/DictionaryEntryCard";
import DiscitePage from "../layouts/DiscitePage";
import IndexCard from "../classes/IndexCard";

const OverviewPage: React.FC = () => {
  return (
    <DiscitePage
      title="Übersicht"
      className="overviewPage"
      defaultBackHref="/vocab"
    >
      <IonGrid>
        <IonRow>
          {Store.getState().vocabCollection.selectedCollection!.indexCards.map(
            (indexCard: IndexCard) => (
              <IonCol key={indexCard.content.meanings.join()} className="entry">
                <DictionaryEntryCard dictionaryEntry={indexCard.content} />
              </IonCol>
            )
          )}
        </IonRow>
      </IonGrid>
    </DiscitePage>
  );
};

export default OverviewPage;
