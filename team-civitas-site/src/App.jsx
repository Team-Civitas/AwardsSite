import './App.css'

import Navbar from "./components/layout/Navbar"
import FilterBar from "./components/layout/FilterBar"
import BadgeGrid from "./components/badges/BadgeGrid"
import Footer from "./components/layout/Footer"


function App() {
  return (
    <>
      <Navbar />
      <div className="page">
        <FilterBar />
        <BadgeGrid />
      </div>
      <Footer />
    </>
  )
}

export default App
