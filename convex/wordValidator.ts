

/**
 * Generate a random set of letters
 * Ensures at least some vowels for playability
 */
export function generateLetters(count: number = 7): string[] {
  const vowels = ['A', 'E', 'I', 'O', 'U'];
  const consonants = ['B', 'C', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'M', 'N', 'P', 'R', 'S', 'T', 'V', 'W', 'Y'];

  const letters: string[] = [];
  const numVowels = Math.floor(count / 3); // About 1/3 vowels
  const numConsonants = count - numVowels;

  // Add random vowels
  for (let i = 0; i < numVowels; i++) {
    letters.push(vowels[Math.floor(Math.random() * vowels.length)]);
  }

  // Add random consonants
  for (let i = 0; i < numConsonants; i++) {
    letters.push(consonants[Math.floor(Math.random() * consonants.length)]);
  }

  // Shuffle the letters
  return letters.sort(() => Math.random() - 0.5);
}
