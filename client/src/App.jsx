import { Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react"

import Navbar from "./components/layout/Navbar"
import FilterBar from "./components/layout/FilterBar"
import BadgeGrid from "./components/badges/BadgeGrid"
import Footer from "./components/layout/Footer"

import AdminPage from "./pages/AdminPage";

function App() {
  const [activeCategory, setActiveCategory] = useState("all")
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
    <Navbar user={user} />

    <main className="page">
      <Routes>
        <Route
          path="/"
          element={
            <>
              <FilterBar
                activeCategory={activeCategory}
                onCategoryChange={setActiveCategory}
              />
              <BadgeGrid
                user={user}
                activeCategory={activeCategory}
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
