import api from "./api";

export const authService = {
  getMe: (authToken) => {
    const config = authToken
      ? { headers: { Authorization: `Bearer ${authToken}` } }
      : undefined;
    return api.get("/auth/me", config);
  },

  login: (email, password) => {
    return api.post("/auth/login", { email, password });
  },

  register: (name, email, password) => {
    return api.post("/auth/register", { name, email, password });
  },

  loginGoogle: (idToken, photoURL = null) => {
    const payload = { token: idToken };
    if (photoURL) {
      payload.avatar = photoURL;
    }
    return api.post("/auth/google", payload);
  },

  completeProfile: (name, kelas) => {
    return api.put("/auth/complete-profile", { name, kelas });
  },

  logout: () => {
    return api.post("/auth/logout");
  },

  forgotPassword: (email) => {
    return api.post("/auth/forgot-password", { email });
  },

  verifyOtp: (email, token) => {
    return api.post("/auth/verify-otp", { email, token });
  },

  resetPassword: (payload) => {
    return api.post("/auth/reset-password", payload);
  },

  changePassword: (payload) => {
    return api.put("/user/password", payload);
  },
};

export default authService;
