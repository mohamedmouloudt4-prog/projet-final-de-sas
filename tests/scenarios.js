// Tests simples, sans bibliothèque externe.
// Lancer avec : node tests/scenarios.js

const creerDonneesDeDepart = require("../src/data").creerDonneesDeDepart;
const p = require("../src/progression");

let testsReussis = 0;
let testsEchoues = 0;

function verifier(condition, description) {
  if (condition) {
    console.log("  [OK]    " + description);
    testsReussis = testsReussis + 1;
  } else {
    console.log("  [ECHEC] " + description);
    testsEchoues = testsEchoues + 1;
  }
}

// ---------- Scénario 1 : ajouter un profil valide ----------
console.log("\nScénario 1 : ajouter un profil valide");
{
  const apprenants = creerDonneesDeDepart();
  const reponse = p.ajouterApprenant(apprenants, 10, "   aMINE    teST  ", "  nador ");
  const trouve = p.rechercherParId(apprenants, 10);

  verifier(reponse.indexOf("Erreur") === -1, "l'ajout est accepté");
  verifier(apprenants.length === 6, "la liste contient maintenant 6 apprenants");
  verifier(trouve !== null, "le profil est retrouvé par son identifiant");
  verifier(trouve !== null && trouve.nomComplet === "Amine Test", "le nom est nettoyé : \"Amine Test\"");
  verifier(trouve !== null && trouve.ville === "Nador", "la ville est nettoyée : \"Nador\"");
}

// ---------- Scénario 2 : mettre à jour une journée ----------
console.log("\nScénario 2 : mettre à jour une journée existante");
{
  const apprenants = creerDonneesDeDepart();
  const reponse = p.enregistrerResultat(apprenants, 1, {
    jour: 2, exercicesTermines: 20, totalExercices: 20, challengeTermine: true
  });
  const sara = p.rechercherParId(apprenants, 1);

  verifier(reponse.indexOf("Erreur") === -1, "la mise à jour est acceptée");
  verifier(sara.resultats.length === 2, "la journée 2 n'est pas dupliquée (toujours 2 résultats)");
  verifier(sara.resultats[1].exercicesTermines === 20, "l'ancien résultat du jour 2 est remplacé");

  const profil = p.calculerProgression(sara);
  verifier(profil.pourcentage === 95, "la progression est recalculée : 38/40 = 95 %");
}

// ---------- Scénario 3 : calculer et rechercher ----------
console.log("\nScénario 3 : calculer la progression de Sara et la rechercher");
{
  const apprenants = creerDonneesDeDepart();
  const sara = p.rechercherParId(apprenants, 1);
  const profil = p.calculerProgression(sara);

  verifier(profil.exercicesTermines === 32, "32 exercices terminés");
  verifier(profil.exercicesProposes === 40, "40 exercices proposés");
  verifier(profil.pourcentage === 80, "progression de 80 %");
  verifier(profil.challengesTermines === 1, "1 challenge terminé");
  verifier(profil.journeesRenseignees === 2, "2 journées renseignées");
  verifier(profil.niveau === p.NIVEAU_SOLIDE, "niveau : Solide");
  verifier(profil.challengesNonTermines.join(",") === "2", "challenge non terminé : jour 2");
  verifier(profil.joursNonRenseignes.join(",") === "3,4,5,6,7", "journées non renseignées : 3 à 7");

  const trouves = p.rechercherParNom(apprenants, "  sAR ");
  verifier(trouves.length === 1 && trouves[0].id === 1, "la recherche \"  sAR \" retrouve Sara");
  verifier(p.rechercherParNom(apprenants, "zzz").length === 0, "une recherche sans résultat renvoie une liste vide");
}

// ---------- Scénario 4 : identifiant déjà utilisé (cas invalide) ----------
console.log("\nScénario 4 : identifiant déjà utilisé");
{
  const apprenants = creerDonneesDeDepart();
  const reponse = p.ajouterApprenant(apprenants, 1, "Autre Personne", "Oujda");

  verifier(reponse.indexOf("Erreur") !== -1, "l'ajout est refusé");
  verifier(reponse.indexOf("déjà utilisé") !== -1, "le message explique le problème : " + reponse);
  verifier(apprenants.length === 5, "la liste n'a pas changé");
}

