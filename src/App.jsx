import React, { useState, useEffect, useMemo } from "react";

/* =========================================================================
   HCL On-Campus Drive 2026 â€“ Topic-wise Question Bank (Phase I)
   145 items: Quant 36 Â· Reasoning 30 Â· Verbal 30 Â· Technical 37 Â· Coding 12
   Single-file React component. No external dependencies besides React.
   ========================================================================= */

const SECTIONS = [
  { key: "quant", name: "Quantitative Aptitude", short: "Quant" },
  { key: "reasoning", name: "Logical Reasoning", short: "Reasoning" },
  { key: "verbal", name: "Verbal Ability", short: "Verbal" },
  { key: "technical", name: "Technical", short: "Technical" },
  { key: "coding", name: "Coding (Java)", short: "Coding" },
];

/* ---------- Topic tips / key formulas ---------- */
const TIPS = {
  "Number System, HCF & LCM": `HCF Ã— LCM = product of two numbers. Unit digits of powers repeat in cycles of 4 (for 2, 3, 7, 8). Largest number dividing a, b leaving remainder r = HCF(a âˆ’ r, b âˆ’ r). Smallest number leaving remainder r when divided by x, y, z = LCM(x, y, z) + r.`,
  "Percentages": `If price rises by r%, consumption must fall by r/(100 + r) Ã— 100% to keep spending the same. Successive changes a% and b%: net = a + b + ab/100.`,
  "Profit & Loss": `Profit% = (SP âˆ’ CP)/CP Ã— 100. SP = CP Ã— (100 + gain%)/100. Two items sold at the same price, one at x% gain and one at x% loss: always a loss of xÂ²/100 %.`,
  "Simple & Compound Interest": `SI = PRT/100. Amount (CI) = P(1 + R/100)â¿. For 2 years, CI âˆ’ SI = P(R/100)Â².`,
  "Ratio, Proportion & Ages": `To combine A : B and B : C, make B equal in both. Share = total Ã— its ratio term Ã· sum of terms. For ages, write present ages as multiples of x and form one equation.`,
  "Averages & Mixtures": `Average = sum Ã· count. Average of first n natural numbers = (n + 1)/2. Alligation: cheaper : dearer = (dearer âˆ’ mean) : (mean âˆ’ cheaper).`,
  "Time & Work, Pipes": `If A finishes in a days, one-day work = 1/a. Mâ‚Dâ‚ = Mâ‚‚Dâ‚‚. A pipe that empties counts as negative work.`,
  "Time, Speed & Distance": `km/h Ã— 5/18 = m/s. Average speed for equal distances = 2xy/(x + y). Trains crossing: time = sum of lengths Ã· relative speed (add speeds if opposite, subtract if same direction).`,
  "Permutations & Combinations": `â¿Cáµ£ = n!/(r!(n âˆ’ r)!) for selection. â¿Páµ£ = n!/(n âˆ’ r)! for arrangement. Repeated letters: n!/(p! q! â€¦). Items together: treat as one unit, then multiply by internal arrangements.`,
  "Probability": `P(E) = favourable Ã· total. P(A or B) = P(A) + P(B) âˆ’ P(A and B). P(at least one) = 1 âˆ’ P(none).`,
  "Logarithms & Indices": `log(ab) = log a + log b. log(aâ¿) = n log a. logâ‚ a = 1. aáµ Ã— aâ¿ = aáµâºâ¿; aáµ Ã· aâ¿ = aáµâ»â¿.`,
  "Geometry & Mensuration": `Heron's formula: âˆš(s(s âˆ’ a)(s âˆ’ b)(s âˆ’ c)), s = (a + b + c)/2. Circle: circumference 2Ï€r, area Ï€rÂ². Square diagonal = side Ã— âˆš2.`,
  "Number Series": `Check differences first, then ratios (Ã—2, Ã—1.5), then squares/cubes (nÂ² Â± 1, nÂ³), then patterns like Ã—2 + 1.`,
  "Letter Series": `Convert letters to positions (A = 1 â€¦ Z = 26). Look for constant or growing jumps, and opposite pairs (Aâ€“Z, Bâ€“Y: positions add to 27).`,
  "Codingâ€“Decoding": `Compare each letter with its code: a fixed shift (+1, +2), reversal, or letter-value sums.`,
  "Direction Sense": `Draw it. Clockwise from North: N â†’ E â†’ S â†’ W. Use Pythagoras for shortest distance. Morning sun is east (shadows fall west); evening shadows fall east.`,
  "Blood Relations": `Draw a family tree with genders and generations. Decode phrases from the end: "my mother's father's only son" = maternal uncle.`,
  "Seating Arrangement": `Fix one person first, then place the rest from the most definite clue. In a circle facing the centre, left = clockwise and right = anticlockwise.`,
  "Syllogisms": `Draw Venn diagrams. A conclusion follows only if true in every possible diagram. "Some A are B" converts to "Some B are A"; "All A are B" converts only to "Some B are A".`,
  "Data Sufficiency": `Test each statement alone first. Don't solve fully â€” only check whether a unique answer is possible.`,
  "Analogies & Classification": `State the relationship in a sentence ("a book is written by an author") and apply it to the second pair.`,
  "Statements & Assumptions": `An assumption is what the speaker must take for granted. Extreme words (all, only, never) usually make an assumption invalid.`,
  "Synonyms": `Use the word in a simple sentence, then test each option in its place. Eliminate antonyms first â€” examiners often include one as a trap.`,
  "Antonyms": `Find the meaning first, then look for its exact opposite, not just a different word.`,
  "Sentence Correction": `Most tested: subjectâ€“verb agreement (each, one of, neitherâ€¦nor), uncountable nouns (news, information, advice), since vs for, preferâ€¦to, senior/junior/superior + to.`,
  "Fill in the Blanks": `Fixed prepositions (good at, accused of), articles by sound (an honest), and tense signals (for/since â†’ perfect continuous; by the time â†’ past perfect).`,
  "Spellings & Improvement": `Watch double letters (accommodate, occurrence, necessary). Fixed pairs: hardly/scarcelyâ€¦when, no soonerâ€¦than.`,
  "Reading Comprehension": `Read the questions first, then the passage. In placement tests answers are usually stated directly in the text.`,
  "Computer Fundamentals": `Know conversions (binary, hex), two's complement (invert + 1), memory hierarchy (registers > cache > RAM > disk).`,
  "Data Structures": `Stack = LIFO (DFS, parentheses, recursion). Queue = FIFO (BFS). Merge sort is always O(n log n); quick sort worst case is O(nÂ²).`,
  "OOP & Java": `Four pillars: encapsulation, abstraction, inheritance, polymorphism. Overloading = compile-time; overriding = run-time. final class cannot be extended; abstract class cannot be instantiated.`,
  "Code Output": `Trace line by line and track every variable. Watch integer division, string concatenation order, pre/post increment and static fields.`,
  "Operating Systems": `Process states: new, ready, running, waiting, terminated. Deadlock needs mutual exclusion, hold & wait, no preemption, circular wait. Thrashing = excessive paging.`,
  "Computer Networks": `OSI: Physical, Data Link, Network, Transport, Session, Presentation, Application. Router = L3, switch = L2, hub = L1. TCP reliable, UDP fast. HTTPS 443, HTTP 80.`,
  "DBMS & SQL": `WHERE filters rows; HAVING filters groups. Primary key = unique + NOT NULL. TRUNCATE is DDL; DELETE is DML. LEFT JOIN keeps all left rows.`,
};

/* ---------- Shared contexts (passages, sets, tables) ---------- */
const CONTEXTS = {
  seating: `Six people P, Q, R, S, T and U sit around a circular table facing the centre. P sits opposite Q. R sits immediately to the left of P. S sits between Q and T.`,
  ds: `Options: (a) Statement I alone is sufficient (b) Statement II alone is sufficient (c) Both together are needed (d) Each alone is sufficient`,
  rc: `Over the past decade, solar power has grown faster than almost any other source of electricity. Falling panel prices drove much of this growth; the cost of solar modules dropped sharply as factories scaled up production. In some sunny regions, large solar parks now supply power at tariffs lower than many coal plants. Yet solar energy has a basic limitation. Panels produce electricity only when the sun shines, while demand often peaks in the evening. To bridge this gap, grid operators are turning to battery storage, which can hold the daytime surplus and release it after sunset. Batteries remain expensive, but their prices are following the same downward path that solar panels once did. Many experts believe that cheap storage, more than cheap panels, will decide how far renewable energy can replace fossil fuels.`,
  sql: `Sample table "employee":
emp_id | name  | dept | salary
1      | Asha  | IT   | 50000
2      | Ravi  | IT   | 60000
3      | Meena | HR   | 40000`,
};

const DS_OPTS = [
  "Statement I alone is sufficient",
  "Statement II alone is sufficient",
  "Both together are needed",
  "Each alone is sufficient",
];

