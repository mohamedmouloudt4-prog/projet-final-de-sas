// الدوال ديال المشروع


const JOUR_MIN = 1;
const JOUR_MAX = 7;

const NIVEAU_SOLIDE = "Solide";
const NIVEAU_PROGRESSION = "En progression";
const NIVEAU_RENFORCER = "À renforcer";
const NIVEAU_NON_EVALUE = "Non évalué";

function estEntier(n) {
  if (typeof n !== "number") {
    return false;
  }
  if (isNaN(n)) {
    return false;
  }
  if (n !== Math.floor(n)) {
    return false;
  }
  return true;
}

function arrondirUneDecimale(nombre) {
  return Math.round(nombre * 10) / 10;
}

// "  sArA    dEV " -> "Sara Dev"
function normaliserNom(texte) {
  if (typeof texte !== "string") {
    return "";
  }

  const mots = texte.trim().split(" ");
  let resultat = "";

  for (let i = 0; i < mots.length; i++) {
    if (mots[i] !== "") {
      const mot = mots[i][0].toUpperCase() + mots[i].slice(1).toLowerCase();
      if (resultat === "") {
        resultat = mot;
      } else {
        resultat = resultat + " " + mot;
      }
    }
  }

  return resultat;
}

function validerIdentifiant(id) {
  if (estEntier(id) === false || id <= 0) {
    return "L'identifiant doit être un nombre entier supérieur à 0.";
  }
  return null;
}

function validerResultat(resultat) {
  if (resultat === null || typeof resultat !== "object") {
    return "Le résultat est manquant.";
  }

  if (estEntier(resultat.jour) === false || resultat.jour < JOUR_MIN || resultat.jour > JOUR_MAX) {
    return "Le jour doit être un nombre entier compris entre " + JOUR_MIN + " et " + JOUR_MAX + ".";
  }

  if (estEntier(resultat.totalExercices) === false || resultat.totalExercices <= 0) {
    return "Le total d'exercices proposés doit être un nombre entier supérieur à 0.";
  }

  if (estEntier(resultat.exercicesTermines) === false || resultat.exercicesTermines < 0) {
    return "Le nombre d'exercices terminés doit être un nombre entier positif ou nul.";
  }

  // 25 على 20 ماشي منطقي
  if (resultat.exercicesTermines > resultat.totalExercices) {
    return "Incohérent : " + resultat.exercicesTermines + " exercices terminés alors que seulement "
      + resultat.totalExercices + " sont proposés.";
  }

  if (resultat.challengeTermine !== true && resultat.challengeTermine !== false) {
    return "Le challenge doit être indiqué par oui ou non.";
  }

  return null;
}

function ajouterApprenant(apprenants, id, nomComplet, ville) {
  const erreurId = validerIdentifiant(id);
  if (erreurId !== null) {
    return "Erreur : " + erreurId;
  }

  const existant = rechercherParId(apprenants, id);
  if (existant !== null) {
    return "Erreur : L'identifiant " + id + " est déjà utilisé par " + existant.nomComplet + ".";
  }

  const nomPropre = normaliserNom(nomComplet);
  if (nomPropre === "") {
    return "Erreur : Le nom complet ne peut pas être vide.";
  }

  const villePropre = normaliserNom(ville);
  if (villePropre === "") {
    return "Erreur : La ville ne peut pas être vide.";
  }

  apprenants.push({
    id: id,
    nomComplet: nomPropre,
    ville: villePropre,
    resultats: []
  });

  return "Apprenant ajouté : " + nomPropre + " (id " + id + ").";
}

