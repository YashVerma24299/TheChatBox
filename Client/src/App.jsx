import React from 'react'
import Navbar from './components/Navbar.jsx'
// Routes is like a container that holds all your routes.
// Route defines path
import {Routes, Route} from 'react-router-dom'

import HomePage from './pages/HomePage'
import SignUpPage from './pages/SignUpPage'
import LoginPage from './pages/LoginPage'
import SettingsPage from './pages/SettingsPage'
import ProfilePage from './pages/ProfilePage'

const App = () => {
  return (
    <div >
      {/* <Navbar/> → Renders the navigation bar on top (always visible). */}
      <Navbar/>
      {/* Handles page routing. */}
      <Routes> 
        <Route path='/' element={<HomePage/>}/>
        <Route path='/signup' element={<SignUpPage/>}/>
        <Route path='/login' element={<LoginPage/>}/>
        <Route path='/settings' element={<SettingsPage/>}/>
        <Route path='/profile' element={<ProfilePage/>}/>
      </Routes>
    </div>
  )
}

export default App;