import { createContext, useContext, useState, useEffect } from "react";
import { authService, userService } from "../services";
import { auth } from "../firebase/config";
import { onAuthStateChanged } from "firebase/auth";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem("token") || "");
  const [loading, setLoading] = useState(true);
  const [isProfileComplete, setIsProfileComplete] = useState(true);

  const fetchUser = async (authToken) => {
    try {
      const res = await authService.getMe(authToken);
      if (res.data?.status === "success") {
        setUser(res.data.data.user);
        setIsProfileComplete(res.data.data.is_profile_complete);
      }
    } catch {
      // Token expired / invalid
      localStorage.removeItem("token");
      setToken("");
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // Auto-check session saat app pertama kali dimuat
  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    if (savedToken) {
      fetchUser(savedToken);
    } else {
      setLoading(false);
    }
  }, []);

  // Sinkronisasi otomatis foto profil terbaru dari Google/Gmail jika akun terhubung
  useEffect(() => {
    if (!auth) return;
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          // Selalu reload untuk mendapatkan foto profil Google paling mutakhir
          await firebaseUser.reload();
        } catch {
          // Abaikan jika offline / rate limit
        }
        const freshPhoto = firebaseUser.photoURL;
        if (freshPhoto) {
          setUser((prevUser) => {
            if (!prevUser) return prevUser;
            // Jika foto profil di Google berbeda dari yang tersimpan, langsung perbarui tampilan
            if (prevUser.avatar !== freshPhoto) {
              const updated = { ...prevUser, avatar: freshPhoto };
              const savedToken = localStorage.getItem("token");
              if (savedToken) {
                const formData = new FormData();
                formData.append("name", prevUser.name || firebaseUser.displayName || "Pengguna");
                formData.append("avatar", freshPhoto);
                if (prevUser.kelas) {
                  formData.append("kelas", prevUser.kelas);
                }
                userService.updateProfile(formData).catch(() => {});
              }
              return updated;
            }
            return prevUser;
          });
        }
      }
    });

    return () => unsubscribe();
  }, []);

  const login = async (email, password) => {
    const res = await authService.login(email, password);
    if (res.data?.status === "success") {
      const { user: userData, token: authToken, is_profile_complete } = res.data.data;
      setUser(userData);
      setToken(authToken);
      setIsProfileComplete(is_profile_complete);
      localStorage.setItem("token", authToken);
      return { user: userData, isProfileComplete: is_profile_complete };
    }
    throw new Error(res.data?.message || "Login gagal");
  };

  const register = async (name, email, password) => {
    const res = await authService.register(name, email, password);
    if (res.data?.status === "success") {
      const { user: userData, token: authToken, is_profile_complete } = res.data.data;
      setUser(userData);
      setToken(authToken);
      setIsProfileComplete(is_profile_complete);
      localStorage.setItem("token", authToken);
      return { user: userData, isProfileComplete: is_profile_complete };
    }
    throw new Error(res.data?.message || "Registrasi gagal");
  };

  const loginGoogle = async (idToken, photoURL = null) => {
    const res = await authService.loginGoogle(idToken, photoURL);
    if (res.data?.status === "success") {
      const { user: userData, token: authToken, is_profile_complete } = res.data.data;
      const finalUser = photoURL && (!userData.avatar || userData.avatar !== photoURL)
        ? { ...userData, avatar: photoURL }
        : userData;
      setUser(finalUser);
      setToken(authToken);
      setIsProfileComplete(is_profile_complete);
      localStorage.setItem("token", authToken);
      return { user: finalUser, isProfileComplete: is_profile_complete };
    }
    throw new Error(res.data?.message || "Google login gagal");
  };

  const completeProfile = async (name, kelas) => {
    const res = await authService.completeProfile(name, kelas);
    if (res.data?.status === "success") {
      setUser(res.data.data);
      setIsProfileComplete(true);
      return res.data.data;
    }
    throw new Error("Gagal menyimpan profil");
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch {
      // silently fail
    }
    setUser(null);
    setToken("");
    setIsProfileComplete(true);
    localStorage.removeItem("token");
  };

  const isLoggedIn = !!user && !!token;
  const isAdmin = user?.role === "admin";
  const isGuru = user?.role === "guru";
  const isSiswa = user?.role === "siswa";

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isLoggedIn,
        isAdmin,
        isGuru,
        isSiswa,
        isProfileComplete,
        login,
        register,
        loginGoogle,
        completeProfile,
        logout,
        fetchUser,
        setUser,
        updateUser: (updatedData) => setUser((prev) => ({ ...prev, ...updatedData })),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// oxlint-disable-next-line react/only-export-components
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth harus dipakai di dalam <AuthProvider>");
  }
  return context;
}
