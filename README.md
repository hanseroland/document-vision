# Doc Vision — Application d'archivage documentaire intelligent

## Vision générale

Une plateforme qui centralise photos et documents administratifs (particuliers) ou professionnels (entreprises) dans un espace unique, avec une recherche unique en langage naturel comme point d'entrée — sans classement manuel, sans distinction technique visible entre "chercher une photo" et "chercher un document".

## Fonctionnalités principales

### 1. Import de fichiers
- Dépôt de photos, PDF et scans, en masse ou individuellement
- Traitement automatique en arrière-plan dès l'upload (statut visible : "en cours d'analyse" → "indexé")
- Aucune saisie manuelle de tag ou de catégorie requise

### 2. Analyse automatique par IA (Gemini)
- **Photos** : génération d'une description sémantique du contenu visuel + vecteur d'embedding
- **Documents structurés** (actes, factures, contrats, diplômes...) : détection du type de document + extraction des champs clés (nom, date, montant, numéro...)

### 3. Recherche en langage naturel (le cœur du produit)
- Une seule barre de recherche pour tout type de contenu
- Requête descriptive ("photos de la plage") → recherche par similarité sémantique
- Requête typée ("actes de naissance") → recherche filtrée sur le type/les champs extraits
- Requête mixte ("factures de restaurant en 2024") → combinaison des deux
- Le système déduit lui-même la stratégie de recherche à appliquer

### 4. Espaces de travail multi-tenant (workspaces)
- Chaque particulier a un espace personnel privé
- Chaque entreprise a un espace collectif avec plusieurs membres
- Rôles par membre (owner / admin / membre) déterminant les droits (upload, suppression, invitation)
- Isolation stricte des données par `workspace_id` — aucune fuite possible entre espaces

### 5. Gestion des membres (côté entreprise)
- Invitation de collaborateurs dans un workspace
- Attribution de rôles
- (Évolution possible : restriction d'accès à certains documents selon le rôle)

### 6. Stockage hybride des fichiers
- Traitement temporaire en local (le temps de l'analyse IA)
- Stockage définitif sur Cloudinary (CDN, transformations d'images, URLs stables)
- Seule l'URL Cloudinary est conservée en base, pas le fichier lui-même

## Fonctionnement technique, bout en bout

```
Upload fichier
   ↓
Stockage temporaire local
   ↓
LangGraph — Graphe d'ingestion :
   ├─ Nœud "Classification type" (image vs document structuré)
   ├─ Photo → Gemini Vision → description + embedding
   └─ Document → Gemini extraction structurée → champs + embedding
   ↓
Upload définitif vers Cloudinary + suppression du fichier local
   ↓
Stockage en base (PostgreSQL + pgvector) :
   - Métadonnées structurées (colonnes classiques)
   - Vecteur sémantique (pgvector)
   - workspace_id (isolation)
   ↓
Recherche utilisateur
   ↓
LangGraph — Graphe de recherche :
   ├─ Nœud "router" (analyse l'intention de la requête)
   ├─ Requête descriptive → recherche vectorielle (pgvector)
   ├─ Requête typée → filtre SQL structuré
   └─ Requête mixte → combinaison hybride
   ↓
Résultats classés par pertinence, scopés au workspace
```

## Ce que le projet démontre (positionnement portfolio)

- Traitement multimodal réel (image + document), pas un simple wrapper autour d'une API IA
- Orchestration d'un pipeline IA multi-étapes avec état, via LangGraph
- Architecture multi-tenant pensée dès la conception (pas ajoutée après coup)
- Recherche hybride sémantique + structurée en base de données (pgvector)
- Backend en Clean Architecture : domaine indépendant du choix de provider IA (Gemini) ou de stockage (Cloudinary)

Tu veux qu'on formalise ça en README de portfolio, ou qu'on passe à la conception du premier nœud LangGraph du pipeline d'ingestion ?

## Technos
* NodeJs, PostgreSQL, TypeScript, Express, Langgraph, Gemini Vision