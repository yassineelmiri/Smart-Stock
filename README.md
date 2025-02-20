﻿# Smart Stock

![image](https://github.com/user-attachments/assets/5459af5a-ed17-4249-9b6d-f5952bf4b49b)


**Smart Stock** est une application mobile qui permet aux magasiniers de gérer les stocks d'un magasin de manière efficace et moderne. Grâce à un scanner de code-barres intégré et une interface intuitive, cette application simplifie la gestion des produits, le suivi des quantités, et offre des fonctionnalités avancées pour optimiser le processus de gestion du stock.

## Fonctionnalités principales

### 1. Authentification
- Chaque utilisateur dispose d'un code secret personnel pour accéder à l'application.
  
### 2. Gestion des produits
- **Identification des produits** : 
  - Scanner de code-barres intégré pour une identification rapide avec `expo-barcode-scanner`.
  - Saisie manuelle du code-barres si le scanner est défectueux.
- **Produit existant** :
  - Ajouter ou retirer des quantités dans un entrepôt.
  - Afficher les informations du produit (nom, type, prix, quantité disponible, entrepôt).
- **Produit non existant** :
  - Formulaire de création avec les champs suivants :
    - Nom, type, prix, fournisseur, quantité initiale, entrepôt, image (facultatif).

### 3. Liste des produits
- Affichage détaillé des produits stockés : nom, type, prix, quantité disponible, état du stock.
- **Indicateurs visuels** :
  - Couleur rouge pour les produits en rupture de stock.
  - Couleur jaune pour les produits en faible quantité (<10 unités).
- **Actions disponibles** :
  - Bouton "Réapprovisionner" pour augmenter la quantité.
  - Bouton "Décharger" pour retirer des unités.

### 4. Fonctionnalités avancées
- **Filtrage et recherche** : Recherche par nom, type, prix ou fournisseur.
- **Tri dynamique** : 
  - Tri des produits par prix croissant/décroissant, nom alphabétique ou quantité.

### 5. Statistiques et résumé des stocks
- **Tableau de bord** affichant :
  - Nombre total de produits.
  - Nombre total de villes.
  - Produits en rupture de stock.
  - Valeur totale des stocks.
  - Produits les plus ajoutés/retirés récemment.

### 6. Sauvegarde et export des données
- Exporter un rapport des produits sous format **PDF** en utilisant `expo-print`.

---

## Configuration du Backend

1. **Installer `json-server` globalement** :
   ```bash
   npm i -g json-server
   ```

2. **Démarrer le serveur avec la commande suivante** :
   ```bash
   npx json-server db.json
   ```

3. **L'application sera accessible à l'adresse suivante** :
   - [http://localhost:3000](http://localhost:3000)

---

## Installation et démarrage du projet

1. Clonez ce dépôt :
   ```bash
   git clone https://github.com/yassineelmiri/Smart-Stock.git
   ```

2. Allez dans le répertoire du projet :
   ```bash
   cd Smart-Stock
   ```

3. Installez les dépendances :
   ```bash
   npm install
   ```

4. Démarrez le projet avec Expo :
   ```bash
   expo start
   ```

---

## Technologies utilisées

- **React Native** pour le développement de l'application mobile.
- **Expo** pour faciliter le développement et l'exécution de l'application.
- **json-server** pour simuler un backend avec un fichier `db.json`.
- **expo-barcode-scanner** pour la fonctionnalité de scanner de code-barres.
- **expo-print** pour l'export des rapports en PDF.

---

## maqette de mon application

![Bleu et Orange École  Université Promotion Spécifique à l'offre Éducation E-mail Bulletin d'information Image](https://github.com/user-attachments/assets/979c7bcf-dbc1-4f32-9d88-83b16f53dad5)

