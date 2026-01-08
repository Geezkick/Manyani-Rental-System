import api from './api'

export const propertyService = {
  getAll: (params?: any) =>
    api.get('/properties', { params }),

  getById: (id: string) =>
    api.get(`/properties/${id}`),

  create: (propertyData: any) =>
    api.post('/properties', propertyData),

  update: (id: string, propertyData: any) =>
    api.put(`/properties/${id}`, propertyData),

  delete: (id: string) =>
    api.delete(`/properties/${id}`),

  search: (query: string) =>
    api.get('/properties/search', { params: { q: query } }),

  getUnits: (propertyId: string) =>
    api.get(`/properties/${propertyId}/units`),

  addUnit: (propertyId: string, unitData: any) =>
    api.post(`/properties/${propertyId}/units`, unitData),

  updateUnit: (propertyId: string, unitId: string, unitData: any) =>
    api.put(`/properties/${propertyId}/units/${unitId}`, unitData),

  deleteUnit: (propertyId: string, unitId: string) =>
    api.delete(`/properties/${propertyId}/units/${unitId}`),

  uploadPhotos: (propertyId: string, formData: FormData) =>
    api.post(`/properties/${propertyId}/upload-photos`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }),
}