/* ---------- MCQ data ---------- */
const MCQ = [
  // ===================== QUANT =====================
  { id: "A1", s: "quant", t: "Number System, HCF & LCM", q: `Find the largest number that divides 245 and 1029, leaving a remainder of 5 in each case.`, o: ["8", "16", "32", "48"], a: 1, sol: `Subtract the remainder: 245 âˆ’ 5 = 240 and 1029 âˆ’ 5 = 1024. 240 = 2â´ Ã— 15 and 1024 = 2Â¹â°, so HCF = 2â´ = 16.` },
  { id: "A2", s: "quant", t: "Number System, HCF & LCM", q: `What is the unit digit of 7â¹âµ?`, o: ["1", "3", "7", "9"], a: 1, sol: `Unit digits of powers of 7 repeat as 7, 9, 3, 1. 95 Ã· 4 leaves remainder 3, so the unit digit is the 3rd in the cycle: 3.` },
  { id: "A3", s: "quant", t: "Number System, HCF & LCM", q: `Find the smallest number which, when divided by 12, 15 and 20, leaves a remainder of 4 in each case.`, o: ["60", "64", "124", "184"], a: 1, sol: `LCM(12, 15, 20) = 60. Add the remainder: 60 + 4 = 64.` },
  { id: "A4", s: "quant", t: "Percentages", q: `The price of sugar rises by 25%. By what percentage must a family reduce its consumption so that its expenditure stays the same?`, o: ["15%", "20%", "25%", "30%"], a: 1, sol: `Reduction = 25/(100 + 25) Ã— 100 = 25/125 Ã— 100 = 20%.` },
  { id: "A5", s: "quant", t: "Percentages", q: `A town's population of 50,000 increases by 10% in the first year and decreases by 10% in the second year. What is the population after two years?`, o: ["49,000", "49,500", "50,000", "50,500"], a: 1, sol: `50,000 Ã— 1.10 Ã— 0.90 = 49,500. Net change = 10 âˆ’ 10 âˆ’ (10 Ã— 10)/100 = âˆ’1%.` },
  { id: "A6", s: "quant", t: "Percentages", q: `A student needs 35% of the maximum marks to pass. He scores 120 marks and fails by 20 marks. What are the maximum marks?`, o: ["350", "380", "400", "420"], a: 2, sol: `Pass mark = 120 + 20 = 140, which is 35% of the maximum. Maximum = 140 Ã· 0.35 = 400.` },
  { id: "A7", s: "quant", t: "Profit & Loss", q: `A man buys 12 articles for â‚¹10 and sells 10 articles for â‚¹12. What is his profit percentage?`, o: ["20%", "32%", "40%", "44%"], a: 3, sol: `CP of one article = 10/12 = â‚¹5/6. SP of one = 12/10 = â‚¹6/5. Profit% = (6/5 âˆ’ 5/6) Ã· (5/6) Ã— 100 = (11/30) Ã· (25/30) Ã— 100 = 44%.` },
  { id: "A8", s: "quant", t: "Profit & Loss", q: `By selling an article for â‚¹720, a shopkeeper loses 10%. At what price should he sell it to gain 15%?`, o: ["â‚¹880", "â‚¹900", "â‚¹920", "â‚¹950"], a: 2, sol: `CP = 720 Ã· 0.90 = â‚¹800. Required SP = 800 Ã— 1.15 = â‚¹920.` },
  { id: "A9", s: "quant", t: "Profit & Loss", q: `Two articles are sold for â‚¹990 each. One is sold at a 10% gain and the other at a 10% loss. What is the overall result?`, o: ["No profit, no loss", "1% gain", "1% loss", "2% loss"], a: 2, sol: `Shortcut: loss = 10Â²/100 = 1%. Check: CPâ‚ = 990/1.1 = 900, CPâ‚‚ = 990/0.9 = 1100. Total CP = 2000, total SP = 1980, loss = 20 = 1%.` },
  { id: "A10", s: "quant", t: "Simple & Compound Interest", q: `A sum of money doubles itself in 8 years at simple interest. What is the rate of interest per annum?`, o: ["10%", "12%", "12.5%", "15%"], a: 2, sol: `Doubling means SI = P. P = P Ã— R Ã— 8/100, so R = 100/8 = 12.5%.` },
  { id: "A11", s: "quant", t: "Simple & Compound Interest", q: `Find the difference between compound interest and simple interest on â‚¹5,000 for 2 years at 8% per annum.`, o: ["â‚¹16", "â‚¹24", "â‚¹32", "â‚¹40"], a: 2, sol: `CI âˆ’ SI = P(R/100)Â² = 5000 Ã— (0.08)Â² = 5000 Ã— 0.0064 = â‚¹32.` },
  { id: "A12", s: "quant", t: "Simple & Compound Interest", q: `The simple interest on a sum at 6% per annum for 3 years is â‚¹900. Find the sum.`, o: ["â‚¹4,500", "â‚¹5,000", "â‚¹5,400", "â‚¹6,000"], a: 1, sol: `P = SI Ã— 100/(R Ã— T) = 900 Ã— 100/18 = â‚¹5,000.` },
  { id: "A13", s: "quant", t: "Ratio, Proportion & Ages", q: `If A : B = 2 : 3 and B : C = 4 : 5, find A : B : C.`, o: ["2 : 3 : 5", "8 : 12 : 15", "6 : 9 : 10", "4 : 6 : 5"], a: 1, sol: `Make B the same: A : B = 8 : 12 (Ã—4) and B : C = 12 : 15 (Ã—3). So A : B : C = 8 : 12 : 15.` },
  { id: "A14", s: "quant", t: "Ratio, Proportion & Ages", q: `The present ages of a father and son are in the ratio 7 : 2. After 10 years, the ratio will be 9 : 4. Find the son's present age.`, o: ["8 years", "10 years", "12 years", "14 years"], a: 1, sol: `Let ages be 7x and 2x. (7x + 10)/(2x + 10) = 9/4 gives 28x + 40 = 18x + 90, so 10x = 50 and x = 5. Son = 2 Ã— 5 = 10 years.` },
  { id: "A15", s: "quant", t: "Ratio, Proportion & Ages", q: `â‚¹1,540 is divided among A, B and C in the ratio 2 : 3 : 6. What is C's share?`, o: ["â‚¹420", "â‚¹560", "â‚¹770", "â‚¹840"], a: 3, sol: `Sum of terms = 11. C's share = 1540 Ã— 6/11 = 140 Ã— 6 = â‚¹840.` },
  { id: "A16", s: "quant", t: "Averages & Mixtures", q: `What is the average of the first 10 natural numbers?`, o: ["5", "5.5", "6", "10"], a: 1, sol: `Average = (n + 1)/2 = 11/2 = 5.5. Check: sum = 55, and 55 Ã· 10 = 5.5.` },
  { id: "A17", s: "quant", t: "Averages & Mixtures", q: `The average age of 30 students is 15 years. When the teacher's age is included, the average rises by 1 year. What is the teacher's age?`, o: ["31 years", "40 years", "45 years", "46 years"], a: 3, sol: `Students' total = 30 Ã— 15 = 450. New total = 31 Ã— 16 = 496. Teacher = 496 âˆ’ 450 = 46 years.` },
  { id: "A18", s: "quant", t: "Averages & Mixtures", q: `In what ratio must rice at â‚¹40/kg be mixed with rice at â‚¹55/kg to get a mixture worth â‚¹45/kg?`, o: ["1 : 2", "2 : 1", "3 : 2", "2 : 3"], a: 1, sol: `Alligation: cheaper : dearer = (55 âˆ’ 45) : (45 âˆ’ 40) = 10 : 5 = 2 : 1.` },
  { id: "A19", s: "quant", t: "Time & Work, Pipes", q: `A and B together finish a job in 10 days. A alone can finish it in 15 days. How long will B alone take?`, o: ["20 days", "25 days", "30 days", "35 days"], a: 2, sol: `B's one-day work = 1/10 âˆ’ 1/15 = 3/30 âˆ’ 2/30 = 1/30. So B takes 30 days.` },
  { id: "A20", s: "quant", t: "Time & Work, Pipes", q: `12 men can complete a work in 20 days. How many men are needed to complete it in 15 days?`, o: ["14", "15", "16", "18"], a: 2, sol: `Mâ‚Dâ‚ = Mâ‚‚Dâ‚‚ gives 12 Ã— 20 = Mâ‚‚ Ã— 15, so Mâ‚‚ = 240/15 = 16.` },
  { id: "A21", s: "quant", t: "Time & Work, Pipes", q: `Pipes A and B can fill a tank in 12 hours and 15 hours. Pipe C can empty it in 20 hours. If all three are opened together, how long will the tank take to fill?`, o: ["8 hours", "10 hours", "12 hours", "15 hours"], a: 1, sol: `Net per hour = 1/12 + 1/15 âˆ’ 1/20 = 5/60 + 4/60 âˆ’ 3/60 = 6/60 = 1/10. So 10 hours.` },
  { id: "A22", s: "quant", t: "Time, Speed & Distance", q: `A car goes from P to Q at 40 km/h and returns at 60 km/h. What is its average speed for the whole journey?`, o: ["45 km/h", "48 km/h", "50 km/h", "52 km/h"], a: 1, sol: `Equal distances, so average = 2 Ã— 40 Ã— 60/(40 + 60) = 4800/100 = 48 km/h. (Not 50: that is the simple mean.)` },
  { id: "A23", s: "quant", t: "Time, Speed & Distance", q: `Two trains 150 m and 100 m long run in opposite directions at 50 km/h and 40 km/h. How long do they take to cross each other?`, o: ["8 s", "10 s", "12 s", "15 s"], a: 1, sol: `Relative speed = 50 + 40 = 90 km/h = 90 Ã— 5/18 = 25 m/s. Distance = 150 + 100 = 250 m. Time = 250/25 = 10 s.` },
  { id: "A24", s: "quant", t: "Time, Speed & Distance", q: `Walking at 3/4 of his usual speed, a man reaches his office 20 minutes late. What is his usual time?`, o: ["40 min", "50 min", "60 min", "80 min"], a: 2, sol: `At 3/4 speed, time becomes 4/3 of usual. Extra time = 1/3 of usual = 20 min, so usual time = 60 min.` },
  { id: "A25", s: "quant", t: "Permutations & Combinations", q: `In how many ways can 3 students be chosen from 7?`, o: ["21", "35", "42", "210"], a: 1, sol: `â·Câ‚ƒ = (7 Ã— 6 Ã— 5)/(3 Ã— 2 Ã— 1) = 35.` },
  { id: "A26", s: "quant", t: "Permutations & Combinations", q: `A committee of 2 men and 3 women is to be formed from 5 men and 6 women. In how many ways can it be done?`, o: ["100", "150", "200", "300"], a: 2, sol: `âµCâ‚‚ Ã— â¶Câ‚ƒ = 10 Ã— 20 = 200.` },
  { id: "A27", s: "quant", t: "Permutations & Combinations", q: `In how many ways can the letters of APPLE be arranged so that the vowels always come together?`, o: ["12", "24", "48", "60"], a: 1, sol: `Treat (AE) as one unit. Units: (AE), P, P, L = 4 units with P repeated: 4!/2! = 12. A and E can swap: Ã— 2! = 24.` },
  { id: "A28", s: "quant", t: "Probability", q: `A card is drawn from a pack of 52. What is the probability that it is a king or a heart?`, o: ["17/52", "4/13", "1/4", "1/13"], a: 1, sol: `Kings = 4, hearts = 13, king of hearts counted twice. Favourable = 4 + 13 âˆ’ 1 = 16. P = 16/52 = 4/13.` },
  { id: "A29", s: "quant", t: "Probability", q: `A bag has 5 red and 3 blue balls. Two balls are drawn at random. What is the probability that both are red?`, o: ["5/14", "3/8", "5/8", "25/64"], a: 0, sol: `âµCâ‚‚/â¸Câ‚‚ = 10/28 = 5/14.` },
  { id: "A30", s: "quant", t: "Probability", q: `Three coins are tossed. What is the probability of getting at least one head?`, o: ["1/8", "3/8", "1/2", "7/8"], a: 3, sol: `P(no head) = P(TTT) = 1/8. P(at least one head) = 1 âˆ’ 1/8 = 7/8.` },
  { id: "A31", s: "quant", t: "Logarithms & Indices", q: `Find logâ‚â‚€ 1000 + logâ‚â‚€ 0.01.`, o: ["1", "2", "3", "5"], a: 0, sol: `logâ‚â‚€ 10Â³ = 3 and logâ‚â‚€ 10â»Â² = âˆ’2. Sum = 1.` },
  { id: "A32", s: "quant", t: "Logarithms & Indices", q: `If log 2 = 0.3010, find log 8.`, o: ["0.6020", "0.9030", "1.2040", "2.4080"], a: 1, sol: `log 8 = log 2Â³ = 3 Ã— 0.3010 = 0.9030.` },
  { id: "A33", s: "quant", t: "Logarithms & Indices", q: `Simplify (2âµ Ã— 2Â³) Ã· 2â¶.`, o: ["2", "4", "8", "16"], a: 1, sol: `2âµâºÂ³â»â¶ = 2Â² = 4.` },
  { id: "A34", s: "quant", t: "Geometry & Mensuration", q: `Find the area of a triangle with sides 13 cm, 14 cm and 15 cm.`, o: ["72 cmÂ²", "78 cmÂ²", "84 cmÂ²", "91 cmÂ²"], a: 2, sol: `s = 21. Area = âˆš(21 Ã— 8 Ã— 7 Ã— 6) = âˆš7056 = 84 cmÂ².` },
  { id: "A35", s: "quant", t: "Geometry & Mensuration", q: `The circumference of a circle is 44 cm. Find its area (Ï€ = 22/7).`, o: ["144 cmÂ²", "154 cmÂ²", "176 cmÂ²", "616 cmÂ²"], a: 1, sol: `2Ï€r = 44 gives r = 7 cm. Area = 22/7 Ã— 49 = 154 cmÂ².` },
  { id: "A36", s: "quant", t: "Geometry & Mensuration", q: `The perimeter of a square is 48 cm. Find the length of its diagonal.`, o: ["12 cm", "12âˆš2 cm", "24 cm", "24âˆš2 cm"], a: 1, sol: `Side = 48/4 = 12 cm. Diagonal = 12âˆš2 â‰ˆ 16.97 cm.` },

  // ===================== REASONING =====================
  { id: "B1", s: "reasoning", t: "Number Series", q: `5, 11, 23, 47, 95, ?`, o: ["143", "189", "191", "193"], a: 2, sol: `Each term = previous Ã— 2 + 1: 95 Ã— 2 + 1 = 191.` },
  { id: "B2", s: "reasoning", t: "Number Series", q: `2, 5, 10, 17, 26, ?`, o: ["35", "36", "37", "39"], a: 2, sol: `Terms are nÂ² + 1 for n = 1, 2, 3â€¦ The next is 6Â² + 1 = 37. (Differences 3, 5, 7, 9, 11 confirm it.)` },
  { id: "B3", s: "reasoning", t: "Number Series", q: `4, 6, 9, 13.5, ?`, o: ["18", "19.5", "20.25", "22"], a: 2, sol: `Each term is multiplied by 1.5: 13.5 Ã— 1.5 = 20.25.` },
  { id: "B4", s: "reasoning", t: "Letter Series", q: `AZ, BY, CX, ?`, o: ["DV", "DW", "EW", "DX"], a: 1, sol: `First letters move forward (A, B, C, D); second letters move backward (Z, Y, X, W). Each pair is an opposite pair.` },
  { id: "B5", s: "reasoning", t: "Letter Series", q: `ACE, BDF, CEG, ?`, o: ["DEF", "DFH", "EGI", "DGH"], a: 1, sol: `Each group is three letters with a gap of 2; every group starts one letter later. After C comes D: D, F, H.` },
  { id: "B6", s: "reasoning", t: "Letter Series", q: `Z, X, U, Q, ?`, o: ["M", "L", "K", "N"], a: 1, sol: `Positions 26, 24, 21, 17: gaps of âˆ’2, âˆ’3, âˆ’4. Next gap âˆ’5 gives 12 = L.` },
  { id: "B7", s: "reasoning", t: "Codingâ€“Decoding", q: `If BOOK = 43 (sum of letter positions), what is PEN?`, o: ["33", "35", "37", "39"], a: 1, sol: `Check: B(2) + O(15) + O(15) + K(11) = 43. PEN = P(16) + E(5) + N(14) = 35.` },
  { id: "B8", s: "reasoning", t: "Codingâ€“Decoding", q: `If TEACHER is written as VGCEJGT, how is STUDENT written?`, o: ["UVWFGPV", "UVWEGPV", "TUVEFOU", "UVWFHPV"], a: 0, sol: `Each letter moves +2: Sâ†’U, Tâ†’V, Uâ†’W, Dâ†’F, Eâ†’G, Nâ†’P, Tâ†’V.` },
  { id: "B9", s: "reasoning", t: "Codingâ€“Decoding", q: `If MOBILE is coded as ELIBOM, how is LAPTOP coded?`, o: ["POTPAL", "PTOPAL", "POTLAP", "LAPPOT"], a: 0, sol: `The word is written in reverse order: LAPTOP â†’ POTPAL.` },
  { id: "B10", s: "reasoning", t: "Direction Sense", q: `A man faces South. He turns 90Â° clockwise and then 135Â° anticlockwise. Which direction does he face now?`, o: ["South-East", "South-West", "North-East", "East"], a: 0, sol: `South + 90Â° clockwise = West. From West, 90Â° anticlockwise = South; a further 45Â° anticlockwise = South-East.` },
  { id: "B11", s: "reasoning", t: "Direction Sense", q: `Sita walks 5 km East, turns left and walks 3 km, then turns left again and walks 9 km. How far and in which direction is she from her start?`, o: ["5 km North-West", "4 km West", "5 km North-East", "3 km North"], a: 0, sol: `East 5, then North 3, then West 9. Net: 4 km West and 3 km North. Distance = âˆš(16 + 9) = 5 km, towards North-West.` },
  { id: "B12", s: "reasoning", t: "Direction Sense", q: `One morning after sunrise, Raj stands facing Vikram. Raj's shadow falls exactly to his right. Which direction is Raj facing?`, o: ["North", "South", "East", "West"], a: 1, sol: `Morning sun is in the east, so shadows fall to the west. His right side points west, which means he faces South.` },
  { id: "B13", s: "reasoning", t: "Blood Relations", q: `A is B's sister. C is B's mother. D is C's father. E is D's mother. How is A related to D?`, o: ["Daughter", "Granddaughter", "Grandmother", "Niece"], a: 1, sol: `A is C's daughter (B's sister, and C is B's mother). D is C's father, so A is D's granddaughter.` },
  { id: "B14", s: "reasoning", t: "Blood Relations", q: `Introducing a woman, Arun said, "She is the only daughter of my mother's father's only son." How is the woman related to Arun?`, o: ["Sister", "Niece", "Cousin", "Aunt"], a: 2, sol: `Mother's father's only son = Arun's maternal uncle. His daughter is Arun's cousin.` },
  { id: "B15", s: "reasoning", t: "Blood Relations", q: `P + Q means P is the father of Q; P âˆ’ Q means P is the wife of Q; P Ã— Q means P is the brother of Q. What does A âˆ’ B + C mean?`, o: ["A is the sister of C", "A is the mother of C", "A is the aunt of C", "A is the grandmother of C"], a: 1, sol: `A âˆ’ B: A is B's wife. B + C: B is C's father. So A is C's mother.` },
  { id: "B16", s: "reasoning", t: "Seating Arrangement", ctx: "seating", q: `Who sits opposite R?`, o: ["Q", "S", "T", "U"], a: 1, sol: `Number seats 1â€“6 clockwise. P = 1, Q = 4 (opposite). R is P's immediate left (clockwise) = 2. S must sit next to Q (seat 3 or 5); if S = 3, T would need seat 2, which is taken. So S = 5, T = 6, U = 3. Order: P, R, U, Q, S, T. Opposite R (2) is S (5).` },
  { id: "B17", s: "reasoning", t: "Seating Arrangement", ctx: "seating", q: `Who sits between P and S?`, o: ["R", "Q", "T", "U"], a: 2, sol: `Clockwise order: P(1), R(2), U(3), Q(4), S(5), T(6). Between P (1) and S (5) is T (6).` },
  { id: "B18", s: "reasoning", t: "Seating Arrangement", ctx: "seating", q: `Who sits immediately to the right of Q?`, o: ["S", "U", "T", "R"], a: 1, sol: `Facing the centre, right = anticlockwise. From Q (seat 4), anticlockwise is seat 3 = U.` },
  { id: "B19", s: "reasoning", t: "Syllogisms", q: `Statements: All roses are flowers. Some flowers are red.\nConclusions: I. Some roses are red. II. All flowers are roses.`, o: ["Only I follows", "Only II follows", "Both follow", "Neither follows"], a: 3, sol: `The red flowers may lie entirely outside the roses, so I is not certain. Roses are inside flowers, not the other way round, so II is false.` },
  { id: "B20", s: "reasoning", t: "Syllogisms", q: `Statements: All engineers are graduates. All graduates are employed.\nConclusions: I. All engineers are employed. II. Some employed people are engineers.`, o: ["Only I follows", "Only II follows", "Both follow", "Neither follows"], a: 2, sol: `Engineers âŠ‚ graduates âŠ‚ employed, so all engineers are employed (I). "All engineers are employed" converts to "some employed are engineers" (II).` },
  { id: "B21", s: "reasoning", t: "Syllogisms", q: `Statements: Some phones are laptops. No laptop is a tablet.\nConclusions: I. Some phones are not tablets. II. Some tablets are phones.`, o: ["Only I follows", "Only II follows", "Both follow", "Neither follows"], a: 0, sol: `The phones that are laptops cannot be tablets, so some phones are not tablets. Whether any tablet is a phone is not certain.` },
  { id: "B22", s: "reasoning", t: "Data Sufficiency", ctx: "ds", q: `What is Ravi's age?\nI. Ravi is 5 years older than Sunil.\nII. Sunil's age is half of Ravi's age.`, o: DS_OPTS, a: 2, sol: `Alone, neither gives a number. Together: R = S + 5 and S = R/2, so R = R/2 + 5 and R = 10.` },
  { id: "B23", s: "reasoning", t: "Data Sufficiency", ctx: "ds", q: `Is x greater than y?\nI. x âˆ’ y = 3\nII. xÂ² = 25`, o: DS_OPTS, a: 0, sol: `I gives x = y + 3, so x > y always. II gives x = Â±5 and says nothing about y.` },
  { id: "B24", s: "reasoning", t: "Data Sufficiency", ctx: "ds", q: `How is M related to N?\nI. M is the son of N's sister.\nII. N is the only brother of K.`, o: DS_OPTS, a: 0, sol: `From I, M is N's nephew. II does not mention M at all.` },
  { id: "B25", s: "reasoning", t: "Analogies & Classification", q: `Book : Author :: Statue : ?`, o: ["Painter", "Sculptor", "Museum", "Stone"], a: 1, sol: `A book is created by an author; a statue is created by a sculptor.` },
  { id: "B26", s: "reasoning", t: "Analogies & Classification", q: `3 : 27 :: 5 : ?`, o: ["25", "75", "100", "125"], a: 3, sol: `27 = 3Â³, so the answer is 5Â³ = 125.` },
  { id: "B27", s: "reasoning", t: "Analogies & Classification", q: `Find the odd one out: Mercury, Venus, Moon, Mars`, o: ["Mercury", "Venus", "Moon", "Mars"], a: 2, sol: `The others are planets; the Moon is a natural satellite.` },
  { id: "B28", s: "reasoning", t: "Statements & Assumptions", q: `Statement: "The company will hire only candidates who clear the coding test."\nAssumptions: I. The coding test helps identify suitable candidates. II. All candidates will clear the coding test.`, o: ["Only I is implicit", "Only II is implicit", "Both are implicit", "Neither is implicit"], a: 0, sol: `The company would use the test only if it believes the test identifies good candidates. II contradicts the idea of a filter.` },
  { id: "B29", s: "reasoning", t: "Statements & Assumptions", q: `Statement: "Submit your assignment by Friday to avoid a penalty."\nAssumptions: I. Some students may submit late without a deadline. II. A penalty can discourage late submission.`, o: ["Only I is implicit", "Only II is implicit", "Both are implicit", "Neither is implicit"], a: 2, sol: `A deadline is set because late submission is possible (I), and a penalty is mentioned because it is expected to deter lateness (II).` },
  { id: "B30", s: "reasoning", t: "Statements & Assumptions", q: `Event I: The government raised fuel prices.\nEvent II: Bus fares increased.`, o: ["I is the cause and II is its effect", "II is the cause and I is its effect", "Both are independent causes", "Both are effects of a common cause"], a: 0, sol: `Higher fuel prices raise bus operating costs, which leads to higher fares.` },

  // ===================== VERBAL =====================
  { id: "C1", s: "verbal", t: "Synonyms", q: `DILIGENT`, o: ["Lazy", "Hardworking", "Clever", "Careless"], a: 1, sol: `Diligent means showing steady, careful effort. Lazy and careless are opposites.` },
  { id: "C2", s: "verbal", t: "Synonyms", q: `CANDID`, o: ["Frank", "Secretive", "Polite", "Shy"], a: 0, sol: `Candid means honest and open in what one says.` },
  { id: "C3", s: "verbal", t: "Synonyms", q: `ELOQUENT`, o: ["Silent", "Articulate", "Confused", "Rude"], a: 1, sol: `Eloquent means fluent and persuasive in speaking or writing.` },
  { id: "C4", s: "verbal", t: "Synonyms", q: `FRUGAL`, o: ["Wasteful", "Generous", "Thrifty", "Wealthy"], a: 2, sol: `Frugal means careful with money and avoiding waste.` },
  { id: "C5", s: "verbal", t: "Synonyms", q: `BENEVOLENT`, o: ["Cruel", "Kind", "Jealous", "Proud"], a: 1, sol: `Benevolent means well-meaning and generous towards others.` },
  { id: "C6", s: "verbal", t: "Antonyms", q: `AMPLE`, o: ["Plenty", "Insufficient", "Large", "Enough"], a: 1, sol: `Ample means more than enough; the opposite is insufficient.` },
  { id: "C7", s: "verbal", t: "Antonyms", q: `HOSTILE`, o: ["Aggressive", "Friendly", "Angry", "Strange"], a: 1, sol: `Hostile means unfriendly or opposed.` },
  { id: "C8", s: "verbal", t: "Antonyms", q: `RIGID`, o: ["Stiff", "Firm", "Flexible", "Strict"], a: 2, sol: `Rigid means unable to bend or change. The other three are near-synonyms.` },
  { id: "C9", s: "verbal", t: "Antonyms", q: `ARTIFICIAL`, o: ["Fake", "Natural", "Synthetic", "Man-made"], a: 1, sol: `Artificial means made by humans, not occurring in nature.` },
  { id: "C10", s: "verbal", t: "Antonyms", q: `VERBOSE`, o: ["Wordy", "Lengthy", "Concise", "Talkative"], a: 2, sol: `Verbose means using more words than needed; concise means brief and to the point.` },
  { id: "C11", s: "verbal", t: "Sentence Correction", q: `Choose the correct sentence.`, o: ["The news are very shocking.", "The news is very shocking.", "The newses are very shocking.", "The news were very shocking."], a: 1, sol: `"News" is an uncountable noun and always takes a singular verb.` },
  { id: "C12", s: "verbal", t: "Sentence Correction", q: `Choose the correct sentence.`, o: ["One of my friend is a doctor.", "One of my friends are a doctor.", "One of my friends is a doctor.", "One of my friend are a doctor."], a: 2, sol: `"One of" is followed by a plural noun (friends), but the verb agrees with "one", so it is singular (is).` },
  { id: "C13", s: "verbal", t: "Sentence Correction", q: `Choose the correct sentence.`, o: ["He has been working here since five years.", "He has been working here for five years.", "He is working here since five years.", "He works here from five years."], a: 1, sol: `Use "for" with a period of time (five years) and "since" with a point of time (since 2021). The present perfect continuous fits an action continuing to now.` },
  { id: "C14", s: "verbal", t: "Sentence Correction", q: `Choose the correct sentence.`, o: ["She prefers coffee than tea.", "She prefers coffee to tea.", "She prefers coffee over than tea.", "She is preferring coffee than tea."], a: 1, sol: `"Prefer" is followed by "to", not "than".` },
  { id: "C15", s: "verbal", t: "Sentence Correction", q: `Find the part with an error: "The team / have won / its first match / of the season."`, o: ["The team", "have won", "its first match", "of the season"], a: 1, sol: `The team is acting as one unit, as shown by "its", so the verb must be singular: "has won".` },
  { id: "C16", s: "verbal", t: "Fill in the Blanks", q: `He was accused ____ theft.`, o: ["for", "of", "with", "about"], a: 1, sol: `The fixed pattern is "accused of" a crime; compare "charged with".` },
  { id: "C17", s: "verbal", t: "Fill in the Blanks", q: `____ Ganga is a holy river.`, o: ["A", "An", "The", "No article"], a: 2, sol: `Names of rivers, oceans and mountain ranges take "the".` },
  { id: "C18", s: "verbal", t: "Fill in the Blanks", q: `I ____ this book for two hours, and I am still not finished.`, o: ["read", "am reading", "have been reading", "had read"], a: 2, sol: `An action that began in the past and continues now, with "for two hours", takes the present perfect continuous.` },
  { id: "C19", s: "verbal", t: "Fill in the Blanks", q: `If it rains tomorrow, we ____ the match.`, o: ["cancel", "will cancel", "would cancel", "cancelled"], a: 1, sol: `First conditional: if + present simple, will + base verb.` },
  { id: "C20", s: "verbal", t: "Fill in the Blanks", q: `Neither of the answers ____ correct.`, o: ["are", "is", "were", "have been"], a: 1, sol: `"Neither of" is singular and takes a singular verb.` },
  { id: "C21", s: "verbal", t: "Spellings & Improvement", q: `Choose the correctly spelt word.`, o: ["Definately", "Definitly", "Definitely", "Defenitely"], a: 2, sol: `It comes from "finite": de-fin-ite-ly.` },
  { id: "C22", s: "verbal", t: "Spellings & Improvement", q: `Choose the correctly spelt word.`, o: ["Seperate", "Separate", "Separete", "Seprate"], a: 1, sol: `Memory aid: there is "a rat" in sep-a-rat-e.` },
  { id: "C23", s: "verbal", t: "Spellings & Improvement", q: `Choose the correctly spelt word.`, o: ["Neccessary", "Necesary", "Necessary", "Neccesary"], a: 2, sol: `One c, double s: ne-c-e-ss-ary.` },
  { id: "C24", s: "verbal", t: "Spellings & Improvement", q: `Improve the sentence: "Hardly had he reached the station when the train left."`, o: ["than the train left", "then the train left", "as the train left", "No improvement"], a: 3, sol: `"Hardlyâ€¦when" and "Scarcelyâ€¦when" are correct pairs. "No sooner" is the one that pairs with "than".` },
  { id: "C25", s: "verbal", t: "Spellings & Improvement", q: `Improve the sentence: "He is senior than me in the office."`, o: ["senior to me", "more senior than me", "senior from me", "No improvement"], a: 0, sol: `Latin comparatives (senior, junior, superior, inferior, prior) take "to", not "than".` },
  { id: "C26", s: "verbal", t: "Reading Comprehension", ctx: "rc", q: `According to the passage, what drove most of the growth in solar power?`, o: ["Government bans on coal", "Falling panel prices", "Rising evening demand", "Cheap batteries"], a: 1, sol: `The second sentence says falling panel prices drove much of the growth.` },
  { id: "C27", s: "verbal", t: "Reading Comprehension", ctx: "rc", q: `What basic limitation of solar energy does the passage describe?`, o: ["Panels are too expensive", "Panels produce power only when the sun shines, while demand peaks in the evening", "Solar parks need too much land", "Coal is cheaper everywhere"], a: 1, sol: `This mismatch between supply and evening demand is stated directly.` },
  { id: "C28", s: "verbal", t: "Reading Comprehension", ctx: "rc", q: `What role does battery storage play?`, o: ["It replaces solar panels", "It stores daytime surplus and releases it after sunset", "It lowers coal tariffs", "It increases daytime demand"], a: 1, sol: `The passage says batteries hold the daytime surplus and release it after sunset.` },
  { id: "C29", s: "verbal", t: "Reading Comprehension", ctx: "rc", q: `According to many experts, what will decide how far renewables replace fossil fuels?`, o: ["Cheap panels", "Cheap storage", "Larger solar parks", "Lower coal tariffs"], a: 1, sol: `The last sentence names cheap storage, more than cheap panels.` },
  { id: "C30", s: "verbal", t: "Reading Comprehension", ctx: "rc", q: `The word "surplus" in the passage most nearly means:`, o: ["Shortage", "Excess", "Cost", "Demand"], a: 1, sol: `Surplus is the extra electricity produced in the day beyond what is needed.` },

  // ===================== TECHNICAL =====================
  { id: "D1", s: "technical", t: "Computer Fundamentals", q: `The decimal equivalent of hexadecimal 2F is:`, o: ["45", "47", "32", "215"], a: 1, sol: `2F = 2 Ã— 16 + 15 = 47.` },
  { id: "D2", s: "technical", t: "Computer Fundamentals", q: `1 KB (kilobyte) equals:`, o: ["1000 bits", "1000 bytes", "1024 bytes", "1024 bits"], a: 2, sol: `In binary units, 1 KB = 2Â¹â° bytes = 1024 bytes.` },
  { id: "D3", s: "technical", t: "Computer Fundamentals", q: `The 4-bit two's complement of 0101 is:`, o: ["1010", "1011", "0110", "1101"], a: 1, sol: `Invert the bits (1010), then add 1: 1011. This represents âˆ’5.` },
  { id: "D4", s: "technical", t: "Computer Fundamentals", q: `Which of the following is the fastest storage?`, o: ["Cache", "RAM", "Registers", "SSD"], a: 2, sol: `Speed order: registers > cache > RAM > SSD > hard disk. Registers sit inside the CPU.` },
  { id: "D5", s: "technical", t: "Computer Fundamentals", q: `Which of the following is NOT an input device?`, o: ["Keyboard", "Scanner", "Monitor", "Mouse"], a: 2, sol: `A monitor displays output; the others send data into the computer.` },
  { id: "D6", s: "technical", t: "Data Structures", q: `Which data structure is used in Breadth-First Search (BFS) of a graph?`, o: ["Stack", "Queue", "Heap", "Tree"], a: 1, sol: `BFS visits nodes level by level, which needs FIFO order. DFS uses a stack (or recursion).` },
  { id: "D7", s: "technical", t: "Data Structures", q: `The time complexity of inserting a node at the beginning of a singly linked list is:`, o: ["O(1)", "O(log n)", "O(n)", "O(nÂ²)"], a: 0, sol: `Point the new node to the current head and update head; no traversal is needed.` },
  { id: "D8", s: "technical", t: "Data Structures", q: `The postfix form of (A + B) Ã— C is:`, o: ["AB+CÃ—", "ABC+Ã—", "A+BCÃ—", "Ã—+ABC"], a: 0, sol: `The bracket is evaluated first: A + B becomes AB+, then multiply by C: AB+CÃ—.` },
  { id: "D9", s: "technical", t: "Data Structures", q: `Which sorting algorithm has a worst-case time complexity of O(n log n)?`, o: ["Quick sort", "Bubble sort", "Merge sort", "Insertion sort"], a: 2, sol: `Merge sort is always O(n log n). Quick sort is O(n log n) on average but O(nÂ²) in the worst case.` },
  { id: "D10", s: "technical", t: "Data Structures", q: `Which data structure is best for checking balanced parentheses in an expression?`, o: ["Queue", "Stack", "Array", "Graph"], a: 1, sol: `Push each opening bracket and pop when a matching closing bracket appears. Balanced if the stack is empty at the end.` },
  { id: "D11", s: "technical", t: "OOP & Java", q: `Which of the following is NOT a pillar of object-oriented programming?`, o: ["Encapsulation", "Inheritance", "Compilation", "Polymorphism"], a: 2, sol: `The four pillars are encapsulation, abstraction, inheritance and polymorphism.` },
  { id: "D12", s: "technical", t: "OOP & Java", q: `The default value of an uninitialised instance variable of type int in Java is:`, o: ["null", "0", "garbage value", "1"], a: 1, sol: `Instance and static fields get defaults (0, false, null). Local variables get no default and must be initialised before use.` },
  { id: "D13", s: "technical", t: "OOP & Java", q: `Which of the following cannot be instantiated directly in Java?`, o: ["Final class", "Abstract class", "Static nested class", "Concrete class"], a: 1, sol: `An abstract class may have abstract methods, so it must be extended and the subclass instantiated.` },
  { id: "D14", s: "technical", t: "OOP & Java", q: `Which keyword is used to call the parent class constructor in Java?`, o: ["this", "super", "parent", "extends"], a: 1, sol: `super(...) must be the first statement in the child constructor.` },
  { id: "D15", s: "technical", t: "OOP & Java", q: `Java achieves multiple inheritance of type through:`, o: ["Classes", "Interfaces", "Packages", "Constructors"], a: 1, sol: `A class can extend only one class but implement many interfaces.` },
  { id: "D16", s: "technical", t: "Code Output", q: `What is the output?`, code: `int a = 10, b = 3;
System.out.println(a / b + " " + a % b);`, o: ["3.33 1", "3 1", "3 0", "3.0 1"], a: 1, sol: `int / int is integer division: 10 / 3 = 3. 10 % 3 = 1.` },
  { id: "D17", s: "technical", t: "Code Output", q: `What is the output?`, code: `System.out.println(1 + 2 + "3" + 4 + 5);`, o: ["15", "12345", "3345", "339"], a: 2, sol: `Left to right: 1 + 2 = 3 (numbers). 3 + "3" = "33" (string). After that everything is concatenated: "334", then "3345".` },
  { id: "D18", s: "technical", t: "Code Output", q: `What is the output?`, code: `int[] arr = {1, 2, 3, 4, 5};
int sum = 0;
for (int i = 0; i < arr.length; i += 2) {
    sum += arr[i];
}
System.out.println(sum);`, o: ["6", "9", "15", "12"], a: 1, sol: `Indices 0, 2, 4 are visited: 1 + 3 + 5 = 9.` },
  { id: "D19", s: "technical", t: "Code Output", q: `What is the output?`, code: `StringBuilder sb = new StringBuilder("HCL");
sb.append("Tech").reverse();
System.out.println(sb);`, o: ["HCLTech", "hceTLCH", "LCHhceT", "TechHCL"], a: 1, sol: `StringBuilder is mutable. After append: "HCLTech". reverse() changes the same object to "hceTLCH".` },
  { id: "D20", s: "technical", t: "Code Output", q: `What is the output? (C)`, code: `int i = 0;
while (i < 3) {
    printf("%d ", i);
    i++;
}
printf("%d", i);`, o: ["0 1 2", "0 1 2 3", "1 2 3", "0 1 2 2"], a: 1, sol: `The loop prints 0, 1, 2. It stops when i becomes 3, and the final printf prints 3.` },
  { id: "D21", s: "technical", t: "Code Output", q: `What is the output?`, code: `class Test {
    static int count = 0;
    Test() { count++; }
    public static void main(String[] args) {
        new Test(); new Test(); new Test();
        System.out.println(count);
    }
}`, o: ["0", "1", "3", "Compilation error"], a: 2, sol: `A static field is shared by all objects. Each constructor call increments the same count, three times.` },
  { id: "D22", s: "technical", t: "Operating Systems", q: `Which CPU scheduling algorithm can cause starvation of low-priority processes?`, o: ["FCFS", "Round Robin", "Priority scheduling", "None of these"], a: 2, sol: `High-priority jobs can keep arriving, so low-priority ones may never run. Ageing (gradually raising priority) fixes this.` },
  { id: "D23", s: "technical", t: "Operating Systems", q: `Thrashing in an operating system is caused by:`, o: ["Too few processes", "Excessive paging", "A fast CPU", "Large cache"], a: 1, sol: `When processes lack enough frames, the system spends more time swapping pages than executing.` },
  { id: "D24", s: "technical", t: "Operating Systems", q: `A process that is in memory and waiting for the CPU is in which state?`, o: ["New", "Ready", "Running", "Waiting"], a: 1, sol: `Ready = waiting for CPU. Waiting (blocked) = waiting for I/O or an event.` },
  { id: "D25", s: "technical", t: "Operating Systems", q: `A semaphore is mainly used for:`, o: ["Memory allocation", "Process synchronisation", "File storage", "Disk scheduling"], a: 1, sol: `Semaphores use wait() and signal() to control access to shared resources and prevent race conditions.` },
  { id: "D26", s: "technical", t: "Operating Systems", q: `Virtual memory is commonly implemented using:`, o: ["Demand paging", "Cache memory", "Registers", "Spooling"], a: 0, sol: `Pages are loaded into RAM only when needed, so programs larger than physical memory can run.` },
  { id: "D27", s: "technical", t: "Computer Networks", q: `The IP address 192.168.1.1 belongs to which class?`, o: ["Class A", "Class B", "Class C", "Class D"], a: 2, sol: `First-octet ranges: A 1â€“126, B 128â€“191, C 192â€“223, D 224â€“239. 192 falls in Class C (and 192.168.x.x is a private range).` },
  { id: "D28", s: "technical", t: "Computer Networks", q: `Which protocol translates domain names into IP addresses?`, o: ["DHCP", "DNS", "ARP", "FTP"], a: 1, sol: `DNS resolves names to IP addresses. DHCP assigns IPs; ARP maps IP to MAC.` },
  { id: "D29", s: "technical", t: "Computer Networks", q: `Which transport-layer protocol is connection-oriented and reliable?`, o: ["UDP", "TCP", "IP", "ICMP"], a: 1, sol: `TCP uses a three-way handshake, acknowledgements and retransmission. UDP is connectionless and faster but unreliable.` },
  { id: "D30", s: "technical", t: "Computer Networks", q: `Which device operates at the Network layer of the OSI model?`, o: ["Hub", "Switch", "Router", "Repeater"], a: 2, sol: `Hub and repeater: Physical layer. Switch: Data Link layer. Router: Network layer (routes using IP addresses).` },
  { id: "D31", s: "technical", t: "Computer Networks", q: `Which protocol is used to send email?`, o: ["SMTP", "POP3", "IMAP", "HTTP"], a: 0, sol: `SMTP sends mail. POP3 and IMAP are used to retrieve it.` },
  { id: "D32", s: "technical", t: "DBMS & SQL", q: `Which key uniquely identifies each row and cannot contain NULL?`, o: ["Foreign key", "Candidate key", "Primary key", "Unique key"], a: 2, sol: `A primary key is unique and NOT NULL, and a table has only one. A unique key allows a NULL in most databases.` },
  { id: "D33", s: "technical", t: "DBMS & SQL", q: `Removing partial dependencies from a table in 1NF brings it to:`, o: ["2NF", "3NF", "BCNF", "4NF"], a: 0, sol: `2NF = 1NF with no partial dependency on part of a composite key. 3NF further removes transitive dependencies.` },
  { id: "D34", s: "technical", t: "DBMS & SQL", q: `Which command removes all rows but keeps the table structure, and cannot be rolled back in most databases?`, o: ["DELETE", "DROP", "TRUNCATE", "REMOVE"], a: 2, sol: `TRUNCATE is DDL and fast. DELETE is DML, can use WHERE and be rolled back. DROP removes the table itself.` },
  { id: "D35", s: "technical", t: "DBMS & SQL", ctx: "sql", q: `What does this query return on the sample table?`, code: `SELECT dept, AVG(salary)
FROM employee
GROUP BY dept
HAVING AVG(salary) > 45000;`, o: ["IT 55000", "IT 55000 and HR 40000", "HR 40000", "No rows"], a: 0, sol: `IT average = (50000 + 60000)/2 = 55000; HR average = 40000. HAVING keeps only groups above 45000.` },
  { id: "D36", s: "technical", t: "DBMS & SQL", q: `Which join returns all rows from the left table and matching rows from the right table?`, o: ["INNER JOIN", "LEFT JOIN", "RIGHT JOIN", "CROSS JOIN"], a: 1, sol: `Unmatched left rows still appear, with NULLs in the right table's columns.` },
  { id: "D37", s: "technical", t: "DBMS & SQL", ctx: "sql", q: `Which query returns the second highest salary?`, o: ["SELECT MAX(salary) FROM employee;", "SELECT MAX(salary) FROM employee WHERE salary < (SELECT MAX(salary) FROM employee);", "SELECT salary FROM employee ORDER BY salary;", "SELECT MIN(salary) FROM employee;"], a: 1, sol: `The subquery finds the highest salary (60000); the outer query finds the largest salary below it (50000). MySQL alternative: SELECT DISTINCT salary FROM employee ORDER BY salary DESC LIMIT 1 OFFSET 1;` },
];

