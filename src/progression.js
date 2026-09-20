function normaliserNom(nom) {
  if (typeof nom !== "string") return "";
  return nom.trim().replace(/\s+/g, " ").toLocaleLowerCase("fr-FR").replace(/\p{Diacritic}/gu, "");
}

module.exports = {
  normaliserNom
};
