import { useState } from "react"

import Navbar from "./components/layout/Navbar"
import FilterBar from "./components/layout/FilterBar"
import BadgeGrid from "./components/badges/BadgeGrid"
import Footer from "./components/layout/Footer"

function App() {
  const [activeCategory, setActiveCategory] = useState("all")

  return (
    <div className="app">
      <Navbar />

      <main className="page">
        <FilterBar 
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
        />

        <BadgeGrid activeCategory={activeCategory} />
      </main>

      <Footer />
    </div>
  )
}

export default App
