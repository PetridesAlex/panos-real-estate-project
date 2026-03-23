import { Navigate, Route, Routes, useParams } from 'react-router-dom'
import Home from '../pages/Home'
import Properties from '../pages/Properties'
import PropertyDetails from '../pages/PropertyDetails'
import About from '../pages/About'
import Services from '../pages/Services'
import Developments from '../pages/Developments'
import Agents from '../pages/Agents'
import Contact from '../pages/Contact'
import NotFound from '../pages/NotFound'

function LegacyPropertyRedirect() {
  const { slug } = useParams()
  return <Navigate to={`/properties/${slug}`} replace />
}

function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/buy" element={<Properties />} />
      <Route path="/rent" element={<Properties />} />
      <Route path="/new-developments" element={<Properties />} />
      <Route path="/featured-properties" element={<Properties />} />
      <Route path="/signature-listings" element={<Properties />} />
      <Route path="/properties" element={<Properties />} />
      <Route path="/properties/limassol" element={<Properties />} />
      <Route path="/properties/paphos" element={<Properties />} />
      <Route path="/properties/nicosia" element={<Properties />} />
      <Route path="/properties/larnaca" element={<Properties />} />
      <Route path="/properties/protaras" element={<Properties />} />
      <Route path="/properties/ayia-napa" element={<Properties />} />
      <Route path="/property/:slug" element={<LegacyPropertyRedirect />} />
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
