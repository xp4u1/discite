# Algorithmus

## Grundlage

Der Algorithmus von dem Langzeittrainer basiert auf dem SM-2 Algorithmus[¹](#1) ähnlich wie bei Anki[²](#2)

## Phasen

Es gibt drei verschiedene Phasen von Karten: lernend (learning), absolviert (graduated) und neu-lernend (relearning).

### Lernphase

In der Lernphase wird der sogenannte *ease factor* nicht verändert. Die Karte muss mehrer Stufen durchlaufen, um als absolviert eingestuft zu werden. Discite nutzt hier andere Schritte, als die Standarteinstellungen von Anki sind.

Schritte in Minuten: 15, 1440, 4320

Das entspricht 15 min, einem Tag und drei Tagen. Nach diesem Zeitraum gilt die Karte als absolviert und wird nach sechs Tagen wieder angezeigt. Diese Schritte helfen dabei, nicht kurz nach den ersten Wiederholungen bereits den *ease factor* zu verringern.

### Absolviert-Phase

In der Absolviert-Phase wird eine Karte je nach ihrem *ease factor* und dem letzten Intervall wiederholt. Diese nächste Wiederholung wird wie folgt berechnet:

`new interval = current interval * ease factor * interval modifier`

### Neu-Lernphase

Wenn man bei einer absolvierten Karte auf „Nochmal“ klickt, wird die Karte zum Neu-Lernen markiert. Die Karte wird dann nach 10 min erneut angezeigt. Wenn der Benutzer dann mit „Gut“ antwortet, wird sie wieder mit 70 % des alten Intervalls als absolviert markiert.

## Anwortmöglichkeiten

### Lernphase

- Gut
  - Die Stufe der Karte wird um eins erhöht und dann das nächste Intervall berechnet.
- Nochmal
  - Die Karte wird in noch einmal in 5 min wiederholt.
- Zu leicht
  - Die Stufe der Karte wird um zwei erhöht und dann wie bei „Gut“ das nächste Intervall berechnet.

### Absolviert-Phase

- Gut
  - Eine neue Wiederholung wird berechnet; es ändert sich nichts am *ease factor*.
- Schwer
  - Vom *ease factor* werden 15 % abgezogen und dann wird eine neue Wiederholung mit einer speziellen Formel berechnet.
- Zu leicht
  - Es werden 15 % zum *ease factor* addiert und dann wird eine neue Wiederholung berechnet.
- Nochmal
  - Die Karte wird zum Neu-Lernen markiert und es werden 20 % vom *ease factor* subtrahiert. Die Karte wird dann in der nächsten Zeit öfter angezeigt.

Der Benutzer sollte am häufigsten die Schaltfläche „Gut“ wählen. Die „Zu leicht“ Option ist dafür gedacht, dass wenn der *ease factor* beispielsweise durch zu häufiges „Schwer“ zu gering ist, erneut anzuheben.

Formel nach „Schwer“:

`new interval = current interval * 1.2 * interval modifier`

---

<span id="1">¹</span> https://www.supermemo.com/en/archives1990-2015/english/ol/sm2 <br />
<span id="2">²</span> https://github.com/ankitects/anki
