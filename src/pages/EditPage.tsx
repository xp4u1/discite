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
import { useParams } from "react-router";

import "./EditPage.sass";
import VocabCollection, { newCollection } from "../classes/VocabCollection";
import IndexCard from "../classes/IndexCard";
import IndexCardEditor from "../components/IndexCardEditor";
import DiscitePage from "../layouts/DiscitePage";
import { database } from "../middleware/Storage";
import DictionaryEntry from "../classes/DictionaryEntry";

const { useEffect, useState } = React;

const EditPage: React.FC = () => {
  const [collection, setCollection] = useState<VocabCollection>(newCollection);
  const [selectedIndexCard, selectIndexCard] = useState<IndexCard>();
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showToast, setShowToast] = useState<boolean>(false);
  const params = useParams<{ id: string | undefined }>();

  onkeydown = (event) => {
    if (!(event.metaKey || event.ctrlKey)) return;

    switch (event.key) {
      // Für diese Kombination muss noch mit alt gedrückt werden.
      case "n":
        event.preventDefault();
        addIndexCard();
        break;
    }
  };

  useEffect(() => {
    database.collections.get(Number.parseInt(params.id!)).then((result) => {
      setCollection(result!);
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Alle Änderungen werden automatisch gespeichert.
  useEffect(() => {
    database.collections.update(Number.parseInt(params.id!), collection);
  }, [collection, params]);

  const closeSlidings = () => {
    const item = document.querySelector("ion-item-sliding");
    if (item) item.closeOpened();
  };

  const removeIndexCard = (indexCard: IndexCard) => {
    setCollection({
      ...collection,
      indexCards: collection.indexCards.filter((card) => indexCard !== card),
    });
    closeSlidings();
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

  const saveIndexCard = (id: number, content: DictionaryEntry) => {
    const indexCard: IndexCard = {
      content: content,
      repetition: 0,
    };

    if (id === -1) {
      setCollection({
        ...collection,
        indexCards: [...collection.indexCards, indexCard],
      });
    } else {
      setCollection({
        ...collection,
        indexCards: collection.indexCards.map((card, index) =>
          // Tauscht die Karte mit der Id gegen den neuen Eintrag.
          index === id ? indexCard : card
        ),
      });
    }
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
          id={collection.indexCards.indexOf(selectedIndexCard!)}
          indexCard={selectedIndexCard!}
          saveHandler={saveIndexCard}
        />
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
