import * as React from "react";
import { modalController } from "@ionic/core";
import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonSelect,
  IonSelectOption,
  IonTextarea,
  IonTitle,
  IonToast,
  IonToolbar,
} from "@ionic/react";
import { close, library } from "ionicons/icons";

import "./IndexCardEditor.sass";
import IndexCard from "../classes/IndexCard";
import DictionaryEntry, {
  DictionaryEntriesResponse,
} from "../classes/DictionaryEntry";
import { tours } from "../classes/Tours";
import Dictionary from "../middleware/Dictionary";
import { Store } from "../middleware/Store";
import {
  selectVocabCollection,
  updateVocabCollection,
} from "../middleware/features/VocabCollectionStore";
import { getSetting } from "../middleware/Storage";
import JoyrideTour from "./JoyrideTour";

const { useEffect, useState } = React;

const IndexCardEditor: React.FC<{
  indexCard: IndexCard;
  indexCardId: number;
}> = (props) => {
  const [indexCard, setIndexCard] = useState<DictionaryEntry>(
    props.indexCard.content!
  );
  const [options, setOptions] = useState<string[]>([]);
  const [response, setResponse] = useState<DictionaryEntriesResponse>();
  const [showToast, setShowToast] = useState<boolean>(false);

  onkeydown = (event) => {
    if (!(event.metaKey || event.ctrlKey)) return;

    switch (event.key) {
      case "s":
        event.preventDefault();
        saveIndexCard();
        break;
      case "j":
        event.preventDefault();
        lookUp();
        break;
    }
  };

  useEffect(() => {
    setTimeout(() => {
      (document.getElementById("inputWord") as any).setFocus();
    }, 1000);
  }, []);

  const dismiss = () => {
    modalController.dismiss();
  };

  const saveIndexCard = () => {
    const state = Object.assign({}, Store.getState());
    const collectionIndex = state.vocabCollection.collections.indexOf(
      state.vocabCollection.selectedCollection!
    );
    let collection = state.vocabCollection.collections[collectionIndex];

    const card: IndexCard = {
      content: indexCard,
      repetition: 0,
    };
    if (collection.indexCards.length === props.indexCardId) {
      Store.dispatch(
        updateVocabCollection({
          id: collectionIndex,
          data: {
            ...collection,
            indexCards: [...collection.indexCards, card],
          },
        })
      );
    } else {
      Store.dispatch(
        updateVocabCollection({
          id: collectionIndex,
          data: {
            ...collection,
            indexCards: collection.indexCards.map((value: any, index: any) => {
              // Tauscht Alt gegen Neu.
              return index === props.indexCardId ? card : value;
            }),
          },
        })
      );
    }

    setTimeout(() => {
      // Änderungen müssen auch in den "selected" Zwischenspeicher übernommen werden.
      Store.dispatch(
        selectVocabCollection(
          Store.getState().vocabCollection.collections[collectionIndex]
        )
      );

      dismiss();
    }, 0);
  };

  const apiRequest = async (word: string, onlySchool: boolean) => {
    Dictionary.search(word, onlySchool).then((response) => {
      switch (response.entries.length) {
        case 0:
          if (onlySchool) {
            // Die Suche wird auf das „richtige“ Wörterbuch ausgeweitet,
            // da kein verkürzter Eintrag existierte.
            apiRequest(word, false);
          } else {
            // Es existiert kein Eintrag zu diesem Wort.
            setShowToast(true);
          }
          break;
        case 1:
          setIndexCard(response.entries[0]);
          break;
        default:
          setResponse(response);
          // Es gibt mehr als einen Eintrag. Es wird ein Auswahlfeld erstellt
          // und automatisch geöffnet.
          setOptions(
            response.entries.map((entry) => entry.principal_forms.join(", "))
          );
          document.querySelector("ion-select")?.open();
      }
    });
  };

  const lookUp = async () => {
    apiRequest(indexCard.word, !(await getSetting("allEntriesIndexCard")));
  };

  const selectDictionaryEntry = (event: any) => {
    const entry = response?.entries.filter(
      (entry) => entry.principal_forms.join(", ") === event.detail.value
    )[0];
    if (entry) setIndexCard(entry);
  };

  return (
    <>
      <JoyrideTour tour={tours.editor} />

      <IonHeader translucent>
        <IonToolbar>
          <IonButtons slot="start">
            <IonButton onClick={dismiss}>
              <IonIcon icon={close} />
            </IonButton>
          </IonButtons>
          <IonTitle>Karteikarten-Editor</IonTitle>
        </IonToolbar>
        <IonContent fullscreen>
          <IonList className="editorList" lines="full">
            {response !== undefined && (
              <IonSelect
                title="Wörterbucheintrag"
                id="dictionaryEntries"
                placeholder="Wähle einen Wörterbucheintrag"
                onIonChange={(event) => selectDictionaryEntry(event)}
              >
                {options.map((option, index) => (
                  <IonSelectOption key={index} value={option}>
                    {option}
                  </IonSelectOption>
                ))}
              </IonSelect>
            )}
            <IonItem>
              <IonLabel>Wort</IonLabel>
              <IonInput
                value={indexCard.word}
                placeholder="exīre"
                onIonChange={(event) =>
                  setIndexCard({
                    ...indexCard,
                    word: event.detail.value!,
                  })
                }
                class="tourInputWord"
                id="inputWord"
              />
              <IonIcon
                id="lookUp"
                class="tourLookUp"
                slot="end"
                icon={library}
                onClick={lookUp}
              />
            </IonItem>
            <IonItem>
              <IonLabel>Stammformen</IonLabel>
              <IonInput
                value={indexCard.principal_forms.join(", ")}
                placeholder="exīre, exeō, exiī, exitum"
                onIonChange={(event) =>
                  setIndexCard({
                    ...indexCard,
                    principal_forms: event.detail.value!.split(", "),
                  })
                }
              />
            </IonItem>
            <IonItem>
              <IonLabel>Beschreibung</IonLabel>
              <IonInput
                value={indexCard.description}
                placeholder="Verb, Kompositum von ire"
                onIonChange={(event) =>
                  setIndexCard({
                    ...indexCard,
                    description: event.detail.value!,
                  })
                }
              />
            </IonItem>
            <IonItem>
              <IonTextarea
                value={indexCard.meanings.join("; ")}
                placeholder="Bedeutungen"
                onIonChange={(event) =>
                  setIndexCard({
                    ...indexCard,
                    meanings: event.detail.value!.split("; "),
                  })
                }
                autoGrow
              />
            </IonItem>

            <section className="ion-padding-start ion-padding-end">
              <IonButton
                expand="block"
                onClick={() => {
                  saveIndexCard();
                }}
                className="saveButton tourSave"
              >
                Speichern
              </IonButton>
            </section>
          </IonList>

          <IonToast
            isOpen={showToast}
            onDidDismiss={() => setShowToast(false)}
            message="Es gibt keine Wörterbucheinträge zu diesem Begriff."
            color="danger"
            duration={2000}
          />
        </IonContent>
      </IonHeader>
    </>
  );
};

export default IndexCardEditor;
