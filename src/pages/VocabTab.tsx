import * as React from "react";
import { useHistory } from "react-router";
import {
  IonCol,
  IonFab,
  IonFabButton,
  IonGrid,
  IonIcon,
  IonModal,
  IonRow,
  IonSearchbar,
  IonText,
} from "@ionic/react";
import { add } from "ionicons/icons";

import "./VocabTab.sass";
import VocabCollection, { newCollection } from "../classes/VocabCollection";
import VocabCollectionCard from "../components/VocabCollectionCard";
import VocabCollectionDetails from "../components/VocabCollectionDetails";
import DisciteTab from "../layouts/DisciteTab";
import { database } from "../middleware/Storage";
import { useLiveQuery } from "dexie-react-hooks";

const { useState, useEffect, useCallback } = React;

const VocabTab: React.FC = () => {
  const collections = useLiveQuery(() => database.collections.toArray());
  const [visibleCollections, setVisibleCollections] = useState<
    VocabCollection[]
  >([]);
  const [query, setQuery] = useState<string>("");
  const [showModal, setShowModal] = useState<boolean>(false);
  const [
    selectedCollection,
    setSelectedCollection,
  ] = useState<VocabCollection>();
  const history = useHistory();

  onkeydown = (event) => {
    if (!(event.metaKey || event.ctrlKey)) return;

    switch (event.key) {
      case "f":
        event.preventDefault();
        (document.getElementById("searchbar") as any).setFocus();
        break;
      // Für diese Kombination muss noch mit alt gedrückt werden.
      case "n":
        event.preventDefault();
        createCollection();
        break;
    }
  };

  const filterCollections = useCallback(() => {
    if (!collections) return;
    if (query === "") {
      setVisibleCollections(collections);
      return;
    }

    setVisibleCollections(
      collections.filter(
        (item) =>
          item.title.toLowerCase().indexOf(query.toLowerCase()) > -1 ||
          item.subtitle.toLowerCase().indexOf(query.toLowerCase()) > -1
      )
    );
  }, [query, collections]);

  const openModal = (id: number) => {
    setSelectedCollection(
      collections!.filter((collection) => collection.id === id)[0]
    );
    setShowModal(true);
  };

  const removeCollection = (id: number) => {
    database.collections.where("id").equals(id).delete();
  };

  const createCollection = () => {
    database.collections.add(newCollection).then((id) => {
      history.push(`/vocab/edit/${id}`);
    });
  };

  useEffect(filterCollections, [query, filterCollections]);
  useEffect(filterCollections, [collections, filterCollections]);

  if (!collections) return null;

  return (
    <DisciteTab title="Vokabeln">
      <IonSearchbar
        value={query}
        onIonChange={(event) => {
          setQuery(event.detail.value!);
        }}
        placeholder="Suche"
        id="searchbar"
      />

      <IonModal
        swipeToClose
        isOpen={showModal}
        onDidDismiss={() => {
          setShowModal(false);
        }}
      >
        <VocabCollectionDetails
          vocabCollection={selectedCollection!}
        ></VocabCollectionDetails>
      </IonModal>

      <IonFab vertical="bottom" horizontal="end" slot="fixed">
        <IonFabButton onClick={createCollection}>
          <IonIcon icon={add} />
        </IonFabButton>
      </IonFab>

      {visibleCollections.length === 0 && (
        <section className="noCollections">
          <strong>Keine Vokabelsammlungen gefunden</strong>
          <p>
            Klicke{" "}
            <IonText
              className="click"
              color="primary"
              onClick={createCollection}
            >
              hier
            </IonText>
            , um eine zu erstellen.
          </p>
        </section>
      )}

      <IonGrid>
        <IonRow>
          {visibleCollections.map((collection, index) => (
            <IonCol class="column" key={index}>
              <VocabCollectionCard
                vocabCollection={collection}
                openHandler={openModal}
                removeHandler={removeCollection}
              />
            </IonCol>
          ))}
        </IonRow>
      </IonGrid>
    </DisciteTab>
  );
};

export default VocabTab;
