export const getTimeElapsed = (dateString) => {
  const now = new Date()
  const past = new Date(dateString)
  const diffInMs = now - past
  
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60))
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60))
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24))
  const diffInWeeks = Math.floor(diffInDays / 7)
  const diffInMonths = Math.floor(diffInDays / 30)
  const diffInYears = Math.floor(diffInDays / 365)
  
  if (diffInYears > 0) {
    return `${diffInYears} year${diffInYears > 1 ? 's' : ''} ago`
  }
  
  if (diffInMonths > 0) {
    return `${diffInMonths} month${diffInMonths > 1 ? 's' : ''} ago`
  }
  
  if (diffInWeeks > 0) {
    return `${diffInWeeks} week${diffInWeeks > 1 ? 's' : ''} ago`
  }
  
  if (diffInDays > 0) {
    return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`
  }
  
  if (diffInHours > 0) {
    return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`
  }
  
  if (diffInMinutes > 0) {
    return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`
  }
  
  return 'Just now'
}

export const formatTimeElapsed = (dateString, format = 'short') => {
  if (format === 'short') {
    return getTimeElapsed(dateString)
  }
  
  // Long format with exact time
  const now = new Date()
  const past = new Date(dateString)
  const diffInMs = now - past
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24))
  const diffInHours = Math.floor((diffInMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const diffInMinutes = Math.floor((diffInMs % (1000 * 60 * 60)) / (1000 * 60))
  
  if (diffInDays > 0) {
    return `${diffInDays}d ${diffInHours}h ${diffInMinutes}m ago`
  }
  
  if (diffInHours > 0) {
    return `${diffInHours}h ${diffInMinutes}m ago`
  }
  
  return `${diffInMinutes}m ago`
} 