// ---------- Scénario 5 : résultat incohérent (cas invalide) ----------
console.log("\nScénario 5 : résultats incohérents refusés");
{
  const apprenants = creerDonneesDeDepart();

  const jour8 = p.enregistrerResultat(apprenants, 1, {
    jour: 8, exercicesTermines: 10, totalExercices: 20, challengeTermine: true
  });
  verifier(jour8.indexOf("Erreur") !== -1, "un jour 8 est refusé : " + jour8);

  const jour0 = p.enregistrerResultat(apprenants, 1, {
    jour: 0, exercicesTermines: 10, totalExercices: 20, challengeTermine: true
  });
  verifier(jour0.indexOf("Erreur") !== -1, "un jour 0 est refusé");

  const tropExercices = p.enregistrerResultat(apprenants, 1, {
    jour: 3, exercicesTermines: 25, totalExercices: 20, challengeTermine: true
  });
  verifier(tropExercices.indexOf("Erreur") !== -1, "25 terminés sur 20 est refusé : " + tropExercices);

  const negatif = p.enregistrerResultat(apprenants, 1, {
    jour: 3, exercicesTermines: -2, totalExercices: 20, challengeTermine: true
  });
  verifier(negatif.indexOf("Erreur") !== -1, "un nombre négatif est refusé");

  const inconnu = p.enregistrerResultat(apprenants, 99, {
    jour: 3, exercicesTermines: 10, totalExercices: 20, challengeTermine: true
  });
  verifier(inconnu.indexOf("Erreur") !== -1, "un identifiant inconnu est refusé");

  const sara = p.rechercherParId(apprenants, 1);
  verifier(sara.resultats.length === 2, "aucun résultat incorrect n'a été enregistré");
}

// ---------- Scénario 6 : cas limites (seuils et division par zéro) ----------
console.log("\nScénario 6 : cas limites");
{
  const apprenants = creerDonneesDeDepart();
  const nora = p.calculerProgression(p.rechercherParId(apprenants, 5));

  verifier(nora.pourcentage === null, "aucune journée : pas de division par zéro (pourcentage null)");
  verifier(nora.niveau === p.NIVEAU_NON_EVALUE, "aucune journée : niveau \"Non évalué\"");

  verifier(p.determinerNiveau(80) === p.NIVEAU_SOLIDE, "80 % -> Solide");
  verifier(p.determinerNiveau(79.9) === p.NIVEAU_PROGRESSION, "79.9 % -> En progression");
  verifier(p.determinerNiveau(50) === p.NIVEAU_PROGRESSION, "50 % -> En progression");
  verifier(p.determinerNiveau(49.9) === p.NIVEAU_RENFORCER, "49.9 % -> À renforcer");
  verifier(p.arrondirUneDecimale(79.96) === 80, "79.96 est arrondi à 80 (donc Solide)");
  verifier(p.arrondirUneDecimale(79.94) === 79.9, "79.94 est arrondi à 79.9 (donc En progression)");
}

// ---------- Scénario 7 : tri, filtre et statistiques du groupe ----------
console.log("\nScénario 7 : tri, filtre et statistiques");
{
  const apprenants = creerDonneesDeDepart();

  const tries = p.trierParProgression(apprenants);
  let ordreIds = "";
  let iOrdre = 0;
  while (iOrdre < tries.length) {
    if (iOrdre > 0) {
      ordreIds = ordreIds + ",";
    }
    ordreIds = ordreIds + tries[iOrdre].id;
    iOrdre = iOrdre + 1;
  }
  verifier(ordreIds === "4,1,2,3,5", "tri décroissant : Karim, Sara, Yassine, Imane, Nora (non évaluée à la fin)");
  verifier(apprenants[0].id === 1, "le tri ne modifie pas le tableau d'origine");

  const alpha = p.trierParNom(apprenants);
  verifier(alpha[0].nomComplet === "Imane Script", "tri alphabétique : Imane Script en premier");

  const solides = p.filtrerParNiveau(apprenants, p.NIVEAU_SOLIDE);
  verifier(solides.length === 2, "2 profils Solide");

  const stats = p.calculerStatistiquesGroupe(apprenants);
  verifier(stats.totalApprenants === 5, "5 apprenants au total");
  verifier(stats.moyenne === 67.7, "moyenne du groupe : (80 + 60 + 38.3 + 92.5) / 4 = 67.7 %");
}

// ---------- Bilan ----------
console.log("\n----------------------------------------");
console.log("Tests réussis : " + testsReussis);
console.log("Tests échoués : " + testsEchoues);

if (testsEchoues > 0) {
  process.exitCode = 1;
}