function enregistrerResultat(apprenants, id, resultat) {
  const apprenant = rechercherParId(apprenants, id);
  if (apprenant === null) {
    return "Erreur : Aucun apprenant avec l'identifiant " + id + ".";
  }

  const erreur = validerResultat(resultat);
  if (erreur !== null) {
    return "Erreur : " + erreur;
  }

  const nouveauResultat = {
    jour: resultat.jour,
    exercicesTermines: resultat.exercicesTermines,
    totalExercices: resultat.totalExercices,
    challengeTermine: resultat.challengeTermine
  };

  // إلا اليوم كاين كنبدلو ما نزيدوش واحد آخر
  for (let i = 0; i < apprenant.resultats.length; i++) {
    if (apprenant.resultats[i].jour === nouveauResultat.jour) {
      apprenant.resultats[i] = nouveauResultat;
      return "Résultat du jour " + nouveauResultat.jour + " mis à jour.";
    }
  }

  apprenant.resultats.push(nouveauResultat);

  // tri des jours
  for (let i = 0; i < apprenant.resultats.length; i++) {
    for (let j = 0; j < apprenant.resultats.length - 1; j++) {
      if (apprenant.resultats[j].jour > apprenant.resultats[j + 1].jour) {
        const temp = apprenant.resultats[j];
        apprenant.resultats[j] = apprenant.resultats[j + 1];
        apprenant.resultats[j + 1] = temp;
      }
    }
  }

  return "Résultat du jour " + nouveauResultat.jour + " enregistré.";
}

function rechercherParId(apprenants, id) {
  for (let i = 0; i < apprenants.length; i++) {
    if (apprenants[i].id === id) {
      return apprenants[i];
    }
  }
  return null;
}

function rechercherParNom(apprenants, texte) {
  const recherche = normaliserNom(texte).toLowerCase();
  if (recherche === "") {
    return [];
  }

  const trouves = [];
  for (let i = 0; i < apprenants.length; i++) {
    const nom = normaliserNom(apprenants[i].nomComplet).toLowerCase();
    if (nom.indexOf(recherche) !== -1) {
      trouves.push(apprenants[i]);
    }
  }
  return trouves;
}

function rechercherApprenant(apprenants, critere) {
  if (typeof critere === "number") {
    const apprenant = rechercherParId(apprenants, critere);
    if (apprenant === null) {
      return [];
    }
    return [apprenant];
  }
  return rechercherParNom(apprenants, critere);
}

function determinerNiveau(pourcentage) {
  if (pourcentage === null) {
    return NIVEAU_NON_EVALUE;
  }
  if (pourcentage >= 80) {
    return NIVEAU_SOLIDE;
  }
  if (pourcentage >= 50) {
    return NIVEAU_PROGRESSION;
  }
  return NIVEAU_RENFORCER;
}

function calculerProgression(apprenant) {
  let exercicesTermines = 0;
  let exercicesProposes = 0;
  let challengesTermines = 0;

  for (let i = 0; i < apprenant.resultats.length; i++) {
    exercicesTermines = exercicesTermines + apprenant.resultats[i].exercicesTermines;
    exercicesProposes = exercicesProposes + apprenant.resultats[i].totalExercices;
    if (apprenant.resultats[i].challengeTermine === true) {
      challengesTermines = challengesTermines + 1;
    }
  }

  // ما نقسموش على 0
  let pourcentage = null;
  if (exercicesProposes > 0) {
    pourcentage = arrondirUneDecimale((exercicesTermines / exercicesProposes) * 100);
  }

  const joursNonRenseignes = [];
  const challengesNonTermines = [];

  for (let jour = 1; jour <= 7; jour++) {
    let trouve = null;
    for (let i = 0; i < apprenant.resultats.length; i++) {
      if (apprenant.resultats[i].jour === jour) {
        trouve = apprenant.resultats[i];
      }
    }
    if (trouve === null) {
      joursNonRenseignes.push(jour);
    } else {
      if (trouve.challengeTermine === false) {
        challengesNonTermines.push(jour);
      }
    }
  }

  return {
    id: apprenant.id,
    nomComplet: apprenant.nomComplet,
    ville: apprenant.ville,
    exercicesTermines: exercicesTermines,
    exercicesProposes: exercicesProposes,
    pourcentage: pourcentage,
    niveau: determinerNiveau(pourcentage),
    challengesTermines: challengesTermines,
    journeesRenseignees: apprenant.resultats.length,
    joursNonRenseignes: joursNonRenseignes,
    challengesNonTermines: challengesNonTermines
  };
}