/* ---------- Coding data ---------- */
const CODING = [
  {
    id: "E1", t: "OOP Programs", title: "Student Grade Calculator",
    prob: `Create a class Student with a name and marks in three subjects. Add methods average() and grade(): A if average â‰¥ 90, B if â‰¥ 75, C if â‰¥ 60, otherwise F. Input: name on line 1, three marks on line 2. Output: Name: <name>, Average: <avg to 2 decimals>, Grade: <grade>.`,
    sample: `Input:
Kiran
85 78 92

Output:
Name: Kiran, Average: 85.00, Grade: B`,
    code: `import java.util.Scanner;

class Student {
    private final String name;
    private final int[] marks;

    Student(String name, int m1, int m2, int m3) {
        this.name = name;
        this.marks = new int[]{m1, m2, m3};
    }

    double average() {
        int total = 0;
        for (int m : marks) total += m;
        return total / 3.0;
    }

    char grade() {
        double avg = average();
        if (avg >= 90) return 'A';
        if (avg >= 75) return 'B';
        if (avg >= 60) return 'C';
        return 'F';
    }

    String getName() { return name; }
}

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String name = sc.nextLine().trim();
        Student s = new Student(name, sc.nextInt(), sc.nextInt(), sc.nextInt());
        System.out.printf("Name: %s, Average: %.2f, Grade: %c%n",
                s.getName(), s.average(), s.grade());
    }
}`,
    exp: `Fields are private (encapsulation) and exposed through methods. Dividing by 3.0, not 3, avoids integer division. Trace: (85 + 78 + 92)/3.0 = 85.00, which falls in the â‰¥ 75 band, so grade B.`,
  },
  {
    id: "E2", t: "OOP Programs", title: "Shape Areas (Abstraction + Polymorphism)",
    prob: `Create an abstract class Shape with an abstract method area(), and subclasses Circle and Rectangle. Input: n, then n lines of "C r" or "R l b". Print each shape's area to 2 decimals, then the total.`,
    sample: `Input:
2
C 7
R 4 5

Output:
Circle: 153.94
Rectangle: 20.00
Total: 173.94`,
    code: `import java.util.Scanner;

abstract class Shape {
    abstract double area();
    abstract String name();
}

class Circle extends Shape {
    private final double r;
    Circle(double r) { this.r = r; }
    double area() { return Math.PI * r * r; }
    String name() { return "Circle"; }
}

class Rectangle extends Shape {
    private final double l, b;
    Rectangle(double l, double b) { this.l = l; this.b = b; }
    double area() { return l * b; }
    String name() { return "Rectangle"; }
}

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        Shape[] shapes = new Shape[n];
        for (int i = 0; i < n; i++) {
            String type = sc.next();
            if (type.equals("C")) {
                shapes[i] = new Circle(sc.nextDouble());
            } else {
                shapes[i] = new Rectangle(sc.nextDouble(), sc.nextDouble());
            }
        }
        double total = 0;
        for (Shape s : shapes) {
            System.out.printf("%s: %.2f%n", s.name(), s.area());
            total += s.area();
        }
        System.out.printf("Total: %.2f%n", total);
    }
}`,
    exp: `The array is of type Shape, but each call to area() runs the subclass version at run time â€” run-time polymorphism (method overriding). Circle area = Ï€ Ã— 49 â‰ˆ 153.94.`,
  },
  {
    id: "E3", t: "String Programs", title: "Palindrome Check (Ignore Case and Symbols)",
    prob: `Given a line of text, print true if it reads the same forwards and backwards considering only letters and digits (case-insensitive), else false.`,
    sample: `Input: A man, a plan, a canal: Panama   â†’ Output: true
Input: race a car                       â†’ Output: false`,
    code: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String s = sc.nextLine();
        int i = 0, j = s.length() - 1;
        boolean ok = true;
        while (i < j) {
            char a = s.charAt(i), b = s.charAt(j);
            if (!Character.isLetterOrDigit(a)) { i++; continue; }
            if (!Character.isLetterOrDigit(b)) { j--; continue; }
            if (Character.toLowerCase(a) != Character.toLowerCase(b)) {
                ok = false;
                break;
            }
            i++;
            j--;
        }
        System.out.println(ok);
    }
}`,
    exp: `Two pointers move inward, skipping non-alphanumeric characters. O(n) time, O(1) extra space; no new string is built.`,
  },
  {
    id: "E4", t: "String Programs", title: "Count Vowels and Consonants",
    prob: `Given a line, print the number of vowels and consonants (letters only; ignore spaces, digits and symbols).`,
    sample: `Input:
