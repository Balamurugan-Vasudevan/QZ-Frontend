import API from './axios'

export const getPublicQuizzes = async () => {
  const response = await API.get('/api/attempt/quizzes')
  return response.data
}

export const getPublicQuiz = async (id) => {
  const response = await API.get(`/api/attempt/quizzes/${id}`)
  return response.data
}

export const submitAttempt = async (data) => {
  const response = await API.post('/api/attempt/submit', data)
  return response.data
}

export const getMyAttempts = async () => {
  const response = await API.get('/api/attempt/my-attempts')
  return response.data
}

export const getQuizResults = async (quizId) => {
  const response = await API.get(`/api/attempt/quiz/${quizId}/results`)
  return response.data
}