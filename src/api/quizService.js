import API from './axios'

export const getQuizzes = async () => {
  const response = await API.get('/api/quiz/')
  return response.data
}

export const getQuizById = async (id) => {
  const response = await API.get(`/api/quiz/${id}`)
  return response.data
}

export const createQuiz = async (data) => {
  const response = await API.post('/api/quiz/', data)
  return response.data
}

export const updateQuiz = async (id, data) => {
  const response = await API.put(`/api/quiz/${id}`, data)
  return response.data
}

export const deleteQuiz = async (id) => {
  const response = await API.delete(`/api/quiz/${id}`)
  return response.data
}

export const publishQuiz = async (id) => {
  const response = await API.patch(`/api/quiz/${id}/publish`)
  return response.data
}