function calculerTousLesProfils(apprenants) {
  const profils = [];
  for (let i = 0; i < apprenants.length; i++) {
    profils.push(calculerProgression(apprenants[i]));
  }
  return profils;
}

function filtrerParNiveau(apprenants, niveau) {
  const profils = calculerTousLesProfils(apprenants);
  const resultats = [];
  for (let i = 0; i < profils.length; i++) {
    if (profils[i].niveau === niveau) {
      resultats.push(profils[i]);
    }
  }
  return resultats;
}

function trierParProgression(apprenants) {
  const profils = calculerTousLesProfils(apprenants);

  // plus grand % d'abord, null à la fin
  for (let i = 0; i < profils.length; i++) {
    for (let j = 0; j < profils.length - 1; j++) {
      const a = profils[j];
      const b = profils[j + 1];
      let changer = false;

      if (a.pourcentage === null && b.pourcentage === null) {
        if (a.nomComplet > b.nomComplet) {
          changer = true;
        }
      } else if (a.pourcentage === null) {
        changer = true;
      } else if (b.pourcentage === null) {
        changer = false;
      } else if (a.pourcentage < b.pourcentage) {
        changer = true;
      } else if (a.pourcentage === b.pourcentage) {
        if (a.nomComplet > b.nomComplet) {
          changer = true;
        }
      }

      if (changer === true) {
        profils[j] = b;
        profils[j + 1] = a;
      }
    }
  }

  return profils;
}

function trierParNom(apprenants) {
  const profils = calculerTousLesProfils(apprenants);

  for (let i = 0; i < profils.length; i++) {
    for (let j = 0; j < profils.length - 1; j++) {
      if (profils[j].nomComplet > profils[j + 1].nomComplet) {
        const temp = profils[j];
        profils[j] = profils[j + 1];
        profils[j + 1] = temp;
      }
    }
  }

  return profils;
}

function calculerStatistiquesGroupe(apprenants) {
  const profils = calculerTousLesProfils(apprenants);

  let somme = 0;
  let nbEvalues = 0;
  let nbSolide = 0;
  let nbProgression = 0;
  let nbRenforcer = 0;
  let nbNonEvalues = 0;

  for (let i = 0; i < profils.length; i++) {
    if (profils[i].pourcentage !== null) {
      somme = somme + profils[i].pourcentage;
      nbEvalues = nbEvalues + 1;
    }

    if (profils[i].niveau === NIVEAU_SOLIDE) {
      nbSolide = nbSolide + 1;
    } else if (profils[i].niveau === NIVEAU_PROGRESSION) {
      nbProgression = nbProgression + 1;
    } else if (profils[i].niveau === NIVEAU_RENFORCER) {
      nbRenforcer = nbRenforcer + 1;
    } else {
      nbNonEvalues = nbNonEvalues + 1;
    }
  }

  let moyenne = null;
  if (nbEvalues > 0) {
    moyenne = arrondirUneDecimale(somme / nbEvalues);
  }

  return {
    totalApprenants: profils.length,
    nbEvalues: nbEvalues,
    moyenne: moyenne,
    nbSolide: nbSolide,
    nbProgression: nbProgression,
    nbRenforcer: nbRenforcer,
    nbNonEvalues: nbNonEvalues
  };
}

function formaterPourcentage(pourcentage) {
  if (pourcentage === null) {
    return "--";
  }
  return pourcentage + " %";
}

function formaterListeJours(jours) {
  if (jours.length === 0) {
    return "aucun";
  }
  let texte = "";
  for (let i = 0; i < jours.length; i++) {
    if (i > 0) {
      texte = texte + ", ";
    }
    texte = texte + "J" + jours[i];
  }
  return texte;
}

