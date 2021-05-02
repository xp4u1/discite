import * as React from "react";
import { IonCol, IonGrid, IonRow } from "@ionic/react";
import { useParams } from "react-router";

import "./OverviewPage.sass";
import DictionaryEntryCard from "../components/DictionaryEntryCard";
import DiscitePage from "../layouts/DiscitePage";
import IndexCard from "../classes/IndexCard";
import { database } from "../middleware/Storage";

const { useEffect, useState } = React;

const OverviewPage: React.FC = () => {
  const [indexCards, setIndexCards] = useState<IndexCard[]>([]);
  const params = useParams<{ id: string | undefined }>();

  useEffect(() => {
    database.collections.get(Number.parseInt(params.id!)).then((result) => {
      setIndexCards(result!.indexCards);
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <DiscitePage
      title="Übersicht"
      className="overviewPage"
      defaultBackHref="/vocab"
    >
      <IonGrid>
        <IonRow>
          {indexCards.map((indexCard, index) => (
            <IonCol key={index} className="entry">
              <DictionaryEntryCard dictionaryEntry={indexCard.content} />
            </IonCol>
          ))}
        </IonRow>
      </IonGrid>
    </DiscitePage>
  );
};

export default OverviewPage;
