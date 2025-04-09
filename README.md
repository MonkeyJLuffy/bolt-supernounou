# Bolt Supernounou

Bolt Supernounou est une plateforme de mise en relation entre parents et nounous, offrant une solution complète pour la garde d'enfants.

## 🚀 Fonctionnalités

- **Inscription et Authentification**
  - Inscription pour les parents et les nounous
  - Connexion sécurisée avec gestion des rôles
  - Profils personnalisés avec photos

- **Gestion des Profils**
  - Création et édition des profils parents
  - Création et édition des profils nounous
  - Gestion des informations des enfants

- **Recherche et Mise en Relation**
  - Recherche avancée de nounous
  - Filtres par critères (disponibilité, expérience, etc.)
  - Système de messagerie intégré

- **Administration**
  - Tableau de bord administrateur
  - Gestion des utilisateurs
  - Modération des profils

## 🛠️ Technologies Utilisées

### Frontend
- React avec TypeScript
- Zustand pour la gestion d'état
- Tailwind CSS pour le styling
- React Router pour la navigation
- Axios pour les requêtes API

### Backend
- Node.js avec Express
- PostgreSQL pour la base de données
- JWT pour l'authentification
- Bcrypt pour le hachage des mots de passe

## 📦 Installation

1. **Cloner le projet**
```bash
git clone https://github.com/votre-username/bolt-supernounou.git
cd bolt-supernounou
```

2. **Installer les dépendances**
```bash
# Installer les dépendances du frontend
cd client
npm install

# Installer les dépendances du backend
cd ../server
npm install
```

3. **Configurer la base de données**
- Créer une base de données PostgreSQL
- Configurer les variables d'environnement dans `.env`
- Exécuter les scripts de migration

4. **Démarrer les serveurs**
```bash
# Démarrer le serveur backend
cd server
npm run dev

# Démarrer le serveur frontend
cd ../client
npm run dev
```

## 🔧 Configuration

### Variables d'environnement

Créer un fichier `.env` dans le dossier `server` avec les variables suivantes :

```env
PORT=3000
DATABASE_URL=postgresql://user:password@localhost:5432/bolt_supernounou
JWT_SECRET=votre_secret_jwt
```

## 📝 Structure du Projet

```
bolt-supernounou/
├── client/                 # Frontend React
│   ├── src/
│   │   ├── components/     # Composants React
│   │   ├── store/         # Gestion d'état
│   │   ├── types/         # Types TypeScript
│   │   └── ...
│   └── ...
├── server/                 # Backend Node.js
│   ├── src/
│   │   ├── routes/        # Routes API
│   │   ├── services/      # Services métier
│   │   ├── middleware/    # Middleware Express
│   │   └── ...
│   └── ...
└── ...
```

## 🔒 Sécurité

- Authentification JWT
- Hachage des mots de passe avec bcrypt
- Protection CSRF
- Validation des entrées
- Gestion des rôles et permissions

## 🤝 Contribution

1. Fork le projet
2. Créer une branche pour votre fonctionnalité (`git checkout -b feature/AmazingFeature`)
3. Commit vos changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 📞 Contact

Pour toute question ou suggestion, n'hésitez pas à nous contacter à contact@bolt-supernounou.com
