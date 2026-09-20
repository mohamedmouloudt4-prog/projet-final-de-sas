function normaliserNom(nom) {
  if (typeof nom !== "string") return "";
  return nom.trim().replace(/\s+/g, " ").toLocaleLowerCase("fr-FR").replace(/\p{Diacritic}/gu, "");
}

function validerResultat(resultat) {
  if (!resultat || typeof resultat !== "object") {
    return { valide: false, message: "Le résultat est invalide." };
  }

  const { jour, exercicesTermines, totalExercices, challengeTermine } = resultat;

  if (!Number.isInteger(jour) || jour < 1 || jour > 7) {
    return { valide: false, message: "Le jour doit être un entier compris entre 1 et 7." };
  }

  if (!Number.isInteger(exercicesTermines) || exercicesTermines < 0) {
    return { valide: false, message: "Le nombre d'exercices terminés doit être un entier positif ou nul." };
  }

  if (!Number.isInteger(totalExercices) || totalExercices < 0) {
    return { valide: false, message: "Le total d'exercices proposés doit être un entier positif ou nul." };
  }

  if (exercicesTermines > totalExercices) {
    return { valide: false, message: "Les exercices terminés ne peuvent pas dépasser les exercices proposés." };
  }

  if (typeof challengeTermine !== "boolean") {
    return { valide: false, message: "challengeTermine doit être un booléen." };
  }

  return { valide: true, message: "Résultat valide." };
}

module.exports = {
  normaliserNom,
  validerResultat
};
