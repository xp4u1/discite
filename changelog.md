# 2.6.0

## Neuerungen

- Es gibt nun eine Tour für den Datenbank-Editor.

# 2.5.2

## Verbesserungen

- Die App unterstützt nun die neuste Android Version 14 (API Level 34).

# 2.5.1

## Hotfix

- Änderung der Berechtigungen
  - Der Maintainer von dem Cordova-Plugin `cordova-plugin-file-opener2` zwingt allen Apps, die es benutzen, die Berechtigung `android.permission.REQUEST_INSTALL_PACKAGES` auf. Google droht die App deshalb zu entfernen.

# 2.5.0

## Verbesserungen

- (Fast) alle Abhängigkeiten wurden aktualisiert. 

# 2.4.0

## Neuerungen

- Das Wörterbuch unterstützt nun Phrasen.
- Discite nutzt nun den neuen API-Endpunkt (GraphQL).

# 2.3.0

## Neuerungen

- Mit dem Datenbank-Editor kann nun seine Karten im Langzeittrainer bearbeiten.

## Behobene Bugs

- Wenn man absolvierte Karten neu lernt, werden jetzt keine falschen Auswahlmöglichkeiten mehr angezeigt.

# 2.2.0

## Neuerungen

- Im Lernen-Tab ist nun eine Kalender-Heatmap für Wiederholungen zu finden.

## Verbesserungen

- Stabilität von Discite wurde verbessert.
- Viele kleine Bugs wurden behoben.

# 2.1.0

## Neuerungen

- iOS/iPadOS wird nun offiziell unterstützt.

## Verbesserungen

- Die Tastatur in der Wörterbuchsuche schließt sich jetzt automatisch, wenn man den Suchbegriff eingetippt und abgesendet hat.
- Der Wechsel zwischen hellen und dunklem Theme ist nun auf vielen Geräten flüssiger.

## Behobene Bugs

- Die falschen Uhrzeiten im Lernen-Tab wurden behoben.

# 2.0.1

## Behobene Bugs

- Man kann jetzt wieder Vokabeln aus einer Sammlung zum Langzeittrainer hinzufügen.

# 2.0.0

## Neuerungen

- Discite nutzt nun einen modifizierten SM-2 Algorithmus für die Berechnung der Wiederholungen.

## Verbesserungen

- Die interne Datenbankstruktur wurde verändert.
  - Um Daten aus der Version 1 zu importieren, findet sich eine Option in Einstellungen.
  - Performance-Verbesserungen

# 1.2.0

## Neuerungen

- Keyboard shortcuts
  - Man kann nun bekannte Tastenkürzel auch in Discite nutzen. Mit `strg+s` kann man jetzt beispielsweise Karteikarten speichern oder sie mit `strg+j` automatisch ausfüllen.

# 1.1.0

## Neuerungen

- Backup
  - Man kann nun seine Daten aus Discite in eine Datei exportieren und auf jeder Platform, Android/iOS/Web, erneut einlesen.
- Import von Sammlungen
  - In der Browserversion kann man jetzt einzelne Sammlungen als Discite-Datei exportieren. Diese kann man dann in der App unter „Einstellungen/Vokabelsammlung importieren“ in der App benutzen.

## Verbesserungen

- Discite sollte nun stabiler laufen.
- Eine ungenutzte Einstellung wurde entfernt.
- Mehrere kleine UI-Verbesserungen

# 1.0.0

## Neuerungen

- Lernen-Tab
  - Vokabeln nie wieder vergessen! Discite hilft dir mit täglichen Wiederholungen, deine Vokabeln nicht zu vergessen.
  - Statistiken - Du kannst sehen wann und wie viel du gelernt hast. Diese Daten sind aber nur für dich und werden nie irgendwo online gespeichert und von Datenkraken ausgewertet.
- Discite unterscheidet jetzt zwischen „Lernen“ und „Für Test üben“
  - Die Funktion „Lernen“ fügt die Vokabeln einer Sammlung in den Langzeit-Trainer hinzu. Dieser sorgt dafür, dass du die Vokabel so lernst, dass du sie nicht mehr vergisst.
  - Die Funktion „Für Test üben“ kennt man aus vorherigen Versionen. Dies ist die alte Lernfunktion einer Sammlung, denn es werden die Vokabeln einer Sammlung so lange gelernt, bis in der Sitzung alle Karteikarten im Gedächtnis sind. Die Vokabeln werden aber nur wiederholt, wenn der Benutzer die Funktion erneut aufruft.
- Im Wörterbuch lassen sich falsche Einträge melden und die Vokabelkarten können direkt in den Langzeit-Trainer hinzugefügt werden.

## Verbesserungen

- Beim Erstellen einer neuen Vokabelsammlung wird sofort der Editor geöffnet.
- Die Suchfunktion bei den Sammlungen wurde verbessert.
- Viele kleine UI-Verbesserungen

# 0.2.0

## Neuerungen

- Übersichtsmodus
  - Alle Karteikarten einer Sammlung können nun mit einem Klick angezeigt werden.
- Touren
  - Die wichtigsten Funktionen erklärt die App nun von selbst.

## Verbesserungen

- Beim Karteikarteneditor wird automatisch im großen Wörterbuch gesucht, wenn kein Eintrag im anderen gefunden wird.

# 0.1.0

## Neuerungen

- Neue Konfigurationsmöglichkeiten in den Einstellungen
  - Verkürzte Einträge des Karteikarteneditors gibt es jetzt auch als Option für das normale Wörterbuch.
  - Im Karteikarteneditor können nun auch die Vollständigen Einträge genutzt werden.

## Verbesserungen

- Wenn es mehrere Auswahlmöglichkeiten in der Autovervollständigung des Karteikarteneditors gibt, wird der Dialog nun automatisch geöffnet.

## Behobene Bugs

- Grafikbugs im Wörterbuch
- Reihenfolge von Karteikarten im Lernmodus wurde überarbeitet, sodass keine gleichen mehr aufeinander folgen.

# 0.0.1

## Neuerungen

- **Erster Beta Release**
- Wörterbuch mit Formenanalyse
- Vokabelsammlungen mit Lernfunktion
- Darkmode