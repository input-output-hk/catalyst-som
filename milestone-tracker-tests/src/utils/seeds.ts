const stringSeed = () => {
  return (Math.random() + 1).toString(36).substring(0)
}

const numberSeed = () => {
  const max = 100
  const min = 1
  return Math.floor(Math.random() * (max - min + 1) + min)
}

const stringBase = 'Lorem ipsum dolor sit amet, lorem ipsum dolor sit amet, lorem ipsum dolor sit amet '
const numberBase = 1000

export {
  stringBase,
  stringSeed,
  numberBase,
  numberSeed
}
