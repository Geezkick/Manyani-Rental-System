import api from './api'

export const authService = {
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }).then(res => res.data),

  register: (userData: any) =>
    api.post('/auth/register', userData).then(res => res.data),

  getProfile: () =>
    api.get('/auth/me').then(res => res.data),

  updateProfile: (userData: any) =>
    api.put('/auth/profile', userData).then(res => res.data),

  changePassword: (currentPassword: string, newPassword: string) =>
    api.put('/auth/change-password', { currentPassword, newPassword }).then(res => res.data),

  uploadProfilePicture: (formData: FormData) =>
    api.post('/auth/upload-profile', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }).then(res => res.data),
}