HCL Technologies

Output:
Vowels: 5, Consonants: 10`,
    code: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String s = sc.nextLine().toLowerCase();
        int vowels = 0, consonants = 0;
        for (char c : s.toCharArray()) {
            if (c >= 'a' && c <= 'z') {
                if ("aeiou".indexOf(c) >= 0) vowels++;
                else consonants++;
            }
        }
        System.out.println("Vowels: " + vowels + ", Consonants: " + consonants);
    }
}`,
    exp: `Lower-case first so one check covers both cases. Only characters aâ€“z are counted. Trace: vowels e, o, o, i, e = 5; the other 10 letters are consonants.`,
  },
  {
    id: "E5", t: "String Programs", title: "Anagram Check",
    prob: `Given two words (letters only), print true if they are anagrams (same letters, same counts), ignoring case.`,
    sample: `Input: listen silent   â†’ Output: true
Input: hello world     â†’ Output: false`,
    code: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String a = sc.next().toLowerCase();
        String b = sc.next().toLowerCase();
        if (a.length() != b.length()) {
            System.out.println(false);
            return;
        }
        int[] count = new int[26];
        for (int i = 0; i < a.length(); i++) {
            count[a.charAt(i) - 'a']++;
            count[b.charAt(i) - 'a']--;
        }
        for (int c : count) {
            if (c != 0) {
                System.out.println(false);
                return;
            }
        }
        System.out.println(true);
    }
}`,
    exp: `Add counts for the first word and subtract for the second. If every count ends at zero, the words are anagrams. O(n) time, better than sorting (O(n log n)).`,
  },
  {
    id: "E6", t: "String Programs", title: "Reverse the Order of Words",
    prob: `Given a sentence, print its words in reverse order separated by single spaces.`,
    sample: `Input:
