export function shuffle(x) {
  let currentIndex = x.length, randomIndex;
  while (currentIndex != 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [x[currentIndex], x[randomIndex]] = [x[randomIndex], x[currentIndex]];
  }
  return x
}
  
export function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array
}