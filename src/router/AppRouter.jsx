import { Routes, Route } from 'react-router-dom'
import Home from '../pages/Home'
import Properties from '../pages/Properties'
import PropertyDetails from '../pages/PropertyDetails'
import About from '../pages/About'
import Services from '../pages/Services'
import Developments from '../pages/Developments'
import Agents from '../pages/Agents'
import Contact from '../pages/Contact'
import NotFound from '../pages/NotFound'

function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/properties" element={<Properties />} />
      <Route path="/properties/:slug" element={<PropertyDetails />} />
      <Route path="/about" element={<About />} />
      <Route path="/services" element={<Services />} />
      <Route path="/developments" element={<Developments />} />
      <Route path="/agents" element={<Agents />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default AppRouter
