// Importing the samples from sample.json
import samples from './sample.json';

let save = Object.values(samples)[2].map((x) => x['otu_labels']);
let saveArray = save.flat().toString().split(/\W+/);

// Count the frequency of each word
function createWordMap(wordsArray) {
  // create map for word counts
  let wordsMap = {};

  wordsArray.forEach((key) => {
    if (wordsMap.hasOwnProperty(key)) {
      wordsMap[key]++;
    } else {
      wordsMap[key] = 1;
    }
  });

  return wordsMap;
}

// Sort by count in descending order
function sortByCount(wordsMap) {
  // sort by count in descending order
  let finalWordsArray = [];
  finalWordsArray = Object.keys(wordsMap).map((key) => {
    return {
      name: key,
      total: wordsMap[key],
    };
  });

  finalWordsArray.sort(function (a, b) {
    return b.total - a.total;
  });

  return finalWordsArray;
}

// Printing out the results
console.log(sortByCount(createWordMap(saveArray)));
console.log(
  `The word '${
    sortByCount(createWordMap(saveArray))[0].name
  }' appears the most in the file '${
    sortByCount(createWordMap(saveArray))[0].total
  }' times.`
);
