
// Embedded Coding Tool settings object

const mySettings = {
  apiServerUrl: "https://icd11restapi-developer-test.azurewebsites.net",
  height: "30vh"
};


// example of an Embedded Coding Tool using the callback selectedEntityFunction for copying the code selected in an html element
const myCallbacks = {

  selectedEntityFunction: (selectedEntity) => {
    document.getElementById("causeOfDeath").innerHTML = selectedEntity.bestMatchText;
    document.getElementById("code").innerHTML = selectedEntity.code;
    ECT.Handler.clear("1");
  }

};

// configure all the Embedded Coding Tool
ECT.Handler.configure(mySettings, myCallbacks);
ECT.Handler.bind("1");
//overwrite configuration only for the Embedded Coding Tool 1
ECT.Handler.overwriteConfiguration("1", {
  chaptersFilter: "18;19;20;21;22;23;24;25;26",
  wordsAvailable: false
});

// ECT.Handler.overwriteConfiguration("2", {
//   chaptersFilter: "18;19;20;21;22;23;24;25;26",
//   wordsAvailable: false
// });

// ECT.Handler.overwriteConfiguration("3", {
//   chaptersFilter: "18;19;20;21;22;23;24;25;26",
//   wordsAvailable: false
// });


// const mySettings1 = {
//   apiServerUrl: "https://icd11restapi-developer-test.azurewebsites.net",
//   height: "60vh"
// };

// const myCallbacks1 = {
//   selectedEntityFunction: selectedEntity => {
//     document.getElementById("causeOfDeath_b").innerHTML = selectedEntity.bestMatchText;
//     document.getElementById("code_b").innerHTML = selectedEntity.code;
//     ECT.Handler.clear("2");
//   }
// };

// ECT.Handler.configure(mySettings1, myCallbacks1);
// ECT.Handler.bind("2");
// ECT.Handler.overwriteConfiguration("2", {
//   chaptersFilter: "18;19;20;21;22;23;24;25;26",
//   wordsAvailable: false
// });

// // overwrite configuration only for the Embedded Coding Tool 2
// ECT.Handler.overwriteConfiguration("2", { chaptersFilter: "X" });

// // overwrite configuration only for the Embedded Coding Tool 3
// ECT.Handler.overwriteConfiguration("3", { chaptersFilter: "26" });

