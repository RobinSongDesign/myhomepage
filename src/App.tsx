import { useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import Chatbot from './components/Chatbot'
import WeChatModal from './components/WeChatModal'
import BackToTop from './components/BackToTop'
import { UiProvider } from './context/UiContext'
import Home from './pages/Home'
import About from './pages/About'
import StableShapePage from './pages/projects/StableShapePage'
import SegPage from './pages/projects/SegPage'
import BuildingGeneratorPage from './pages/projects/BuildingGeneratorPage'
import ProbabilityPage from './pages/projects/ProbabilityPage'
import StillPage from './pages/projects/StillPage'
import YokaiPage from './pages/projects/YokaiPage'
import FormForcePage from './pages/projects/FormForcePage'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior })
  }, [pathname])
  return null
}

export default function App() {
  return (
    <UiProvider>
      <ScrollToTop />
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/projects/code/stable-shape" element={<StableShapePage />} />
          <Route path="/projects/code/seg-predict" element={<SegPage />} />
          <Route path="/projects/code/building-generator" element={<BuildingGeneratorPage />} />
          <Route path="/projects/design/probability" element={<ProbabilityPage />} />
          <Route path="/projects/design/still" element={<StillPage />} />
          <Route path="/projects/design/yokai-hall" element={<YokaiPage />} />
          <Route path="/projects/design/form-force" element={<FormForcePage />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </main>
      <Footer />
      <Chatbot />
      <BackToTop />
      <WeChatModal />
    </UiProvider>
  )
}