HCL is hiring freshers

Output:
freshers hiring is HCL`,
    code: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String[] words = sc.nextLine().trim().split("\\\\s+");
        StringBuilder sb = new StringBuilder();
        for (int i = words.length - 1; i >= 0; i--) {
            sb.append(words[i]);
            if (i > 0) sb.append(' ');
        }
        System.out.println(sb);
    }
}`,
    exp: `split("\\\\s+") handles multiple spaces between words. StringBuilder avoids creating a new String on every append.`,
  },
  {
    id: "E7", t: "Array & Number Programs", title: "Move All Zeros to the End",
    prob: `Given n integers, move all zeros to the end while keeping the order of the non-zero elements. Input: n on line 1, the array on line 2.`,
    sample: `Input:
5
0 1 0 3 12

Output:
1 3 12 0 0`,
    code: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[] a = new int[n];
        for (int i = 0; i < n; i++) a[i] = sc.nextInt();

        int pos = 0;
        for (int i = 0; i < n; i++) {
            if (a[i] != 0) a[pos++] = a[i];
        }
        while (pos < n) a[pos++] = 0;

        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < n; i++) {
            sb.append(a[i]);
            if (i < n - 1) sb.append(' ');
        }
        System.out.println(sb);
    }
}`,
    exp: `pos marks where the next non-zero goes. After copying all non-zeros forward in order, fill the rest with zeros. O(n) time, in place.`,
  },
  {
    id: "E8", t: "Array & Number Programs", title: "Find the Missing Number",
    prob: `The numbers 1 to n are given with exactly one missing. Input: n on line 1, then the n âˆ’ 1 numbers. Print the missing number.`,
    sample: `Input:
