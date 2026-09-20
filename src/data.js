// // // données de départ

// let users = [
//   {
//     id: 1,
//     name: "mouloud",
//     ferstname: "mohamed",
//     age: 20,
//   },
//   {
//     id: 2,
//     name: "saad",
//     ferstname: "lasri",
//     age: 12,
//   },
//   {
//     id: 3,
//     name: "iman",
//     ferstname: "lbrax",
//     age: 21,
//   },
// ];
//  for(let i=0; i<users.length;i++){
//   console.log(users[i].name)
//   if(users[i].age>18){
//     console.log("kbiir")
//   } 
//   else{
//     console.log("sghiir")
//   }
// }



function creerDonneesDeDepart() {
  return [
    {
      id: 1,
      nomComplet: "Sara Dev",
      ville: "Nador",
      resultats: [
        {
          jour: 1,
          exercicesTermines: 18,
          totalExercices: 20,
          challengeTermine: true,
        },
        {
          jour: 2,
          exercicesTermines: 14,
          totalExercices: 20,
          challengeTermine: false,
        },
      ],
    },
    {
      id: 2,
      nomComplet: "Yassine Code",
      ville: "Oujda",
      resultats: [
        {
          jour: 1,
          exercicesTermines: 12,
          totalExercices: 20,
          challengeTermine: false,
        },
      ],
    },
    {
      id: 3,
      nomComplet: "Imane Script",
      ville: "Nador",
      resultats: [
        {
          jour: 1,
          exercicesTermines: 8,
          totalExercices: 20,
          challengeTermine: false,
        },
        {
          jour: 2,
          exercicesTermines: 9,
          totalExercices: 20,
          challengeTermine: true,
        },
        {
          jour: 3,
          exercicesTermines: 6,
          totalExercices: 20,
          challengeTermine: false,
        },
      ],
    },
    {
      id: 4,
      nomComplet: "Karim Node",
      ville: "Berkane",
      resultats: [
        {
          jour: 1,
          exercicesTermines: 20,
          totalExercices: 20,
          challengeTermine: true,
        },
        {
          jour: 2,
          exercicesTermines: 19,
          totalExercices: 20,
          challengeTermine: true,
        },
        {
          jour: 3,
          exercicesTermines: 17,
          totalExercices: 20,
          challengeTermine: true,
        },
        {
          jour: 4,
          exercicesTermines: 18,
          totalExercices: 20,
          challengeTermine: false,
        },
      ],
    },
    {
      // نورا بلا نتائج
      id: 5,
      nomComplet: "Nora Loop",
      ville: "Driouch",
      resultats: [],
    },
  ];
}

module.exports = { creerDonneesDeDepart };
