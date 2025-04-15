# Bolt SuperNounou - API Server

Ce projet est le serveur API pour l'application Bolt SuperNounou, une plateforme de mise en relation entre parents et nounous.

## Prérequis

- Node.js (v18 ou supérieur)
- PostgreSQL (v14 ou supérieur)
- npm ou yarn

## Installation

1. Cloner le dépôt :
```bash
git clone https://github.com/votre-username/bolt-supernounou.git
cd bolt-supernounou/server
```

2. Installer les dépendances :
```bash
npm install
# ou
yarn install
```

3. Configurer la base de données :
- Créer une base de données PostgreSQL nommée `bolt_supernounou`
- Copier le fichier `.env.example` en `.env` et configurer les variables d'environnement

4. Exécuter les migrations :
```bash
npm run migrate
# ou
yarn migrate
```

## Développement

Pour lancer le serveur en mode développement :
```bash
npm run dev
# ou
yarn dev
```

Le serveur sera accessible à l'adresse : http://localhost:3001

## Scripts disponibles

- `npm run dev` : Lance le serveur en mode développement avec hot-reload
- `npm run build` : Compile le code TypeScript
- `npm run start` : Lance le serveur en production
- `npm run migrate` : Exécute les migrations de la base de données
- `npm run seed` : Remplit la base de données avec des données de test
- `npm run test` : Exécute les tests
- `npm run lint` : Vérifie le code avec ESLint

## Structure du projet

```
server/
├── src/
│   ├── config/         # Configuration de l'application
│   ├── controllers/    # Contrôleurs pour les routes
│   ├── middleware/     # Middleware Express
│   ├── models/         # Modèles de données
│   ├── routes/         # Définition des routes
│   ├── services/       # Logique métier
│   ├── types/          # Types TypeScript
│   ├── utils/          # Utilitaires
│   ├── app.ts          # Configuration Express
│   └── server.ts       # Point d'entrée
├── prisma/             # Schéma Prisma et migrations
├── tests/              # Tests
├── .env                # Variables d'environnement
├── .gitignore          # Fichiers ignorés par Git
├── package.json        # Dépendances et scripts
├── tsconfig.json       # Configuration TypeScript
└── README.md           # Documentation
```

## Tests

Pour exécuter les tests :
```bash
npm run test
# ou
yarn test
```

## Contribution

1. Fork le projet
2. Créer une branche pour votre fonctionnalité (`git checkout -b feature/AmazingFeature`)
3. Commit vos changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails. 