import * as React from "react";
import {
  IonButton,
  IonIcon,
  IonItem,
  IonItemDivider,
  IonLabel,
  IonList,
  IonModal,
  IonToast,
  IonToggle,
} from "@ionic/react";
import {
  archiveOutline,
  buildOutline,
  checkmarkDoneOutline,
  enterOutline,
  fileTrayFullOutline,
  mapOutline,
  refreshOutline,
} from "ionicons/icons";

import "./SettingsTab.scss";
import { getSetting, setSetting } from "../middleware/Storage";
import { changeDarkMode } from "../middleware/DarkMode";
import DisciteTab from "../layouts/DisciteTab";
import JoyrideTour from "../components/JoyrideTour";
import { tours } from "../classes/Tours";
import {
  saveBackup,
  loadBackup,
  loadVocabCollection,
} from "../middleware/Backup";
import AdvancedSettingsModal from "../components/AdvancedSettingsModal";
import { defaultShowTimespan } from "../middleware/Defaults";
import { importV1 } from "../middleware/database/Migration";

const { useState, useEffect } = React;

const SettingsTab: React.FC = () => {
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [
    shortenedDictionaryEntries,
    setShortenedDictionaryEntries,
  ] = useState<boolean>(false);
  const [allEntriesIndexCard, setAllEntriesIndexCard] = useState<boolean>(
    false
  );
  const [showTimespan, setShowTimespan] = useState<boolean>(
    defaultShowTimespan
  );
  const [showModal, setShowModal] = useState<boolean>(false);
  const [toast, setToastData] = useState<{
    show: boolean;
    message: string;
    color: string;
  }>({
    show: false,
    message: "",
    color: "",
  });

  const resetTours = (active: boolean) => {
    Object.values(tours).forEach((value) => {
      setSetting(value.name, active);
    });
  };

  const backup = () => {
    saveBackup()
      .then((message) => {
        setToastData({
          show: true,
          message: message,
          color: "primary",
        });
      })
      .catch(() => {
        setToastData({
          show: true,
          message: "Das Backup konnte nicht gespeichert werden!",
          color: "danger",
        });
      });
  };

  const restore = () => {
    loadBackup()
      .then(() =>
        setToastData({
          show: true,
          message: "Die Daten des Backups wurden geladen.",
          color: "primary",
        })
      )
      .catch((reason) => {
        setToastData({
          show: true,
          message: reason,
          color: "danger",
        });
      });
  };

  const importVocabCollection = () => {
    loadVocabCollection()
      .then(() => {
        setToastData({
          show: true,
          message: "Die Vokabelsammlung wurde importiert.",
          color: "primary",
        });
      })
      .catch((reason) => {
        setToastData({
          show: true,
          message: reason,
          color: "danger",
        });
      });
  };

  const importLegacy = () => {
    importV1().then((success) => {
      success
        ? setToastData({
            show: true,
            message: "Die Daten wurden erfolgreich importiert.",
            color: "primary",
          })
        : setToastData({
            show: true,
            message: "Es existieren keine alten Daten!",
            color: "danger",
          });
    });
  };

  useEffect(() => {
    getSetting("darkMode").then((result) => {
      setDarkMode(result);
    });
    getSetting("shortenedDictionaryEntries", false).then((result) => {
      setShortenedDictionaryEntries(result);
    });
    getSetting("allEntriesIndexCard", false).then((result) => {
      setAllEntriesIndexCard(result);
    });
    getSetting("showTimespan", defaultShowTimespan).then((result) => {
      setShowTimespan(result);
    });
  }, []);

  useEffect(() => {
    // Settings werden auch geändert.
    changeDarkMode(darkMode);
  }, [darkMode]);

  useEffect(() => {
    setSetting("shortenedDictionaryEntries", shortenedDictionaryEntries);
  }, [shortenedDictionaryEntries]);

  useEffect(() => {
    setSetting("allEntriesIndexCard", allEntriesIndexCard);
  }, [allEntriesIndexCard]);

  useEffect(() => {
    setSetting("showTimespan", showTimespan);
  }, [showTimespan]);

  return (
    <DisciteTab title="Einstellungen" className="settingsTab">
      <JoyrideTour tour={tours.settings} />

      <IonList className="editorList" lines="full">
        <IonItemDivider>Aussehen</IonItemDivider>
        <IonItem lines="none">
          <IonLabel className="tourSettingsDarkMode">Darkmode</IonLabel>
          <IonToggle
            checked={darkMode}
            onIonChange={(event) => setDarkMode(event.detail.checked)}
          />
        </IonItem>

        <IonItemDivider>Wörterbuch</IonItemDivider>
        <IonItem>
          <IonLabel className="tourSettingsShortMeanings">
            Verkürzte Wörterbucheinträge
          </IonLabel>
          <IonToggle
            checked={shortenedDictionaryEntries}
            onIonChange={(event) =>
              setShortenedDictionaryEntries(event.detail.checked)
            }
          />
        </IonItem>
        <IonItem lines="none">
          <IonLabel className="tourSettingsAllMeanings">
            Karteikarten: Alle Bedeutungen
          </IonLabel>
          <IonToggle
            checked={allEntriesIndexCard}
            onIonChange={(event) =>
              setAllEntriesIndexCard(event.detail.checked)
            }
          />
        </IonItem>

        <IonItemDivider>Backup</IonItemDivider>
        <IonItem>
          <IonLabel className="tourSettingsBackup">
            Lokales Backup erstellen
          </IonLabel>
          <IonButton onClick={backup} class="settingsButton">
            <IonIcon slot="icon-only" size="l" icon={archiveOutline} />
          </IonButton>
        </IonItem>
        <IonItem>
          <IonLabel>Aus Backup wiederherstellen</IonLabel>
          <IonButton onClick={restore} color="light" class="settingsButton">
            <IonIcon slot="icon-only" size="l" icon={refreshOutline} />
          </IonButton>
        </IonItem>
        <IonItem>
          <IonLabel>Vokabelsammlung importieren</IonLabel>
          <IonButton
            onClick={importVocabCollection}
            color="light"
            class="settingsButton"
          >
            <IonIcon slot="icon-only" size="l" icon={fileTrayFullOutline} />
          </IonButton>
        </IonItem>
        <IonItem lines="none">
          <IonLabel>Alte Daten importieren</IonLabel>
          <IonButton
            onClick={importLegacy}
            color="light"
            class="settingsButton"
          >
            <IonIcon slot="icon-only" size="l" icon={enterOutline} />
          </IonButton>
        </IonItem>

        <IonItemDivider>Langzeittrainer</IonItemDivider>
        <IonItem>
          <IonLabel className="tourSettingsShortMeanings">
            Zeitspanne anzeigen
          </IonLabel>
          <IonToggle
            checked={showTimespan}
            onIonChange={(event) => setShowTimespan(event.detail.checked)}
          />
        </IonItem>
        <IonItem lines="none">
          <IonLabel>Erweiterte Einstellungen</IonLabel>
          <IonButton
            onClick={() => setShowModal(true)}
            color="light"
            class="settingsButton"
          >
            <IonIcon slot="icon-only" size="l" icon={buildOutline} />
          </IonButton>
        </IonItem>

        <IonItemDivider>Hilfen</IonItemDivider>
        <IonItem>
          <IonLabel>Touren wiederherstellen</IonLabel>
          <IonButton
            onClick={() => resetTours(true)}
            color="light"
            class="settingsButton"
          >
            <IonIcon slot="icon-only" size="l" icon={mapOutline} />
          </IonButton>
        </IonItem>
        <IonItem lines="none">
          <IonLabel>Alle Touren beenden</IonLabel>
          <IonButton
            onClick={() => resetTours(false)}
            color="light"
            class="settingsButton"
          >
            <IonIcon slot="icon-only" size="l" icon={checkmarkDoneOutline} />
          </IonButton>
        </IonItem>
      </IonList>

      <IonModal
        swipeToClose
        isOpen={showModal}
        onDidDismiss={() => setShowModal(false)}
      >
        <AdvancedSettingsModal />
      </IonModal>

      <IonToast
        isOpen={toast.show}
        onDidDismiss={() => setToastData({ ...toast, show: false })}
        message={toast.message}
        color={toast.color}
        duration={2000}
      />
    </DisciteTab>
  );
};

export default SettingsTab;
