import API from './axios'

export const registerUser = async (data) => {
  const response = await API.post('/api/auth/register', data)
  return response.data
}

export const loginUser = async (data) => {
  const response = await API.post('/api/auth/login', data)
  return response.data
}

export const getMe = async () => {
  const response = await API.get('/api/auth/me')
  return response.data
}