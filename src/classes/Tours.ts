import { Step } from "react-joyride";

export default interface Tour {
  name: string;
  steps: Step[];
}

export const tours = {
  settings: {
    name: "tour-settings",
    steps: [
      {
        target: ".tourSettingsDarkMode",
        title: "Darkmode",
        content:
          "Hier kannst du das Aussehen der App verändern. Dieser Modus ist gut für das Lernen in schlecht beleuchteten Räumen.",
      },
      {
        target: ".tourSettingsShortMeanings",
        content:
          "Diese Einstellung schaltet den Modus des Wörterbuchs um: Es gibt zwar weniger Einträge, aber die Bedeutungen der Wörter sind auf ein Minimum gekürzt.",
      },
      {
        target: ".tourSettingsAllMeanings",
        content:
          "Im Karteikarteneditor werden bevorzugt die kurzen Einträge genutzt, damit die Vokabeln leichter zu lernen sind. Meist ist es vollkommen ausreichend, nur die verkürzten Bedeutungen auswendig zu können.",
      },
      {
        target: ".tourSettingsBackup",
        title: "Datensicherung",
        content:
          "Du solltest regelmäßig deinen Discite-Lernfortschritt an einem sicheren Ort speichern. Wenn du die App deinstallierst oder dein Gerät verlierst, sind sämtliche Daten verloren, aber wenn du ein Backup besitzt, kannst du sie wieder herstellen.",
      },
    ],
  },
  dictionary: {
    name: "tour-dictionary",
    steps: [
      {
        target: ".tourDictionaryIntro",
        title: "Das Wörterbuch",
        content:
          "In diesem Wörterbuch brauchst du nicht lange blättern, um das Wort zu finden, welches dir gerade Probleme bereitet. Du musst es einfach nur eintippen und los geht die Suche.\n(Für dieses Feature wird eine aktive Internetverbindung benötigt)",
      },
    ],
  },
  learn: {
    name: "tour-learn",
    steps: [
      {
        target: ".tourLearnToday",
        content:
          "Hier werden dir alle Vokabeln angezeigt, die du heute wiederholen musst. Wenn du mal einen Tag nicht gelernt hast, werden die Einträge automatisch beim nächsten Tag angezeigt.",
      },
      {
        target: ".tourLearnTomorrow",
        content:
          "Es gibt auch eine Übersicht für morgen. So weißt du, wann du das nächste Mal vorbeischauen solltest.",
      },
      {
        target: ".tourLearnStats",
        title: "Statistiken",
        content:
          "Discite merkt sich, wann du lernst. Hier siehst du eine Übersicht der letzten sieben Tage.",
      },
      {
        target: ".tourLearnVocabulary",
        content:
          "Wenn eine Vokabel das achte Mal wiederholt wurde, ist sie in deinem Langzeitgedächtnis.",
      },
      {
        target: ".tourLearnButton",
        content:
          "Mit einem Klick auf diesen Knopf kannst du alle Vokabeln für heute wiederholen. Der Fortschritt wird aber nur gespeichert, wenn du alle Vokabeln gelernt hast.",
      },
    ],
  },
  editor: {
    name: "tour-editor",
    steps: [
      {
        target: ".tourInputWord",
        content:
          "Gib hier deinen Begriff oder deine Phrase ein. Was in diesem Feld eingetragen wird, erscheint auf der Vorderseite der Karteikarte.",
      },
      {
        target: ".tourLookUp",
        content:
          "Wenn du auf dieses Feld klickst, füllt Discite die restlichen Felder mithilfe des Wörterbuchs für dich aus.",
      },
      {
        target: ".tourSave",
        content:
          "Hier speicherst du deine Karteikarte. Wenn du sie bearbeiten oder löschen willst, musst du in der Listenansicht mit dem Finger auf der Vokabel von rechts nach links wischen.",
      },
    ],
  },
};
