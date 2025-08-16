import { useState } from 'react'

import './App.css'
import { BrowserRouter as Router, Route , Routes} from 'react-router-dom'
import { Navbar } from './Navbar'
import { Content } from './Content'
import { Note } from './Note'
import { ViewEdit } from './ViewEdit'
import { Folder } from '../Folder'
import { View_folder } from './View_folder'

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <>
    <Router>
      <Navbar onSearch={handleSearch} onToggleMobileMenu={toggleMobileMenu}/>
      <Routes>
        <Route path='/' element={
          <Content 
            searchTerm={searchTerm} 
            isMobileMenuOpen={isMobileMenuOpen}
            onCloseMobileMenu={closeMobileMenu}
          />
        } />
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
