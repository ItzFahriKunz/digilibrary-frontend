import api from "./api";

export const teacherService = {
  getClassOverview: (classCode) => {
    return api.get(`/guru/overview?kelas=${classCode}`);
  },
};

export default teacherService;
