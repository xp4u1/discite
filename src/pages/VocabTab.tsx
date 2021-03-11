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
import VocabCollection from "../classes/VocabCollection";
import VocabCollectionCard from "../components/VocabCollectionCard";
import VocabCollectionDetails from "../components/VocabCollectionDetails";
import { Store } from "../middleware/Store";
import {
  createVocabCollection,
  removeVocabCollection,
  selectVocabCollection,
} from "../middleware/features/VocabCollectionStore";
import DisciteTab from "../layouts/DisciteTab";

const { useState, useEffect, useCallback } = React;

const VocabTab: React.FC = () => {
  const [collections, setCollections] = useState<VocabCollection[]>(
    Store.getState().vocabCollection.collections
  );
  const [visibleCollections, setVisibleCollections] = useState<
    VocabCollection[]
  >(Store.getState().vocabCollection.collections);
  const [query, setQuery] = useState<string>("");
  const [showModal, setShowModal] = useState<boolean>(false);
  const history = useHistory();

  useEffect(() => {
    let isMounted = true;
    Store.subscribe(() => {
      if (!isMounted) return;

      let collections = Store.getState().vocabCollection.collections;
      setCollections(collections);

      if (query !== "") {
        filterCollections();
      } else {
        setVisibleCollections(collections);
      }
    });

    return () => {
      isMounted = false;
    };
  });

  const filterCollections = useCallback(() => {
    if (query === "") {
      setVisibleCollections(collections);
      return;
    }

    setVisibleCollections(
      collections!.filter(
        (item) =>
          item.title.toLowerCase().indexOf(query.toLowerCase()) > -1 ||
          item.subtitle.toLowerCase().indexOf(query.toLowerCase()) > -1
      )
    );
  }, [query, collections]);

  const openModal = (index: number) => {
    Store.dispatch(
      selectVocabCollection(Store.getState().vocabCollection.collections[index])
    );
    setShowModal(true);
  };

  const openCollection = (vocabCollection: VocabCollection) => {
    openModal(collections.indexOf(vocabCollection));
  };

  const removeCollection = (vocabCollection: VocabCollection) => {
    Store.dispatch(removeVocabCollection(collections.indexOf(vocabCollection)));
  };

  const createCollection = () => {
    Store.dispatch(createVocabCollection(null));
    Store.dispatch(
      selectVocabCollection(
        Store.getState().vocabCollection.collections[collections.length]
      )
    );

    history.push("/vocab/edit");
  };

  useEffect(() => {
    filterCollections();
  }, [query, filterCollections]);

  return (
    <DisciteTab title="Vokabeln">
      <IonSearchbar
        value={query}
        onIonChange={(event) => {
          setQuery(event.detail.value!);
        }}
        placeholder="Suche"
      />

      <IonModal
        swipeToClose
        isOpen={showModal}
        onDidDismiss={() => {
          setShowModal(false);
        }}
      >
        <VocabCollectionDetails
          vocabCollection={Store.getState().vocabCollection.selectedCollection!}
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
          {visibleCollections!.map((collection) => (
            <IonCol class="column" key={collections!.indexOf(collection)}>
              <VocabCollectionCard
                vocabCollection={collection}
                openHandler={openCollection}
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
