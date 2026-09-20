# SAS Progress Console

Projet final de synthèse du SAS JavaScript (YouCode).
Application console en Node.js, sans framework ni dépendance externe.
Les données restent en mémoire.

## Le besoin

Un formateur veut suivre la progression d'apprenants (fictifs) sur les 7 journées du SAS :
exercices terminés, challenges réalisés, journées non renseignées.
L'application calcule des indicateurs et affiche un tableau de bord pour repérer
ce qui est acquis et ce qui reste à travailler.

> **Important :** le programme ne décide jamais si une personne est admise.
> Les niveaux affichés (Solide, En progression, À renforcer) décrivent uniquement les données enregistrées.

## Lancer le projet

Depuis le dossier qui contient `projet-final` :

```bash
node projet-final/src/index.js      # lancer l'application
node projet-final/tests/scenarios.js  # lancer les tests
```

## Structure du projet

```
projet-final/
|-- README.md
|-- src/
|   |-- data.js          données de départ (personnes fictives)
|   |-- progression.js   fonctions : validation, calculs, recherche, tri, affichage
|   `-- index.js         menu console (lecture des saisies)
`-- tests/
    `-- scenarios.js     scénarios de test
```

## Structure des données

```js
{
  id: 1,                    // entier > 0, unique
  nomComplet: "Sara Dev",   // nettoyé : espaces inutiles supprimés, majuscule à chaque mot
  ville: "Nador",
  resultats: [
    { jour: 1, exercicesTermines: 18, totalExercices: 20, challengeTermine: true }
  ]
}
```

Règles de validation d'un résultat :
- `jour` : entier entre 1 et 7 ;
- `totalExercices` : entier supérieur à 0 ;
- `exercicesTermines` : entier positif ou nul, jamais supérieur à `totalExercices` ;
- `challengeTermine` : `true` ou `false` (saisi « oui » / « non » dans le menu).

Toute donnée invalide est refusée avec un message qui explique le problème, et rien n'est enregistré.

## Fonctionnalités

| Menu | Fonctionnalité | Fonction principale |
|---|---|---|
| 1 | Tableau de bord du groupe | `afficherTableauDeBord` |
| 2 | Liste des apprenants | `calculerTousLesProfils` |
| 3 | Ajouter un apprenant (refus des identifiants en double) | `ajouterApprenant` |
| 4 | Consulter un apprenant par identifiant | `rechercherParId` |
| 5 | Ajouter ou modifier une journée (pas de doublon de jour) | `enregistrerResultat` |
| 6 | Rechercher par tout ou partie du nom, sans tenir compte des majuscules | `rechercherParNom` |
| 7 | Filtrer par niveau | `filtrerParNiveau` |
| 8 | Trier par progression décroissante | `trierParProgression` |
| 9 | Trier par ordre alphabétique | `trierParNom` |
| 0 | Quitter | |

Autres fonctions : `normaliserNom`, `validerResultat`, `calculerProgression`,
`determinerNiveau`, `calculerStatistiquesGroupe`, `rechercherApprenant` (par id ou par nom).

## Conventions de calcul

**Progression individuelle** = (total des exercices terminés / total des exercices proposés) × 100,
calculée uniquement sur les journées renseignées.
Exemple : Sara Dev → (18 + 14) / (20 + 20) = 32 / 40 = 80 %.

**Arrondi** : le pourcentage est arrondi à 1 décimale (`Math.round(x * 10) / 10`).
Le niveau est calculé sur ce pourcentage arrondi, c'est-à-dire celui qui est affiché.
Ainsi l'affichage et le niveau sont toujours cohérents :
- 79,96 % devient 80 % → Solide ;
- 79,94 % devient 79,9 % → En progression.

**Niveaux** :
- Solide : à partir de 80 % ;
- En progression : de 50 % inclus à moins de 80 % ;
- À renforcer : moins de 50 %.

**Données absentes** :
- une journée sans résultat est une *journée non renseignée* : elle n'entre pas dans le calcul ;
- une journée renseignée avec `challengeTermine: false` est un *challenge non terminé* ;
- le tableau de bord affiche ces deux listes séparément pour chaque apprenant ;
- un apprenant sans aucune journée a un total proposé égal à 0 : on ne divise pas par zéro,
  son pourcentage vaut `null` (affiché `--`) et son niveau est « Non évalué ».

**Moyenne du groupe** = moyenne simple des pourcentages individuels (arrondis)
des apprenants ayant au moins une journée renseignée. Les « Non évalué » ne sont pas comptés,
sinon ils feraient baisser la moyenne alors qu'on n'a aucune donnée sur eux.
Exemple avec les données de départ : (92,5 + 80 + 60 + 38,3) / 4 = 67,7 %.

**Tri par progression** : du plus élevé au plus faible, les « Non évalué » à la fin,
ordre alphabétique en cas d'égalité. Les tris ne modifient pas le tableau d'origine.

## Scénarios testés

`node projet-final/tests/scenarios.js` exécute 7 scénarios (42 vérifications) :

1. **Ajouter un profil valide** : le profil est ajouté, retrouvé par identifiant, nom et ville nettoyés.
2. **Mettre à jour une journée** : le jour 2 de Sara est remplacé, sans doublon, et la progression est recalculée.
3. **Calculer et rechercher** : Sara affiche 32/40, 80 %, Solide ; la recherche `"  sAR "` la retrouve.
4. **Identifiant déjà utilisé** *(cas invalide)* : l'ajout est refusé avec un message clair.
5. **Résultat incohérent** *(cas invalide)* : jour 8, jour 0, 25/20, nombre négatif, identifiant inconnu → refusés, rien n'est enregistré.
6. **Cas limites** : apprenant sans journée (pas de division par zéro), frontières 80 / 79,9 / 50 / 49,9, arrondi.
7. **Tri, filtre, statistiques** : ordre du classement, tri alphabétique, filtre Solide, moyenne du groupe.

## Données

Toutes les personnes sont fictives. Les données sont en mémoire : elles repartent
des données de départ à chaque lancement du programme.
