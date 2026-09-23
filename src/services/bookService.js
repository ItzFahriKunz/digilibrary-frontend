import api from "./api";

export const bookService = {
  getBooks: (params = { per_page: 100 }) => {
    return api.get("/books", { params });
  },

  getBookDetail: (id) => {
    return api.get(`/books/${id}`);
  },

  createBook: (formData) => {
    return api.post("/admin/books", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  updateBook: (id, formData) => {
    return api.post(`/admin/books/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  deleteBook: (id) => {
    return api.delete(`/admin/books/${id}`);
  },

  trackReading: (bookId, payload) => {
    return api.post(`/books/${bookId}/track-read`, payload);
  },

  getReadingHistory: () => {
    return api.get("/user/reading-history");
  },
};

export default bookService;
