# application-gestion-locative

Application web de gestion locative développée dans le cadre d’un Titre Professionnel Développeur Web et Web Mobile. Elle permet à un propriétaire de centraliser la gestion ses biens, ses locataires et de générer des baux via une architecture sécurisée multi-utilisateur.

---

## Table des matières

- [Vision](#vision)
- [Fonctionnalités](#fonctionnalités)
- [Stack technique](#stack-technique)
- [Roadmap](#roadmap)
- [Contexte](#contexte)
- [Licence](#licence)

---

## Vision

Ce projet est né d’un besoin concret : celui d’amis gérant plusieurs biens immobiliers au sein de leur propre société de rénovation et de mise en location.

La gestion locative y était organisée de manière dispersée, avec des informations et des documents répartis entre différents supports. Cette fragmentation rendait le pilotage quotidien complexe et parfois chronophage .

Bien que des solutions existent déjà sur le marché, disposer de leur propre outil, adapté à leur fonctionnement et à leur organisation, représente un véritable confort ainsi qu’une meilleure maîtrise de leur activité.

Cet outil a donc pour ambition de centraliser et simplifier la gestion administrative de biens locatifs au sein d’une interface claire, structurée et sécurisée.

Ce projet constitue également pour moi une double opportunité :
- accompagner concrètement leur activité,
- développer une application full-stack complète dans le cadre de la validation de mon Titre Professionnel Développeur Web et Web Mobile.
---

## Fonctionnalités

### MVP (V1)

- Authentification sécurisée (inscription / connexion)
- Gestion des biens immobiliers 
- Gestion des locataires par bien 
- Suivi des informations administratives :
  - Dates d’entrée et de sortie
  - Montant de caution
  - Statut (actif / sorti)
  - Notes internes
- Générateur de bail par template (avec pré-remplissage automatique)
- Isolation des données par utilisateur (architecture multi-tenant)

---

### Hors scope V1 (V2 vision futur pour le projet)

- Espace locataire sécurisé
- Dépôt de justificatifs
- Paiement en ligne
- Messagerie propriétaire / locataire
- Système de notifications (fin de bail, retard, révision)
- Historique complet de la vie du bien

---

## Stack technique

### Frontend & Backend

- **Next.js** (App Router) – Framework full-stack React
- **TypeScript** – Typage statique
- **TailwindCSS** – Styling

### Backend & Base de données

- **PostgreSQL** – Base de données relationnelle
- **Prisma ORM** – Gestion des modèles et requêtes
- **NextAuth / Better Auth** – Authentification 

### Outils

- Git & GitHub – Versioning
- GitHub Projects – Kanban & gestion des tickets
- (Déploiement : en reflexion)

---

## Roadmap

### Phase 1 – MVP

- [x] Cadrage du projet 
- [x] Choix stack technique  
- [ ] Setup technique du projet 
- [ ] Authentification  
- [ ] CRUD Biens  
- [ ] CRUD Locataires  
- [ ] Génération de bail
- [ ] Sécurité et validation
- [ ] UI
- [ ] Déploiement  

### Phase 2 – Évolution produit

- Espace locataire  
- Notifications automatiques  
- Historique du bien  
- Export et archivage des documents  
- Paiement en ligne  
- Modèle SaaS ?  

---

## Contexte

Projet développé dans le cadre d’un **Titre Professionnel Développeur Web et Web Mobile (Niveau 5 – Bac+2)**.

### Objectifs pédagogiques :

- Concevoir une application full-stack  
- Mettre en place une architecture scalable  
- Appliquer les bonnes pratiques (sécurité, isolation des données, clean code)  
- Gérer un projet de bout en bout (conception, développement, déploiement)  

Présentation prévue : Juin 2026

---

## Contribuer

Les contributions présentées ci-dessous concernent la seconde partie du projet (v2). Étant donné que ce projet est réalisé dans le cadre d'un diplôme, ces contributions ne seront pas prises en compte pour la première partie.

### Pour contribuer :

1. Fork le projet  
2. Créer une branche `feature/*`  
3. Ouvrir une Pull Request  
4. Décrire clairement les modifications proposées  

### Merci de :

- Respecter la structure existante  
- Maintenir la cohérence du code  
- Documenter toute nouvelle fonctionnalité  

---

## Licence

Licence : GPL-3.0 + licence commerciale