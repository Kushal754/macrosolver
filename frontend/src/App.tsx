// src/App.tsx
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Scanner from './pages/Scanner'

export default function App() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/escaner" element={<Scanner />} />
      </Routes>
    </div>
  )
}