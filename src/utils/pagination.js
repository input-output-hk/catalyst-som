export const getPagination = (page, size) => {
  const limit = size ? + size : 25
  const from = page ? page * limit : 0
  const to = (page ? from + size : size) - 1

  return { from, to }
}
