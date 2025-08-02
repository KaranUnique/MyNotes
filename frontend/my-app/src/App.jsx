import { useState } from 'react'

import './App.css'
import { BrowserRouter as Router, Route , Routes} from 'react-router-dom'
import { Navbar } from './Navbar'
import { Content } from './Content'
import { Note } from './Note'
import { ViewEdit } from './ViewEdit'
import { Folder } from '../Folder'
import { View_folder } from './view_folder'

function App() {

  return (
    <>
    <Router>
      <Navbar/>
      <Routes>
        <Route path='/' element={<Content/>} />
        <Route path='/Note' element={<Note/>}/>
        <Route path='/note/:id'element={<ViewEdit/>}/>
        <Route path='/Folder' element={<Folder/>}/>
        <Route path='/Folder/:id'element={<View_folder/>}/>
      </Routes>
    </Router>
    </>
  )
}

export default App
