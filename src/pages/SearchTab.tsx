import * as React from "react";
import {
  IonCardSubtitle,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonList,
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
  IonGrid,
  IonRow,
  IonCol,
  isPlatform,
} from "@ionic/react";
import { Plugins } from "@capacitor/core";

import "./SearchTab.sass";
import DictionaryEntry from "../classes/DictionaryEntry";
import DictionaryEntryCard from "../components/DictionaryEntryCard";
import { searchDictionary } from "../middleware/Dictionary";
import { getSetting } from "../middleware/Storage";
import DisciteTab from "../layouts/DisciteTab";
import JoyrideTour from "../components/JoyrideTour";
import { tours } from "../classes/Tours";

const { useState } = React;
const { Keyboard } = Plugins;

const SearchTab: React.FC = () => {
  const [query, setQuery] = useState<string>("");
  const [entries, setEntries] = useState<DictionaryEntry[]>([]);
  const [showEntries, setShowEntries] = useState<boolean>(false);

  const search = async (query: string) => {
    searchDictionary(
      query,
      await getSetting("shortenedDictionaryEntries")
    ).then((response) => {
      setEntries(response);
      setShowEntries(true);

      if (isPlatform("capacitor")) Keyboard.hide();
    });
  };

  const handleChange = (event: any) => {
    setQuery(event.detail.value!);
    setShowEntries(false);
  };

  const handleSubmit = (event: any) => {
    search(query);
    event.preventDefault();
  };

  return (
    <DisciteTab title="Suche">
      <JoyrideTour tour={tours.dictionary} />

      <IonCard className="inputCard tourDictionaryIntro">
        <IonCardHeader>
          <IonCardSubtitle>Suche/Formenanalyse</IonCardSubtitle>
          <IonCardTitle>Wörterbuch</IonCardTitle>
        </IonCardHeader>
        <IonCardContent>
          <form onSubmit={(event) => handleSubmit(event)}>
            <IonList>
              <IonItem className="searchQueryItem">
                <IonLabel position="stacked">Begriff auf Latein</IonLabel>
                <IonInput
                  onIonChange={handleChange}
                  placeholder="facere"
                  type="text"
                  enterkeyhint="search"
                  required
                />
              </IonItem>

              <div className="ion-padding">
                <IonButton
                  disabled={query === ""}
                  expand="block"
                  type="submit"
                  className="ion-no-margin"
                >
                  Suchen
                </IonButton>
              </div>
            </IonList>
          </form>
        </IonCardContent>
      </IonCard>

      {showEntries && entries.length === 0 && (
        <p id="notFound">Leider konnte nichts gefunden werden.</p>
      )}

      {showEntries && (
        <IonGrid>
          <IonRow>
            {entries.map((entry, index) => (
              <IonCol
                key={index}
                className={index === 0 ? "entry tourDictionaryCard" : "entry"}
              >
                <DictionaryEntryCard dictionaryEntry={entry} actionButtons />
              </IonCol>
            ))}
          </IonRow>
        </IonGrid>
      )}
    </DisciteTab>
  );
};

export default SearchTab;
