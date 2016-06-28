"use strict"

const decide = require("./decide").decide;
var retCode = 0;

if (!process.argv[2]) {
   console.error("Usage:", process.argv[0], process.argv[1], "<input-file>");
   retCode = 1;
} else {
   let input = require("./" + process.argv[2]);

   if (!input) {
      console.error("Invalid input file");
      retCode = 2;
   } else if (decide(input)) {
      console.log("YES");
   } else {
      console.log("NO");
   }
}

process.exit(0);
