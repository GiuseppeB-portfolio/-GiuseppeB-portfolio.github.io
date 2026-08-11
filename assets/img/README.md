# Come sostituire i placeholder grafici dei progetti

Le card dei progetti in `index.html` (sezione `#progetti`) usano al momento
delle grafiche SVG disegnate a mano dentro `.project-visual`, come segnaposto
in attesa degli screenshot reali.

Per sostituirle:

1. Salva lo screenshot qui dentro, ad esempio:
   - `assets/img/powerbi-analisi-finanziaria.png`
   - `assets/img/ai-debug-assistant.png`

2. In `index.html`, dentro il rispettivo `<div class="project-visual">`,
   sostituisci il blocco `<svg>...</svg>` con:

   ```html
   <img src="assets/img/powerbi-analisi-finanziaria.png"
        alt="Screenshot della dashboard Power BI di analisi finanziaria e revenue"
        loading="lazy">
   ```

3. Nessuna modifica necessaria in `style.css`: `.project-visual img` erediterà
   già le stesse proporzioni del contenitore (basta eventualmente aggiungere
   `object-fit: cover; width: 100%; height: 100%;` se lo screenshot non ha le
   stesse proporzioni del placeholder).
