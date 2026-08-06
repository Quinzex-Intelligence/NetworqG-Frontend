import fs from 'fs';

const officialIndia = [
  // 1. Gujarat & Rann of Kutch
  [68.1, 23.7], [68.8, 24.2], [69.8, 24.5], [71.0, 24.6], [71.8, 24.2],
  // Gulf of Kutch & Kathiawar peninsula
  [70.5, 23.0], [69.2, 22.5], [68.9, 22.3], [69.6, 21.6], [70.3, 20.9], [71.0, 20.7], [71.8, 21.0],
  // Gulf of Khambhat
  [72.2, 21.7], [72.6, 22.2], [72.9, 21.7], [72.8, 20.5],
  // West Coast (Maharashtra, Goa, Karnataka, Kerala -> Kanyakumari)
  [72.8, 19.0], [73.2, 17.0], [73.8, 15.5], [74.5, 14.0], [74.8, 12.8],
  [75.6, 11.2], [76.2, 9.9],  [76.9, 8.8],  [77.5, 8.1],

  // 2. East Coast (Tamil Nadu, Andhra, Odisha, West Bengal)
  [78.1, 8.8],  [79.3, 9.3],  [79.8, 10.3], [79.8, 11.8], [80.3, 13.1],
  [80.1, 14.5], [80.8, 15.8], [81.8, 16.2], [82.8, 17.2], [83.3, 17.7], [84.2, 18.8],
  [85.0, 19.4], [85.8, 19.8], [86.7, 20.7], [87.3, 21.5],
  [88.0, 21.6], [88.8, 21.6], [89.1, 22.0],

  // 3. Bangladesh border & North-East States
  [88.8, 22.8], [88.6, 24.0], [88.1, 24.8], [88.2, 26.3], // Chicken's neck
  [91.3, 24.0], [91.3, 23.0], [91.8, 22.9], [91.8, 24.0], [92.4, 23.8], [92.5, 22.4], [92.8, 21.9], // Tripura & Mizoram fingers
  [93.2, 23.0], [93.2, 24.2], [94.3, 24.3], [94.7, 25.4], [95.1, 26.3], // Manipur & Nagaland
  [96.3, 27.2], [97.0, 27.8], [97.4, 28.2], // Arunachal east tip
  [97.0, 28.6], [96.0, 28.7], [95.0, 29.0], [93.8, 28.8], [92.5, 27.8], // Arunachal north LAC
  [92.1, 26.8], [91.5, 26.8], [89.8, 26.8], // Bhutan south
  [88.9, 27.1], [88.8, 28.1], [88.6, 28.0], [88.1, 27.2], // Sikkim finger
  [88.1, 26.5], [86.5, 26.5], [85.0, 26.8], [83.5, 27.4], [81.0, 28.6], [80.2, 28.8], // Nepal south

  // 4. Uttarakhand, Himachal & Jammu & Kashmir / Ladakh Crown
  [80.3, 29.8], [81.1, 30.3], [80.2, 31.3], [78.8, 31.4], [77.7, 30.4], // Uttarakhand
  [77.6, 31.4], [78.8, 32.3], [76.8, 32.8], // Himachal
  [75.8, 32.4], [74.5, 32.8], [74.0, 33.8], [73.5, 34.5], // J&K West
  [73.2, 35.2], [74.0, 36.2], [74.5, 37.0], [75.5, 37.1], // Gilgit-Baltistan top apex
  [77.0, 36.5], [78.0, 35.8], [79.0, 35.5], [79.8, 34.5], // Aksai Chin / Ladakh top right
  [79.2, 33.2], [78.5, 32.6], // Ladakh East

  // 5. Punjab, Rajasthan & Gujarat Western border
  [75.0, 32.5], [74.6, 31.6], [74.4, 30.5], // Punjab
  [73.8, 29.8], [72.0, 28.4], [70.5, 27.2], [70.0, 26.5], [70.2, 25.0], // Rajasthan
  [69.5, 24.5], [68.8, 24.0], [68.1, 23.7] // Back to Sir Creek start
];

console.log(`Official India points count: ${officialIndia.length}`);

let maxDist = 0;
for (let i = 1; i < officialIndia.length; i++) {
  const a = officialIndia[i-1];
  const b = officialIndia[i];
  const dist = Math.hypot(b[0]-a[0], b[1]-a[1]);
  if (dist > maxDist) maxDist = dist;
  if (dist > 2.5) {
    console.log(`Step ${i}: dist ${dist.toFixed(2)} deg from [${a}] to [${b}]`);
  }
}
console.log(`Max step distance: ${maxDist.toFixed(2)} deg`);
