import * as React from "react";
import {
  IonList,
  IonItemDivider,
  IonInput,
  IonItem,
  IonLabel,
  IonTextarea,
  IonIcon,
  IonText,
  IonItemSliding,
  IonItemOption,
  IonItemOptions,
  IonModal,
  IonToast,
} from "@ionic/react";
import { trash, create } from "ionicons/icons";

import "./EditPage.sass";
import VocabCollection from "../classes/VocabCollection";
import IndexCard from "../classes/IndexCard";
import { Store } from "../middleware/Store";
import {
  selectVocabCollection,
  updateVocabCollection,
} from "../middleware/features/VocabCollectionStore";
import IndexCardEditor from "../components/IndexCardEditor";
import DiscitePage from "../layouts/DiscitePage";

const { useEffect, useState } = React;

const EditPage: React.FC = () => {
  const [collection, setCollection] = useState<VocabCollection>(
    Store.getState().vocabCollection.selectedCollection!
  );
  const [selectedIndexCard, selectIndexCard] = useState<IndexCard>();
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showToast, setShowToast] = useState<boolean>(false);

  Store.subscribe(() => {
    setCollection(Store.getState().vocabCollection.selectedCollection!);
  });

  useEffect(() => {
    Store.dispatch(
      updateVocabCollection({
        id: Store.getState().vocabCollection.collections.indexOf(
          Store.getState().vocabCollection.selectedCollection!
        ),
        data: collection,
      })
    );
    Store.dispatch(selectVocabCollection(collection));
  }, [collection]);

  const closeSlidings = () => {
    const item = document.querySelector("ion-item-sliding");
    if (item) item.closeOpened();
  };

  const removeIndexCard = (indexCard: IndexCard) => {
    const state = Store.getState();
    const index = state.vocabCollection.collections.indexOf(
      state.vocabCollection.selectedCollection!
    );
    const vocabCollection = state.vocabCollection.collections[index];

    Store.dispatch(
      updateVocabCollection({
        id: index,
        data: {
          ...vocabCollection,
          indexCards: vocabCollection.indexCards.filter(
            (card) => indexCard !== card
          ),
        },
      })
    );

    setTimeout(() => {
      // Änderungen müssen auch in den "selected" Zwischenspeicher übernommen werden.
      Store.dispatch(
        selectVocabCollection(
          Store.getState().vocabCollection.collections[index]
        )
      );

      closeSlidings();
    }, 0);
  };

  const editIndexCard = (indexCard: IndexCard) => {
    selectIndexCard(indexCard);
    setShowModal(true);

    closeSlidings();
  };

  const addIndexCard = () => {
    editIndexCard(
      // Neue, leere Karteikarte
      {
        content: {
          word: "",
          principal_forms: [],
          form: "",
          description: "",
          european: "",
          meanings: [],
        },
        repetition: 0,
      }
    );
  };

  return (
    <DiscitePage title={collection.title} defaultBackHref="/vocab">
      <IonList lines="full">
        <IonItemDivider>Einstellungen</IonItemDivider>
        <IonItem>
          <IonLabel position="fixed">Titel</IonLabel>
          <IonInput
            value={collection.title}
            onIonChange={(event) =>
              setCollection({
                ...collection,
                title: event.detail.value!,
              })
            }
          />
        </IonItem>
        <IonItem>
          <IonLabel position="fixed">Kategorie</IonLabel>
          <IonInput
            value={collection.subtitle}
            placeholder="Lektion 42"
            onIonChange={(event) =>
              setCollection({
                ...collection,
                subtitle: event.detail.value!,
              })
            }
          />
        </IonItem>
        <IonItem>
          <IonLabel position="fixed">Bild</IonLabel>
          <IonInput
            value={collection.image}
            placeholder="https://example.com/image.jpg"
            onIonChange={(event) =>
              setCollection({
                ...collection,
                image: event.detail.value!,
              })
            }
          />
        </IonItem>
        <IonItem lines="none">
          <IonTextarea
            value={collection.description}
            placeholder="Beschreibung"
            onIonChange={(event) =>
              setCollection({
                ...collection,
                description: event.detail.value!,
              })
            }
          />
        </IonItem>

        <IonItemDivider>Vokabeln</IonItemDivider>

        {collection.indexCards.length === 0 && (
          <>
            <IonItem lines="none">
              <IonLabel className="wrapText">
                Es sind noch keine Vokabeln enthalten.{" "}
                <IonText
                  id="createIndexCard"
                  color="primary"
                  onClick={addIndexCard}
                >
                  Jetzt erste Karteikarte erstellen.
                </IonText>
              </IonLabel>
            </IonItem>
          </>
        )}

        {collection.indexCards.length !== 0 && (
          <IonItem lines="full">
            <IonLabel>
              <IonText
                id="createIndexCard"
                color="primary"
                onClick={addIndexCard}
              >
                Karteikarte erstellen
              </IonText>
            </IonLabel>
          </IonItem>
        )}
        {collection.indexCards.map((indexCard, index) => (
          <IonItemSliding key={index}>
            <IonItem
              lines={
                index === collection.indexCards.length - 1 ? "none" : "full"
              }
            >
              <IonLabel>{indexCard.content.word}</IonLabel>
            </IonItem>

            <IonItemOptions side="end">
              <IonItemOption
                color="primary"
                onClick={() => editIndexCard(indexCard)}
              >
                <IonIcon slot="icon-only" icon={create} />
              </IonItemOption>
              <IonItemOption
                color="danger"
                onClick={() => removeIndexCard(indexCard)}
              >
                <IonIcon slot="icon-only" icon={trash} />
              </IonItemOption>
            </IonItemOptions>
          </IonItemSliding>
        ))}
      </IonList>

      <IonModal
        swipeToClose
        isOpen={showModal}
        onDidDismiss={() => setShowModal(false)}
      >
        <IndexCardEditor
          indexCard={selectedIndexCard!}
          indexCardId={
            collection.indexCards.indexOf(selectedIndexCard!) === -1
              ? // Fügt am Ende hinzu:
                collection.indexCards.length
              : // Ändert vorhandene Karteikarte:
                collection.indexCards.indexOf(selectedIndexCard!)
          }
        ></IndexCardEditor>
      </IonModal>

      <IonToast
        isOpen={showToast}
        onDidDismiss={() => setShowToast(false)}
        message="Die Vokabelsammlung wurde gespeichert."
        color="success"
        duration={1000}
      />
    </DiscitePage>
  );
};

export default EditPage;
