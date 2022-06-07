![example workflow](https://github.com/matteo-gatti/IS2-MSGC-Parket/actions/workflows/node.js.yml/badge.svg)

<p align="center">
  <h2 align="center">eClub</h2>

  <p align="center">
    Progetto d'esame del corso di Ingegneria del Software
  <br>University of Trento - Prof. <a href="https://webapps.unitn.it/du/it/Persona/PER0228723/Curriculum">Sandro Luigi Fiore</a>
  </p>
</p>
<br>

## Table of contents
- [Descrizione](#descrizione)
- [Usage](#usage)
- [Link Utili](#link)
- [Contributors](#contributors)


### Descrizione
L’obiettivo generale di eClub quello di semplificare tutto ciò che riguarda l'organizzazione e la gestione di un’associazione sportiva di media grandezza.
In particolare eClub si prefigge di:
* digitalizzare tutte le attività di amministrazione (dall’iscrizione di nuovi associati alla
verifica delle scadenze delle visite mediche);
* sostenere le società sportive come luogo di aggregazione rendendone più snella e
sicura la gestione;
* dare alle società sportive una nuova possibilità di innovarsi in campo digitale.

eClub permette ad ogni associazione di configurare e visualizzare tutte le informazioni
relative alle proprie squadre composte ciascuna da Team Manager, Coach e Atleti.

### Link
- [Apiary](https://eclub.docs.apiary.io/#)
- [Heroku](https://is-eclub.herokuapp.com)
- [UI Frontend](https://is-eclub.vercel.app/)

### Usage
`UI Frontend` https://is-eclub.vercel.app/

Per eseguire il codice in locale, è sufficiente clonare la repository e, nella directory principale, eseguire i seguenti comandi:

```
cd client
npm install
npm start
```

Questo eseguirà l'applicazione all'indirizzo http://localhost:3000, dove si verrà reindirizzati alla parte di frontend. Attualmente, questa comunica con il server Heroku https://is-eclub.herokuapp.com per recuperare le informazioni dalle API. Questo significa che perché funzioni correttamente offline è necessario modificare il link alle API. 

### Contributors
* [Collizzolli Leonardo](https://github.com/leocolliz)
* [Dalla Palma Mathias](https://github.com/mathiasdallapalma)
* [Lechthaler Pietro](https://github.com/pietrolechthaler)