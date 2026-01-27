import { Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react"

import Navbar from "./components/layout/Navbar"
import FilterOptions from "./components/layout/FilterOptions"
import BadgeGrid from "./components/badges/BadgeGrid"
import Footer from "./components/layout/Footer"

import AdminPage from "./pages/AdminPage";

function App() {
  const [activeCategory, setActiveCategory] = useState("all")
  const [badgeSearch, setBadgeSearch] = useState("");
  const [user, setUser] = useState(null)

  useEffect(() => {
    fetch("/api/me", {
      credentials: "include"
    })
      .then(res => res.json())
      .then(data => setUser(data))
  }, [])

  return (
  <div className="app">
    <div className="background-blur-1"></div>
    <div className="background-blur-2"></div>
    <Navbar user={user} />

    <main className="page">
      <Routes>
        <Route
          path="/"
          element={
            <>
              <FilterOptions
                activeCategory={activeCategory}
                onCategoryChange={setActiveCategory}
                setBadgeSearch={setBadgeSearch}
              />
              <BadgeGrid
                user={user}
                activeCategory={activeCategory}
                badgeSearch={badgeSearch}
              />
            </>
          }
        />

        <Route path="/admin" element={<AdminPage />} />
      </Routes>
    </main>

    <Footer />
  </div>
);}

export default App
