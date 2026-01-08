import api from './api'

export const propertyService = {
  getAll: (params?: any) =>
    api.get('/properties', { params }).then(res => res.data),

  getById: (id: string) =>
    api.get(`/properties/${id}`).then(res => res.data),

  create: (propertyData: any) =>
    api.post('/properties', propertyData).then(res => res.data),

  update: (id: string, propertyData: any) =>
    api.put(`/properties/${id}`, propertyData).then(res => res.data),

  delete: (id: string) =>
    api.delete(`/properties/${id}`).then(res => res.data),

  search: (query: string) =>
    api.get('/properties/search', { params: { q: query } }).then(res => res.data),

  getUnits: (propertyId: string) =>
    api.get(`/properties/${propertyId}/units`).then(res => res.data),

  addUnit: (propertyId: string, unitData: any) =>
    api.post(`/properties/${propertyId}/units`, unitData).then(res => res.data),

  updateUnit: (propertyId: string, unitId: string, unitData: any) =>
    api.put(`/properties/${propertyId}/units/${unitId}`, unitData).then(res => res.data),

  deleteUnit: (propertyId: string, unitId: string) =>
    api.delete(`/properties/${propertyId}/units/${unitId}`).then(res => res.data),

  uploadPhotos: (propertyId: string, formData: FormData) =>
    api.post(`/properties/${propertyId}/upload-photos`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }).then(res => res.data),
}
