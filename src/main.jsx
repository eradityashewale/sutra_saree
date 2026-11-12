import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import App from './App.jsx'
import { EnquiryProvider } from './lib/enquiry.jsx'
import { initAnalytics } from './lib/analytics.js'
import './index.css'

gsap.registerPlugin(ScrollTrigger)
initAnalytics() // captures ?utm_source=… before anything renders

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <EnquiryProvider>
      <App />
    </EnquiryProvider>
  </StrictMode>,
)
