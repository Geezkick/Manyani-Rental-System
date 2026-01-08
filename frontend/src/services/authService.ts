import api from './api'

export const authService = {
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),

  register: (userData: any) =>
    api.post('/auth/register', userData),

  getProfile: () =>
    api.get('/auth/me'),

  updateProfile: (userData: any) =>
    api.put('/auth/profile', userData),

  changePassword: (currentPassword: string, newPassword: string) =>
    api.put('/auth/change-password', { currentPassword, newPassword }),

  uploadProfilePicture: (formData: FormData) =>
    api.post('/auth/upload-profile', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }),
}
