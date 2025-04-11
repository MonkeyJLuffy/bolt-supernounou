# Feuille de route de développement

## 1. Base de données ✅
- Suppression et recréation complète
- Nouvelle configuration avec les clés Supabase
- Structure des tables :
  - `profiles` : utilisateurs
  - `children` : enfants
  - `parent_children` : relations parents-enfants
  - `parent_couples` : couples de parents

## 2. Administrateur par défaut ✅
- Compte créé :
  - Email : admin@supernounou.fr
  - Mot de passe : SuperNounouPassword
- Dashboard administrateur :
  - [ ] Formulaire de création de gestionnaire (nom, prénom, email)
  - [ ] Formulaire de modification de ses propres identifiants

## 3. Gestionnaire 🚧
- Créé par l'administrateur
- Mot de passe par défaut à changer à la première connexion
- Dashboard avec bandeau d'onglets
- Onglet "Gestion des utilisateurs" :
  - [ ] Switch entre liste parents/nounous
  - [ ] Distinction visuelle entre comptes approuvés/non approuvés
  - [ ] Fiches détaillées accessibles en cliquant sur une ligne
  - [ ] Bouton d'approbation dans chaque fiche

## 4. Workflow complet
a. ✅ Connexion admin (identifiants par défaut)
b. 🚧 Modification identifiants admin
c. 🚧 Création gestionnaire
d. 🚧 Connexion gestionnaire (identifiants fournis)
e. 🚧 Modification identifiants gestionnaire
f. 🚧 Demande compte nounou
g. 🚧 Demande compte maman (2 enfants)
h. 🚧 Demande compte papa (avec parent 2 et 1 enfant)
i. 🚧 Approbation nounou par gestionnaire
j. 🚧 Approbation des 3 parents par gestionnaire

## Légende
- ✅ : Terminé
- 🚧 : En cours
- [ ] : À faire 