5
1 2 4 5

Output:
3`,
    code: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        long expected = (long) n * (n + 1) / 2;
        long actual = 0;
        for (int i = 0; i < n - 1; i++) actual += sc.nextInt();
        System.out.println(expected - actual);
    }
}`,
    exp: `Sum of 1..n = n(n + 1)/2 = 15 for n = 5. Given sum = 12, so 3 is missing. Using long prevents overflow for large n.`,
  },
  {
    id: "E9", t: "Array & Number Programs", title: "Pair with a Given Sum",
    prob: `Given n integers and a target, print the first pair (in order of discovery) whose sum equals the target, else -1. Input: n, the array, then the target.`,
    sample: `Input:
4
2 7 11 15
9

Output:
2 7`,
    code: `import java.util.HashSet;
import java.util.Scanner;
import java.util.Set;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[] a = new int[n];
        for (int i = 0; i < n; i++) a[i] = sc.nextInt();
        int target = sc.nextInt();

        Set<Integer> seen = new HashSet<>();
        for (int x : a) {
            if (seen.contains(target - x)) {
                System.out.println((target - x) + " " + x);
                return;
            }
            seen.add(x);
        }
        System.out.println(-1);
    }
}`,
    exp: `For each element, check whether its complement (target âˆ’ x) has already been seen. A HashSet gives O(1) lookups, so the scan is O(n) instead of O(nÂ²) with nested loops.`,
  },
  {
    id: "E10", t: "Array & Number Programs", title: "Armstrong Number",
    prob: `A number is an Armstrong number if the sum of its digits, each raised to the power of the number of digits, equals the number itself. Print Yes or No.`,
    sample: `153 â†’ Yes
9474 â†’ Yes
123 â†’ No`,
    code: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int digits = String.valueOf(n).length();
        int sum = 0, temp = n;
        while (temp > 0) {
            int d = temp % 10;
            sum += (int) Math.pow(d, digits);
            temp /= 10;
        }
        System.out.println(sum == n ? "Yes" : "No");
    }
}`,
    exp: `Extract digits with % 10 and / 10. For 153 (3 digits): 27 + 125 + 1 = 153, so Yes. For 123: 1 + 8 + 27 = 36, so No. Keep the original n separately, since temp is destroyed by the loop.`,
  },
  {
    id: "E11", t: "JDBC & SQL", title: "JDBC Update and Delete with a Transaction",
    prob: `Table: employee(id INT PRIMARY KEY, name VARCHAR(50), dept VARCHAR(20), salary DOUBLE). As a single transaction, (1) give every employee in the IT department a 10% raise, and (2) delete the employee with id 105. Commit if both succeed; otherwise roll back. Print the number of rows affected.`,
    sample: `Expected output (example):
4 rows updated, 1 row deleted`,
    code: `import java.sql.*;

public class EmployeeUpdate {
    private static final String URL  = "jdbc:mysql://localhost:3306/hcl_db";
    private static final String USER = "root";
    private static final String PASS = "password";

    public static void main(String[] args) {
        String raiseSql  = "UPDATE employee SET salary = salary * 1.10 WHERE dept = ?";
        String deleteSql = "DELETE FROM employee WHERE id = ?";

        try (Connection con = DriverManager.getConnection(URL, USER, PASS)) {
            con.setAutoCommit(false);
            try (PreparedStatement raise = con.prepareStatement(raiseSql);
                 PreparedStatement delete = con.prepareStatement(deleteSql)) {

                raise.setString(1, "IT");
                int updated = raise.executeUpdate();

                delete.setInt(1, 105);
                int deleted = delete.executeUpdate();

                con.commit();
                System.out.println(updated + " rows updated, " + deleted + " row deleted");
            } catch (SQLException e) {
                con.rollback();
                System.out.println("Rolled back: " + e.getMessage());
            }
        } catch (SQLException e) {
            System.out.println("Connection error: " + e.getMessage());
        }
    }
}`,
    exp: `setAutoCommit(false) groups both statements into one transaction; commit() saves both, rollback() undoes both if either fails (atomicity). executeUpdate() returns rows affected. "?" placeholders in a PreparedStatement prevent SQL injection. try-with-resources closes everything automatically. Interview favourites: JDBC steps; Statement vs PreparedStatement vs CallableStatement; executeQuery vs executeUpdate vs execute; why rs.next() is called before reading the first row.`,
  },
  {
    id: "E12", t: "JDBC & SQL", title: "SQL Query Practice (6 Queries)",
    prob: `Tables: employee(id, name, dept_id, salary) and department(dept_id, dept_name). Write queries for: (1) top 3 highest-paid employees; (2) employee count per department including empty ones; (3) employees earning above the company average; (4) employees not in any existing department; (5) second highest salary; (6) highest-paid employee in each department.`,
    sample: `Write each query, then compare with the solution.`,
    lang: "sql",
    code: `-- 1. Top 3 highest-paid employees
SELECT name, salary
FROM employee
ORDER BY salary DESC
LIMIT 3;

-- 2. Employee count per department (empty departments show 0)
SELECT d.dept_name, COUNT(e.id) AS emp_count
FROM department d
LEFT JOIN employee e ON e.dept_id = d.dept_id
GROUP BY d.dept_name;

-- 3. Employees earning more than the company average
SELECT name, salary
FROM employee
WHERE salary > (SELECT AVG(salary) FROM employee);

-- 4. Employees not assigned to any existing department
SELECT e.name
FROM employee e
LEFT JOIN department d ON e.dept_id = d.dept_id
WHERE d.dept_id IS NULL;

-- 5. Second highest salary
SELECT MAX(salary) AS second_highest
FROM employee
WHERE salary < (SELECT MAX(salary) FROM employee);

-- 6. Highest-paid employee in each department (correlated subquery)
SELECT e.name, e.dept_id, e.salary
FROM employee e
WHERE e.salary = (
    SELECT MAX(salary)
    FROM employee
    WHERE dept_id = e.dept_id
);`,
    exp: `(2) COUNT(e.id) counts only matched rows, so empty departments show 0 â€” COUNT(*) would wrongly show 1. (4) The LEFT JOIN + IS NULL pattern catches both NULL dept_ids and dept_ids missing from the department table. (6) The inner query runs once per outer row using that row's dept_id; ties return every top earner.`,
  },
];

