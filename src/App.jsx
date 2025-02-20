import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Intro from './pages/Intro'

function App() {

  return (
    <>
    <Routes>
    <Route path='/' element={<Intro/>}/>
    <Route path='home' element={<Home/>}/>
    </Routes>
    </>
  )
}

export default App
