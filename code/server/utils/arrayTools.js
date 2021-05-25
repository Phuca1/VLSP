const shuffleArray = (arr, shuffleTimes = 1) => {
  const len = arr.length;
  for (t = 0; t < shuffleTimes; t++) {
    for (let i = 0; i < len; i++) {
      let x = Math.floor(Math.random() * len);
      const t = arr[i];
      arr[i] = arr[x];
      arr[x] = t;
    }
  }
  return arr;
};

module.exports = {
  shuffleArray,
};
