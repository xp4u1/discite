# Android

## Android Support und AndroidX

Nach der Installation kann es sein, dass das Projekt nicht kompiliert werden kann, da Pakete `android.support.*` verwenden. Mit dem Programm `jetifier` lassen sich diese Probleme schnell beheben:

```
# Probleme in Abhängigkeiten beheben
$ yarn jetifier

# Dateien synchronisieren
$ ionic cap sync
```

### Beispiel

Beispiel für eine Umwandlung von Jetifier:

```java
public class FileProvider extends android.support.v4.content.FileProvider {
  ...
}
```

wird zu

```java
public class FileProvider extends androidx.core.content.FileProvider {
  ...
}
```
