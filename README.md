# S08 - oKanban - Monorepo

## Mise en place

Objectif : 
- Faire en sorte que notre backend renvoie sur la home page (route `/`) le HTML/CSS/JS de notre application front.
  - Idée : mettre les fichiers `dist` dans un dossier public !

Plan d'attaque :
- on ramène le code `/assets` dans le dossier back 
- on ramène les scripts et les dependences du front dans le dossier back (monorepo)
- On build notre front --> créé un dossier `/dist`
- On sert statiquement ce dossier `/dist` avec : 
  - `express.static("dist")` 🎉

## Deploiement

- Se connecter au serveur de production

- Installer la BDD Postgres

- Cloner le dépot
  - Installer les dependences
  - Créer le fichier .env et le modifier avec les bonnes valeurs
  - Build le front
  - Lancer le back (qui sert le front)

==> Pour jeudi ! 

