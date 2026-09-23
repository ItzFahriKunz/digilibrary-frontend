import api from "./api";

export const adminService = {
  getStats: () => {
    return api.get("/admin/stats");
  },
};

export default adminService;
