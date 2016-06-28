"use strict"

const decide = require("./decide").decide;

for (let i = 0; i < 1000; i++) {
   let input = require("./inputs/input" + i);

   if (decide(input))
      console.log("YES");
   else
      console.log("NO");
}

process.exit(0);
