// menu
// التشغيل: node src/index.js

const readline = require("readline");
const data = require("./data");
const p = require("./progression");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const apprenants = data.creerDonneesDeDepart();

function lireEntier(texte) {
  if (texte === "") {
    return null;
  }
  const nombre = Number(texte);
  if (isNaN(nombre)) {
    return null;
  }
  if (nombre !== Math.floor(nombre)) {
    return null;
  }
  return nombre;
}

function lireOuiNon(texte) {
  const reponse = texte.toLowerCase();
  if (reponse === "oui" || reponse === "o") {
    return true;
  }
  if (reponse === "non" || reponse === "n") {
    return false;
  }
  return null;
}

function afficherMenu() {
  console.log("\n========= SAS PROGRESS CONSOLE =========");
  console.log("1. Afficher le tableau de bord");
  console.log("2. Afficher la liste des apprenants");
  console.log("3. Ajouter un apprenant");
  console.log("4. Consulter un apprenant par identifiant");
  console.log("5. Ajouter ou modifier le résultat d'une journée");
  console.log("6. Rechercher un apprenant par nom");
  console.log("7. Filtrer les apprenants par niveau");
  console.log("8. Trier les apprenants par progression décroissante");
  console.log("9. Trier les apprenants par ordre alphabétique");
  console.log("0. Quitter");

  rl.question("Votre choix : ", function (choix) {
    choix = choix.trim();

    switch (choix) {
      case "1":
        p.afficherTableauDeBord(apprenants);
        afficherMenu();
        break;
      case "2":
        p.afficherListeProfils("Liste des apprenants", p.calculerTousLesProfils(apprenants));
        afficherMenu();
        break;
      case "3":
        ajouterApprenant();
        break;
      case "4":
        consulterApprenant();
        break;
      case "5":
        enregistrerJournee();
        break;
      case "6":
        rechercherNom();
        break;
      case "7":
        filtrerNiveau();
        break;
      case "8":
        p.afficherListeProfils("Tri par progression décroissante", p.trierParProgression(apprenants));
        afficherMenu();
        break;
      case "9":
        p.afficherListeProfils("Tri alphabétique", p.trierParNom(apprenants));
        afficherMenu();
        break;
      case "0":
        console.log("Merci, à bientôt !");
        rl.close();
        break;
      default:
        console.log("Choix invalide : tapez un nombre entre 0 et 9.");
        afficherMenu();
    }
  });
}

function ajouterApprenant() {
  rl.question("Identifiant : ", function (idTexte) {
    rl.question("Nom complet : ", function (nom) {
      rl.question("Ville : ", function (ville) {
        const id = lireEntier(idTexte.trim());
        const message = p.ajouterApprenant(apprenants, id, nom, ville);
        console.log(message);
        afficherMenu();
      });
    });
  });
}

function consulterApprenant() {
  rl.question("Identifiant de l'apprenant : ", function (idTexte) {
    const id = lireEntier(idTexte.trim());
    const apprenant = p.rechercherParId(apprenants, id);

    if (apprenant === null) {
      console.log("Erreur : aucun apprenant avec cet identifiant.");
    } else {
      p.afficherDetailProfil(p.calculerProgression(apprenant));
    }
    afficherMenu();
  });
}

function enregistrerJournee() {
  rl.question("Identifiant de l'apprenant : ", function (idTexte) {
    const id = lireEntier(idTexte.trim());
    const apprenant = p.rechercherParId(apprenants, id);

    if (apprenant === null) {
      console.log("Erreur : aucun apprenant avec cet identifiant.");
      afficherMenu();
      return;
    }

    console.log("Apprenant trouvé : " + apprenant.nomComplet);

    rl.question("Jour (1 à 7) : ", function (jourTexte) {
      rl.question("Exercices terminés : ", function (terminesTexte) {
        rl.question("Total d'exercices proposés : ", function (totalTexte) {
          rl.question("Challenge terminé (oui/non) : ", function (challengeTexte) {
            const resultat = {
              jour: lireEntier(jourTexte.trim()),
              exercicesTermines: lireEntier(terminesTexte.trim()),
              totalExercices: lireEntier(totalTexte.trim()),
              challengeTermine: lireOuiNon(challengeTexte.trim())
            };

            const message = p.enregistrerResultat(apprenants, id, resultat);
            console.log(message);

            if (message.indexOf("Erreur") === -1) {
              const profil = p.calculerProgression(apprenant);
              console.log(profil.nomComplet + " : " + profil.exercicesTermines + " / " + profil.exercicesProposes
                + " exercices, progression " + p.formaterPourcentage(profil.pourcentage) + ".");
            }

            afficherMenu();
          });
        });
      });
    });
  });
}

function rechercherNom() {
  rl.question("Nom ou partie du nom : ", function (texte) {
    const trouves = p.rechercherParNom(apprenants, texte.trim());
    p.afficherListeProfils("Résultats pour \"" + texte.trim() + "\"", p.calculerTousLesProfils(trouves));
    afficherMenu();
  });
}

function filtrerNiveau() {
  console.log("1. " + p.NIVEAU_SOLIDE);
  console.log("2. " + p.NIVEAU_PROGRESSION);
  console.log("3. " + p.NIVEAU_RENFORCER);

  rl.question("Niveau choisi : ", function (choix) {
    let niveau = null;
    switch (choix.trim()) {
      case "1":
        niveau = p.NIVEAU_SOLIDE;
        break;
      case "2":
        niveau = p.NIVEAU_PROGRESSION;
        break;
      case "3":
        niveau = p.NIVEAU_RENFORCER;
        break;
    }

    if (niveau === null) {
      console.log("Erreur : choisissez 1, 2 ou 3.");
    } else {
      p.afficherListeProfils("Niveau " + niveau, p.filtrerParNiveau(apprenants, niveau));
    }
    afficherMenu();
  });
}

afficherMenu();
