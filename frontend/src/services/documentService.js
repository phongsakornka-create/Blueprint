import api from "./api";

export const documentService = {
  async getDocuments(params = {}) {
    const response = await api.get("/documents", { params });
    return response.data;
  },

  async uploadDocument(formData) {
    const response = await api.post("/documents", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  async deleteDocument(id) {
    const response = await api.delete(`/documents/${id}`);
    return response.data;
  },
};