function afficherListeProfils(titre, profils) {
  console.log("\n--- " + titre + " ---");
  if (profils.length === 0) {
    console.log("Aucun apprenant à afficher.");
    return;
  }
  for (let i = 0; i < profils.length; i++) {
    console.log("#" + profils[i].id + "  " + profils[i].nomComplet + "  " + profils[i].ville + "  "
      + formaterPourcentage(profils[i].pourcentage) + "  " + profils[i].niveau);
  }
}

function afficherDetailProfil(profil) {
  console.log("\n--- Profil de " + profil.nomComplet + " ---");
  console.log("Identifiant : " + profil.id);
  console.log("Ville : " + profil.ville);
  console.log("Exercices : " + profil.exercicesTermines + " / " + profil.exercicesProposes);
  console.log("Progression : " + formaterPourcentage(profil.pourcentage));
  console.log("Niveau : " + profil.niveau);
  console.log("Journées renseignées : " + profil.journeesRenseignees);
  console.log("Challenges terminés : " + profil.challengesTermines);
  console.log("Journées non renseignées : " + formaterListeJours(profil.joursNonRenseignes));
  console.log("Challenges non terminés : " + formaterListeJours(profil.challengesNonTermines));
}

function afficherTableauDeBord(apprenants) {
  const stats = calculerStatistiquesGroupe(apprenants);

  console.log("\n============== TABLEAU DE BORD ==============");
  console.log("Nombre d'apprenants : " + stats.totalApprenants
    + " (dont " + stats.nbEvalues + " avec au moins une journée renseignée)");
  console.log("Progression moyenne du groupe : " + formaterPourcentage(stats.moyenne));
  console.log(NIVEAU_SOLIDE + " : " + stats.nbSolide
    + " | " + NIVEAU_PROGRESSION + " : " + stats.nbProgression
    + " | " + NIVEAU_RENFORCER + " : " + stats.nbRenforcer
    + " | " + NIVEAU_NON_EVALUE + " : " + stats.nbNonEvalues);

  const profilsTries = trierParProgression(apprenants);
  afficherListeProfils("Classement par progression", profilsTries);

  console.log("\n--- Journées et challenges manquants ---");
  for (let i = 0; i < profilsTries.length; i++) {
    console.log(profilsTries[i].nomComplet);
    console.log("   Journées non renseignées : " + formaterListeJours(profilsTries[i].joursNonRenseignes));
    console.log("   Challenges non terminés : " + formaterListeJours(profilsTries[i].challengesNonTermines));
  }

  console.log("\nRappel : ces repères décrivent les données enregistrées.");
  console.log("Ils ne constituent pas une décision d'admission.");
  console.log("=============================================");
}

module.exports = {
  NIVEAU_SOLIDE: NIVEAU_SOLIDE,
  NIVEAU_PROGRESSION: NIVEAU_PROGRESSION,
  NIVEAU_RENFORCER: NIVEAU_RENFORCER,
  NIVEAU_NON_EVALUE: NIVEAU_NON_EVALUE,
  normaliserNom: normaliserNom,
  validerResultat: validerResultat,
  ajouterApprenant: ajouterApprenant,
  enregistrerResultat: enregistrerResultat,
  rechercherParId: rechercherParId,
  rechercherParNom: rechercherParNom,
  rechercherApprenant: rechercherApprenant,
  arrondirUneDecimale: arrondirUneDecimale,
  determinerNiveau: determinerNiveau,
  calculerProgression: calculerProgression,
  calculerTousLesProfils: calculerTousLesProfils,
  filtrerParNiveau: filtrerParNiveau,
  trierParProgression: trierParProgression,
  trierParNom: trierParNom,
  calculerStatistiquesGroupe: calculerStatistiquesGroupe,
  formaterPourcentage: formaterPourcentage,
  afficherListeProfils: afficherListeProfils,
  afficherDetailProfil: afficherDetailProfil,
  afficherTableauDeBord: afficherTableauDeBord
};
