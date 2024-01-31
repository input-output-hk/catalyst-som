// id 1 is Fund9, others follow sequentially
const DB_ID_OFFSET = 8

const getFundIdFromName = (name) => {
  const extractedNumber = /[0-9]*/.exec(name)
  return extractedNumber - DB_ID_OFFSET;
}

const getShortNameFromId = (fundId) => {
  return `f${fundId + DB_ID_OFFSET}`
}

export {
  getFundIdFromName,
  getShortNameFromId
}