/* ---------- Persistence helpers (safe if storage is unavailable) ---------- */
const STORE_KEY = "hcl_qbank_v1";
const loadState = () => {
  try {
    const raw = window.localStorage.getItem(STORE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};
const saveState = (state) => {
  try {
    window.localStorage.setItem(STORE_KEY, JSON.stringify(state));
  } catch {
    /* ignore */
  }
};

const LETTERS = ["a", "b", "c", "d"];

/* ---------- Styles ---------- */
const CSS = `
:root{--bg:#f0f4ff;--card:#ffffff;--ink:#0f172a;--muted:#64748b;--line:#e2e8f0;
  --brand:#6366f1;--brand2:#8b5cf6;--brand-soft:#eef2ff;
  --ok:#059669;--ok-soft:#d1fae5;--bad:#ef4444;--bad-soft:#fee2e2;
  --warn:#f59e0b;--code:#0f172a;
  --quant:#f97316;--reasoning:#06b6d4;--verbal:#10b981;--technical:#8b5cf6;--coding:#ec4899;}
.hq{font-family:system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;background:var(--bg);color:var(--ink);min-height:100vh;}
.hq *{box-sizing:border-box;margin:0;padding:0;}

/* -------- Hero Banner -------- */
.hq-banner{background:linear-gradient(135deg,#4338ca 0%,#7c3aed 45%,#c026d3 100%);
  padding:28px 20px 24px;position:relative;overflow:hidden;}
.hq-banner::after{content:'';position:absolute;top:-60px;right:-60px;width:220px;height:220px;
  background:rgba(255,255,255,0.07);border-radius:50%;pointer-events:none;}
.hq-banner::before{content:'';position:absolute;bottom:-40px;left:100px;width:150px;height:150px;
  background:rgba(255,255,255,0.05);border-radius:50%;pointer-events:none;}
.hq-banner-inner{max-width:980px;margin:0 auto;position:relative;z-index:1;}
.hq-head{display:flex;flex-wrap:wrap;gap:16px;align-items:flex-start;justify-content:space-between;}
.hq-title{font-size:26px;font-weight:900;color:#fff;line-height:1.2;letter-spacing:-0.02em;text-shadow:0 2px 12px rgba(0,0,0,0.18);}
.hq-sub{color:rgba(255,255,255,0.78);font-size:14px;margin-top:7px;font-weight:400;}
.hq-overall{min-width:220px;}
.hq-bar{height:10px;background:rgba(255,255,255,0.2);border-radius:99px;overflow:hidden;margin-bottom:5px;}
.hq-bar>div{height:100%;background:linear-gradient(90deg,#34d399,#6ee7b7,#a7f3d0);border-radius:99px;transition:width .5s ease;}
.hq-small{font-size:12px;color:rgba(255,255,255,0.72);font-weight:500;}

/* -------- Sticky Tab Bar -------- */
.hq-tabs-wrap{background:#fff;border-bottom:2px solid var(--line);position:sticky;top:0;z-index:100;
  box-shadow:0 2px 12px rgba(0,0,0,0.07);}
.hq-tabs{display:flex;gap:0;overflow-x:auto;max-width:980px;margin:0 auto;padding:0 8px;scrollbar-width:none;}
.hq-tabs::-webkit-scrollbar{display:none;}
.hq-tab{border:none;background:none;padding:13px 15px;cursor:pointer;font-size:13.5px;font-weight:600;
  white-space:nowrap;color:var(--muted);border-bottom:3px solid transparent;
  transition:color .2s,border-color .2s;display:flex;align-items:center;gap:6px;}
.hq-tab:hover{color:var(--ink);}
.hq-tab.on-quant{color:var(--quant);border-bottom-color:var(--quant);}
.hq-tab.on-reasoning{color:var(--reasoning);border-bottom-color:var(--reasoning);}
.hq-tab.on-verbal{color:var(--verbal);border-bottom-color:var(--verbal);}
.hq-tab.on-technical{color:var(--technical);border-bottom-color:var(--technical);}
.hq-tab.on-coding{color:var(--coding);border-bottom-color:var(--coding);}
.hq-tab .ct{font-size:11px;background:var(--line);border-radius:99px;padding:1px 8px;font-weight:700;color:var(--muted);transition:all .2s;}
.hq-tab.on-quant .ct{background:#fff3e0;color:var(--quant);}
.hq-tab.on-reasoning .ct{background:#e0f7fa;color:var(--reasoning);}
.hq-tab.on-verbal .ct{background:#e0f2f1;color:var(--verbal);}
.hq-tab.on-technical .ct{background:#f3e8ff;color:var(--technical);}
.hq-tab.on-coding .ct{background:#fce4ec;color:var(--coding);}
.tab-icon{font-size:15px;}

/* -------- Main Content -------- */
.hq-wrap{max-width:980px;margin:0 auto;padding:20px 16px 64px;}

/* -------- Stats Cards -------- */
.hq-stats{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:16px;}
.hq-stat{background:var(--card);border-radius:16px;padding:18px 16px 14px;
  box-shadow:0 2px 8px rgba(0,0,0,0.06);position:relative;overflow:hidden;border:1.5px solid transparent;}
.hq-stat::before{content:'';position:absolute;top:0;left:0;right:0;height:4px;border-radius:16px 16px 0 0;}
.hq-stat:nth-child(1)::before{background:linear-gradient(90deg,#6366f1,#8b5cf6);}
.hq-stat:nth-child(2)::before{background:linear-gradient(90deg,#06b6d4,#0ea5e9);}
.hq-stat:nth-child(3)::before{background:linear-gradient(90deg,#10b981,#34d399);}
.hq-stat:nth-child(4)::before{background:linear-gradient(90deg,#f59e0b,#f97316);}
.hq-stat b{display:block;font-size:30px;font-weight:900;letter-spacing:-0.03em;margin-bottom:3px;}
.hq-stat span{font-size:12px;color:var(--muted);font-weight:500;}

/* -------- Toolbar -------- */
.hq-tools{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:14px;
  background:var(--card);border-radius:16px;padding:12px 14px;
  box-shadow:0 2px 8px rgba(0,0,0,0.06);}
.hq-tools input,.hq-tools select{border:1.5px solid var(--line);background:#f8fafc;
  border-radius:10px;padding:9px 12px;font-size:14px;color:var(--ink);
  transition:border-color .2s,box-shadow .2s;outline:none;}
.hq-tools input:focus,.hq-tools select:focus{border-color:var(--brand);box-shadow:0 0 0 3px rgba(99,102,241,0.12);}
.hq-tools input{flex:1;min-width:180px;}
.hq-tools select{cursor:pointer;}
.hq-btn{border:1.5px solid var(--line);background:#f8fafc;border-radius:10px;padding:9px 14px;
  font-size:13px;font-weight:600;cursor:pointer;color:var(--muted);transition:all .2s;}
.hq-btn:hover{border-color:#ef4444;color:#ef4444;background:#fff5f5;}
.hq-btn.pri{background:linear-gradient(135deg,#6366f1,#8b5cf6);color:#fff;
  border:none;box-shadow:0 4px 14px rgba(99,102,241,0.35);transition:all .2s;}
.hq-btn.pri:hover{box-shadow:0 6px 20px rgba(99,102,241,0.5);transform:translateY(-1px);}

/* -------- Tip box -------- */
.hq-tip{background:linear-gradient(135deg,#eef2ff,#f5f3ff);
  border:1.5px solid #c7d2fe;border-radius:14px;
  padding:14px 16px 14px 44px;font-size:14px;margin-bottom:14px;line-height:1.65;
  position:relative;}
.hq-tip::before{content:"💡";position:absolute;left:14px;top:14px;font-size:18px;}

/* -------- Question Cards -------- */
.hq-card{background:var(--card);border-radius:18px;padding:22px;margin-bottom:14px;
  box-shadow:0 2px 10px rgba(0,0,0,0.06);border:1.5px solid var(--line);
  transition:box-shadow .25s,border-color .25s,transform .15s;}
.hq-card:hover{box-shadow:0 8px 24px rgba(0,0,0,0.1);border-color:#c7d2fe;transform:translateY(-2px);}
.hq-card[data-section="quant"]{border-top:4px solid var(--quant);}
.hq-card[data-section="reasoning"]{border-top:4px solid var(--reasoning);}
.hq-card[data-section="verbal"]{border-top:4px solid var(--verbal);}
.hq-card[data-section="technical"]{border-top:4px solid var(--technical);}
.hq-card[data-section="coding"]{border-top:4px solid var(--coding);}

/* -------- Meta row -------- */
.hq-meta{display:flex;align-items:center;gap:8px;margin-bottom:12px;flex-wrap:wrap;}
.hq-id{font-weight:800;font-size:12px;background:linear-gradient(135deg,#6366f1,#8b5cf6);
  color:#fff;border-radius:8px;padding:3px 10px;letter-spacing:.03em;}
.hq-chip{font-size:11px;font-weight:700;border-radius:99px;padding:3px 11px;color:#fff;}
.hq-chip-topic{background:linear-gradient(135deg,#64748b,#94a3b8);}
.hq-chip-correct{background:linear-gradient(135deg,#059669,#10b981);}
.hq-chip-wrong{background:linear-gradient(135deg,#ef4444,#f87171);}
.hq-chip-solved{background:linear-gradient(135deg,#059669,#10b981);}
.hq-star{margin-left:auto;background:none;border:none;font-size:22px;cursor:pointer;
  color:#cbd5e1;transition:color .2s,transform .15s;}
.hq-star:hover{color:#fbbf24;transform:scale(1.25);}
.hq-star.on{color:#f59e0b;}

/* -------- Question + Context -------- */
.hq-q{font-size:15.5px;line-height:1.7;white-space:pre-line;margin-bottom:14px;
  color:var(--ink);font-weight:500;}
.hq-ctx{background:linear-gradient(135deg,#f8fafc,#f0f4ff);
  border:1.5px dashed #94a3b8;border-radius:12px;
  padding:14px 16px;font-size:13.5px;line-height:1.65;
  color:#475569;margin-bottom:14px;white-space:pre-wrap;font-style:italic;}

/* -------- Code block -------- */
.hq-pre{background:linear-gradient(160deg,#0f172a,#1e293b);color:#e2e8f0;
  border-radius:12px;padding:16px;font-size:13px;line-height:1.65;
  overflow-x:auto;margin-bottom:14px;
  font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;
  border:1px solid #334155;}

/* -------- Option buttons -------- */
.hq-opts{display:grid;gap:10px;}
.hq-opt{display:flex;gap:12px;align-items:flex-start;text-align:left;
  border:1.5px solid var(--line);background:#f8fafc;
  border-radius:12px;padding:12px 14px;font-size:14px;cursor:pointer;
  color:var(--ink);line-height:1.5;transition:all .2s;font-weight:500;}
.hq-opt:hover:not(:disabled){border-color:#6366f1;background:#eef2ff;transform:translateX(5px);}
.hq-opt:disabled{cursor:default;}
.hq-opt .lt{font-weight:800;color:#6366f1;min-width:22px;font-size:12px;
  background:#eef2ff;border-radius:6px;padding:2px 7px;text-align:center;flex-shrink:0;}
.hq-opt.ok{border-color:var(--ok);background:var(--ok-soft);}
.hq-opt.ok .lt{background:var(--ok);color:#fff;}
.hq-opt.bad{border-color:var(--bad);background:var(--bad-soft);}
.hq-opt.bad .lt{background:var(--bad);color:#fff;}

/* -------- Solution block -------- */
.hq-sol{margin-top:14px;border-radius:12px;padding:14px 16px;font-size:14px;
  line-height:1.65;background:#f8fafc;border-left:4px solid #94a3b8;}
.hq-sol.ok{border-left-color:var(--ok);background:var(--ok-soft);}
.hq-sol.bad{border-left-color:var(--bad);background:var(--bad-soft);}

/* -------- Action row -------- */
.hq-actions{display:flex;gap:8px;margin-top:14px;flex-wrap:wrap;align-items:center;}

/* -------- Empty state -------- */
.hq-empty{text-align:center;padding:64px 0;color:var(--muted);}
.hq-empty-icon{font-size:48px;display:block;margin-bottom:12px;}
.hq-empty-msg{font-size:16px;font-weight:500;}

/* -------- Coding card extras -------- */
.hq-h3{font-size:17px;font-weight:700;margin-bottom:9px;color:var(--ink);}
.hq-label{font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.07em;
  color:var(--muted);margin:16px 0 7px;display:flex;align-items:center;gap:8px;}
.hq-label::after{content:"";flex:1;height:1px;background:var(--line);}
.hq-check{display:flex;align-items:center;gap:8px;font-size:13px;cursor:pointer;
  font-weight:500;color:var(--ink);}
.hq-check input{width:16px;height:16px;accent-color:var(--ok);cursor:pointer;}

/* -------- Responsive -------- */
@media(max-width:640px){
  .hq-stats{grid-template-columns:repeat(2,1fr);}
  .hq-title{font-size:20px;}
  .hq-stat b{font-size:24px;}
  .hq-card{padding:16px;}
}
`;

/* ---------- Section icons ---------- */
const SECTION_META = {
  quant:     { icon: "🔢", color: "#f97316" },
  reasoning: { icon: "🧩", color: "#06b6d4" },
  verbal:    { icon: "📝", color: "#10b981" },
  technical: { icon: "💻", color: "#8b5cf6" },
  coding:    { icon: "⚡", color: "#ec4899" },
};

/* ---------- MCQ card ---------- */
function McqCard({ item, chosen, revealed, starred, onChoose, onReveal, onStar, onRetry }) {
  const answered = chosen !== undefined;
  const show = answered || revealed;
  const correct = answered && chosen === item.a;
  return (
    <div className="hq-card" data-section={item.s}>
      <div className="hq-meta">
        <span className="hq-id">{item.id}</span>
        <span className="hq-chip hq-chip-topic">{item.t}</span>
        {answered && (
          <span className={`hq-chip ${correct ? "hq-chip-correct" : "hq-chip-wrong"}`}>
            {correct ? "✓ Correct" : "✗ Wrong"}
          </span>
        )}
        <button className={`hq-star ${starred ? "on" : ""}`} onClick={onStar} title="Bookmark">
          {starred ? "★" : "☆"}
        </button>
      </div>
      {item.ctx && <div className="hq-ctx">{CONTEXTS[item.ctx]}</div>}
      <p className="hq-q">{item.q}</p>
      {item.code && <pre className="hq-pre">{item.code}</pre>}
      <div className="hq-opts">
        {item.o.map((opt, i) => {
          let cls = "hq-opt";
          if (show && i === item.a) cls += " ok";
          else if (answered && i === chosen) cls += " bad";
          return (
            <button key={i} className={cls} disabled={answered} onClick={() => onChoose(i)}>
              <span className="lt">{LETTERS[i]}</span>
              <span>{opt}</span>
            </button>
          );
        })}
      </div>
      {show && (
        <div className={`hq-sol ${answered ? (correct ? "ok" : "bad") : ""}`}>
          <strong>Answer: ({LETTERS[item.a]}) {item.o[item.a]}.</strong>{" "}{item.sol}
        </div>
      )}
      <div className="hq-actions">
        {!show && <button className="hq-btn pri" onClick={onReveal}>💡 Show solution</button>}
        {answered && <button className="hq-btn" onClick={onRetry}>🔄 Try again</button>}
      </div>
    </div>
  );
}

/* ---------- Coding card ---------- */
function CodingCard({ item, open, solved, starred, onToggle, onSolved, onStar }) {
  return (
    <div className="hq-card" data-section="coding">
      <div className="hq-meta">
        <span className="hq-id">{item.id}</span>
        <span className="hq-chip hq-chip-topic">{item.t}</span>
        {solved && <span className="hq-chip hq-chip-solved">✓ Solved</span>}
        <button className={`hq-star ${starred ? "on" : ""}`} onClick={onStar} title="Bookmark">
          {starred ? "★" : "☆"}
        </button>
      </div>
      <h3 className="hq-h3">{item.title}</h3>
      <p className="hq-q">{item.prob}</p>
      <div className="hq-label">Sample Input / Output</div>
      <pre className="hq-pre">{item.sample}</pre>
      <div className="hq-actions">
        <button className={`hq-btn ${open ? "" : "pri"}`} onClick={onToggle}>
          {open ? "🙈 Hide solution" : "👁️ Show solution"}
        </button>
        <label className="hq-check">
          <input type="checkbox" checked={!!solved} onChange={onSolved} />
          I solved this on my own
        </label>
      </div>
      {open && (
        <>
          <div className="hq-label">Solution ({item.lang === "sql" ? "SQL" : "Java"})</div>
          <pre className="hq-pre">{item.code}</pre>
          <div className="hq-sol">{item.exp}</div>
        </>
      )}
    </div>
  );
}

/* ---------- Main app ---------- */
export default function HCLQuestionBank() {
  const saved = typeof window !== "undefined" ? loadState() : null;
  const [section, setSection] = useState("quant");
  const [topic, setTopic] = useState("All");
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [answers, setAnswers] = useState(saved?.answers || {});
  const [revealed, setRevealed] = useState({});
  const [stars, setStars] = useState(saved?.stars || {});
  const [solved, setSolved] = useState(saved?.solved || {});
  const [openCode, setOpenCode] = useState({});

  useEffect(() => {
    saveState({ answers, stars, solved });
  }, [answers, stars, solved]);

  const isCoding = section === "coding";
  const pool = isCoding ? CODING : MCQ.filter((m) => m.s === section);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const topics = useMemo(() => ["All", ...Array.from(new Set(pool.map((p) => p.t)))], [section]);

  const list = pool.filter((item) => {
    if (topic !== "All" && item.t !== topic) return false;
    if (query.trim()) {
      const hay = [item.id, item.t, item.q, item.title, item.prob, ...(item.o || [])].join(" ").toLowerCase();
      if (!hay.includes(query.trim().toLowerCase())) return false;
    }
    if (filter === "starred" && !stars[item.id]) return false;
    if (!isCoding) {
      if (filter === "unattempted" && answers[item.id] !== undefined) return false;
      if (filter === "wrong" && !(answers[item.id] !== undefined && answers[item.id] !== item.a)) return false;
    } else {
      if (filter === "unattempted" && solved[item.id]) return false;
      if (filter === "wrong") return false;
    }
    return true;
  });

  const sectionStats = (key) => {
    if (key === "coding") {
      const done = CODING.filter((c) => solved[c.id]).length;
      return { total: CODING.length, attempted: done, correct: done };
    }
    const items = MCQ.filter((m) => m.s === key);
    const attempted = items.filter((m) => answers[m.id] !== undefined).length;
    const correct = items.filter((m) => answers[m.id] === m.a).length;
    return { total: items.length, attempted, correct };
  };

  const totalItems = MCQ.length + CODING.length;
  const totalDone = Object.keys(answers).length + Object.values(solved).filter(Boolean).length;
  const st = sectionStats(section);
  const accuracy = st.attempted ? Math.round((st.correct / st.attempted) * 100) : 0;

  const changeSection = (key) => {
    setSection(key);
    setTopic("All");
    setFilter("all");
  };

  const resetSection = () => {
    if (!window.confirm("Reset progress for this section?")) return;
    const ids = new Set(pool.map((p) => p.id));
    const strip = (obj) => Object.fromEntries(Object.entries(obj).filter(([k]) => !ids.has(k)));
    setAnswers(strip(answers));
    setSolved(strip(solved));
    setRevealed(strip(revealed));
    setOpenCode(strip(openCode));
  };

  const secMeta = SECTION_META[section];

  return (
    <div className="hq">
      <style>{CSS}</style>

      {/* ── Hero Banner ── */}
      <div className="hq-banner">
        <div className="hq-banner-inner">
          <div className="hq-head">
            <div>
              <h1 className="hq-title">🎯 HCL On-Campus Drive 2026 – Question Bank</h1>
              <p className="hq-sub">Phase I practice · {MCQ.length} MCQs + {CODING.length} coding problems with full solutions</p>
            </div>
            <div className="hq-overall">
              <div className="hq-bar"><div style={{ width: `${(totalDone / totalItems) * 100}%` }} /></div>
              <div className="hq-small">Overall progress: {totalDone} / {totalItems} completed</div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Section Tabs ── */}
      <div className="hq-tabs-wrap">
        <div className="hq-tabs">
          {SECTIONS.map((s) => {
            const ss = sectionStats(s.key);
            const meta = SECTION_META[s.key];
            return (
              <button
                key={s.key}
                className={`hq-tab ${section === s.key ? `on-${s.key}` : ""}`}
                onClick={() => changeSection(s.key)}
              >
                <span className="tab-icon">{meta.icon}</span>
                {s.short}
                <span className="ct">{ss.attempted}/{ss.total}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="hq-wrap">
        {/* ── Stats ── */}
        <div className="hq-stats">
          <div className="hq-stat">
            <b style={{ color: secMeta.color }}>{st.total}</b>
            <span>{isCoding ? "Problems" : "Questions"}</span>
          </div>
          <div className="hq-stat">
            <b style={{ color: "#0ea5e9" }}>{st.attempted}</b>
            <span>{isCoding ? "Solved" : "Attempted"}</span>
          </div>
          <div className="hq-stat">
            <b style={{ color: "#059669" }}>{isCoding ? st.total - st.attempted : st.correct}</b>
            <span>{isCoding ? "Remaining" : "Correct"}</span>
          </div>
          <div className="hq-stat">
            <b style={{ color: isCoding ? "#f59e0b" : accuracy >= 70 ? "#059669" : st.attempted ? "#ef4444" : "#64748b" }}>
              {isCoding ? `${Math.round((st.attempted / st.total) * 100)}%` : `${accuracy}%`}
            </b>
            <span>{isCoding ? "Completion" : "Accuracy (target 70%)"}</span>
          </div>
        </div>

        {/* ── Toolbar ── */}
        <div className="hq-tools">
          <input
            placeholder="🔍  Search questions, topics, options…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <select value={topic} onChange={(e) => setTopic(e.target.value)}>
            {topics.map((t) => <option key={t} value={t}>{t === "All" ? "All topics" : t}</option>)}
          </select>
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="all">All questions</option>
            <option value="unattempted">{isCoding ? "Not solved" : "Unattempted"}</option>
            {!isCoding && <option value="wrong">Wrong answers</option>}
            <option value="starred">⭐ Bookmarked</option>
          </select>
          <button className="hq-btn" onClick={resetSection}>🔁 Reset section</button>
        </div>

        {/* ── Tip box ── */}
        {topic !== "All" && TIPS[topic] && (
          <div className="hq-tip">
            <strong>Key formulas / method:</strong> {TIPS[topic]}
          </div>
        )}

        {/* ── Empty state ── */}
        {list.length === 0 && (
          <div className="hq-empty">
            <span className="hq-empty-icon">🔍</span>
            <p className="hq-empty-msg">No items match these filters.</p>
          </div>
        )}

        {/* ── MCQ cards ── */}
        {!isCoding && list.map((item) => (
          <McqCard
            key={item.id}
            item={item}
            chosen={answers[item.id]}
            revealed={revealed[item.id]}
            starred={stars[item.id]}
            onChoose={(i) => setAnswers({ ...answers, [item.id]: i })}
            onReveal={() => setRevealed({ ...revealed, [item.id]: true })}
            onStar={() => setStars({ ...stars, [item.id]: !stars[item.id] })}
            onRetry={() => {
              const next = { ...answers };
              delete next[item.id];
              setAnswers(next);
              setRevealed({ ...revealed, [item.id]: false });
            }}
          />
        ))}

        {/* ── Coding cards ── */}
        {isCoding && list.map((item) => (
          <CodingCard
            key={item.id}
            item={item}
            open={openCode[item.id]}
            solved={solved[item.id]}
            starred={stars[item.id]}
            onToggle={() => setOpenCode({ ...openCode, [item.id]: !openCode[item.id] })}
            onSolved={() => setSolved({ ...solved, [item.id]: !solved[item.id] })}
            onStar={() => setStars({ ...stars, [item.id]: !stars[item.id] })}
          />
        ))}
      </div>
    </div>
  );
}