import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { LANDING_PREVIEW_BOOKS } from "../data/landingBooks";

// Modular Components
import LandingHeader from "../components/landing/LandingHeader";
import LandingHero from "../components/landing/LandingHero";
import LandingStats from "../components/landing/LandingStats";
import LandingCategories from "../components/landing/LandingCategories";
import LandingBookShowcase from "../components/landing/LandingBookShowcase";
import LandingFeatures from "../components/landing/LandingFeatures";
import LandingCurriculum from "../components/landing/LandingCurriculum";
import LandingTestimonials from "../components/landing/LandingTestimonials";
import LandingFaq from "../components/landing/LandingFaq";
import LandingFooter from "../components/landing/LandingFooter";

export default function LandingPage() {
  const { isLoggedIn, user } = useAuth();
  const navigate = useNavigate();

  const [selectedCategory, setSelectedCategory] = useState("Semua Koleksi");
  const [searchQuery, setSearchQuery] = useState("");

  // Handler klik buku / action:
  // - Belum login -> direct ke /login
  // - Sudah login -> direct ke /dashboard (User Dashboard, admin juga bisa akses)
  const handleActionClick = () => {
    if (!isLoggedIn) {
      navigate("/login");
    } else {
      navigate("/dashboard");
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD] text-[#1A1A1A] font-sans antialiased selection:bg-[#E7F3EC] selection:text-[#39BF81] flex flex-col">
      <LandingHeader isLoggedIn={isLoggedIn} user={user} />

      <main className="flex-1">
        <LandingHero
          featuredBook={LANDING_PREVIEW_BOOKS[0]}
          onActionClick={handleActionClick}
        />

        <LandingStats />

        <LandingCategories
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />

        <LandingBookShowcase
          books={LANDING_PREVIEW_BOOKS}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onBookClick={handleActionClick}
        />

        <LandingFeatures />

        <LandingCurriculum onActionClick={handleActionClick} />

        <LandingTestimonials />

        <LandingFaq />
      </main>

      <LandingFooter onActionClick={handleActionClick} />
    </div>
  );
}
