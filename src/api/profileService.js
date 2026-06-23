import API from './axios'

export const getProfile = async () => {
  const response = await API.get('/api/profile/')
  return response.data
}

export const updateProfile = async (data) => {
  const response = await API.put('/api/profile/', data)
  return response.data
}

export const updatePassword = async (data) => {
  const response = await API.put('/api/profile/password', data)
  return response.data
}

export const deleteAccount = async () => {
  const response = await API.delete('/api/profile/')
  return response.data
}