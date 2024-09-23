
# Programmierprojekt

## Performace

...

### Technologien

- Python
### Erste Schritte

1. Klonen Sie das Repository:
   ```
   git clone https://github.com/mst2k/programmierprojekt.git
   ```

2. Wechseln Sie in das performanceLocal Verzeichnis:
   ```
   brew install glpk highs //für MacOS
   apt-get install glpk highs // für windows
   //Für windows gibt es diverse infatllationsanleitungen
   
   cd programmierprojekt/performanceLocal
   
   pip install -r requirements.txt
   
   python ./benchmark_runner.py //Stelle die Api auf Port 8080 bereit
   ```
3. Jetzt sollten auf der Seite /benchmark/ auch die Werte für die Performance des Backends verfügbar sein! 

