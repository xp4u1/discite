import * as React from "react";
import {
  IonList,
  IonItem,
  IonLabel,
  IonIcon,
  IonText,
  IonItemSliding,
  IonItemOption,
  IonItemOptions,
  IonModal,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonSearchbar,
} from "@ionic/react";
import { trash, create } from "ionicons/icons";

import "./EditPage.sass";
import IndexCardEditor from "../components/IndexCardEditor";
import DiscitePage from "../layouts/DiscitePage";
import { database } from "../middleware/Storage";
import DictionaryEntry from "../classes/DictionaryEntry";
import { useLiveQuery } from "dexie-react-hooks";
import { LearnEntry } from "../middleware/database/DisciteDatabase";

const { useState, useRef, useEffect } = React;

const DatabasePage: React.FC = () => {
  const [selectedIndexCard, selectIndexCard] = useState<LearnEntry>({
    content: {
      word: "",
      forms: [],
      description: "",
      european: "",
      meanings: [],
    },
    date: 0,
    ease: 0,
    graduated: false,
    lastInterval: 0,
    relearning: false,
    step: 0,
  });
  const infiniteScroll = useRef(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [entries, setEntries] = useState<LearnEntry[]>([]);
  const [currentIndex, setCurrentIndex] = useState(20);
  const [query, setQuery] = useState<string>("");

  const indexCards = useLiveQuery(() => database.learn.toArray());

  const closeSlidings = () => {
    const item = document.querySelector("ion-item-sliding");
    if (item) item.closeOpened();
  };

  const removeIndexCard = (id: number) => {
    database.learn.delete(id);
    closeSlidings();
  };

  const editIndexCard = (indexCard: LearnEntry) => {
    selectIndexCard(indexCard);
    setShowModal(true);
    closeSlidings();
  };

  const saveIndexCard = (id: number, indexCard: DictionaryEntry) => {
    database.learn.update(id, {
      content: indexCard,
    });
  };

  const scroll = () => {
    setEntries(indexCards!.slice(0, currentIndex + 20));
    setCurrentIndex(currentIndex + 20);
    (infiniteScroll.current! as HTMLIonInfiniteScrollElement).complete();
    if (currentIndex + 20 >= indexCards!.length)
      (infiniteScroll.current! as HTMLIonInfiniteScrollElement).disabled = true;
  };

  const truncate = (text: string, count: number = 100) => {
    return text.length > count ? text.substring(0, count) + "..." : text;
  };

  const filterCards = React.useCallback(() => {
    if (query === "") {
      setEntries(indexCards!.slice(0, 20));
      setCurrentIndex(20);
      (infiniteScroll.current! as HTMLIonInfiniteScrollElement).disabled =
        false;
    } else {
      setEntries(
        indexCards!.filter(
          (card) =>
            card.content.word.toLowerCase().indexOf(query.toLowerCase()) > -1
        )
      );
    }
  }, [indexCards, infiniteScroll, query]);

  useEffect(() => {
    if (!indexCards) return;

    filterCards();
  }, [indexCards, query, filterCards]);

  if (!indexCards) return null;

  return (
    <DiscitePage title="Datenbank" defaultBackHref="/learn">
      <IonSearchbar
        value={query}
        onIonChange={(event) => {
          setQuery(event.detail.value!);
        }}
        placeholder="Suche"
        id="searchbar"
      />

      <IonList lines="full">
        {entries.length === 0 && (
          <>
            <IonItem lines="none">
              <IonLabel className="wrapText">
                Keine Vokabelkarten gefunden.
              </IonLabel>
            </IonItem>
          </>
        )}

        {entries.map((indexCard, index) => (
          <IonItemSliding key={index}>
            <IonItem lines={index === indexCards.length - 1 ? "none" : "full"}>
              <IonLabel className="ion-text-wrap">
                <h3>{indexCard.content.word}</h3>
                <IonText color="medium">
                  <p>{truncate(indexCard.content.meanings.join("; "))}</p>
                </IonText>
              </IonLabel>
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
                onClick={() => removeIndexCard(indexCard.id!)}
              >
                <IonIcon slot="icon-only" icon={trash} />
              </IonItemOption>
            </IonItemOptions>
          </IonItemSliding>
        ))}
      </IonList>

      <IonInfiniteScroll ref={infiniteScroll} onIonInfinite={scroll}>
        <IonInfiniteScrollContent
          loadingSpinner="circular"
          loadingText="Mehr Vokabelkarten werden geladen..."
        />
      </IonInfiniteScroll>

      <IonModal
        swipeToClose
        isOpen={showModal}
        onDidDismiss={() => setShowModal(false)}
      >
        <IndexCardEditor
          id={selectedIndexCard!.id || -1}
          indexCard={selectedIndexCard!.content}
          saveHandler={saveIndexCard}
        />
      </IonModal>
    </DiscitePage>
  );
};

export default DatabasePage;
