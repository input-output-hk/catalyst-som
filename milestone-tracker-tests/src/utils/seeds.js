const stringSeed = () => {
  return (Math.random() + 1).toString(36).substring()
}

const numberSeed = () => {
  const max = 100
  const min = 1
  return Math.floor(Math.random() * (max - min + 1) + min)
}

const stringBase = 'Lorem ipsum '
const numberBase = 1000

export {
  stringBase,
  stringSeed,
  numberBase,
  numberSeed
}
