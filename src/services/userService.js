import api from "./api";

export const userService = {
  updateProfile: (formData) => {
    return api.post("/user/profile", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  getAdminUsers: () => {
    return api.get("/admin/users");
  },

  getAdminUserDetail: (id) => {
    return api.get(`/admin/users/${id}`);
  },

  createAdminUser: (payload) => {
    return api.post("/admin/users", payload);
  },

  updateAdminUser: (id, payload) => {
    return api.put(`/admin/users/${id}`, payload);
  },

  deleteAdminUser: (id) => {
    return api.delete(`/admin/users/${id}`);
  },

  resetAdminUserPassword: (id) => {
    return api.post(`/admin/users/${id}/reset-password`);
  },
};

export default userService;
