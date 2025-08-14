import { useState } from 'react';

export function Navbar({ onSearch, onToggleMobileMenu }) {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (onSearch) {
      onSearch(value);
    }
  };

  return (
    <>
      <nav className="w-100 px-4 py-3 nav-color enhanced-navbar">
        <div className="d-flex align-items-center w-100">
          {/* Left side: Mobile menu button + Title */}
          <div className="d-flex align-items-center gap-3 flex-shrink-0" style={{ minWidth: '200px' }}>
            <button 
              className="mobile-menu-btn d-lg-none"
              onClick={onToggleMobileMenu}
              aria-label="Toggle menu"
            >
              <i className="bi bi-list"></i>
            </button>
            <h1 className="mb-0 app-title fs-7 fs-md-4">
              Scribbly
            </h1>
          </div>

          {/* Center: Enhanced Search bar - Centered on laptop+ */}
          <div className="flex-grow-1 d-flex justify-content-center mx-3 mx-md-4 mx-lg-5">
            <div className="search-container" style={{ maxWidth: '500px', width: '100%' }}>
              <div className="search-wrapper">
                <i className="bi bi-search search-icon"></i>
                <input
                  className="form-control border-0 rounded-pill search-input"
                  type="text"
                  placeholder="Search notes and folders..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
                {searchTerm && (
                  <button 
                    className="search-clear-btn"
                    onClick={() => {
                      setSearchTerm('');
                      if (onSearch) onSearch('');
                    }}
                    title="Clear search"
                  >
                    <i className="bi bi-x-circle"></i>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Right side: Enhanced Profile section - Hidden on small screens */}
          <div className="d-none d-md-flex align-items-center gap-3 flex-shrink-0" style={{ minWidth: '200px', justifyContent: 'flex-end' }}>
            {/* <div className="profile-info d-none d-lg-block">
              <p className="mb-0 user-name">Raquiel Murillo</p>
              <small className="user-status">Online</small>
            </div> */}
            {/* <div className="profile-avatar">
              <span>RM</span>
            </div> */}
            <div className="nav-actions d-none d-lg-flex">
              <button className="nav-btn" onClick={() => alert('On development')}>
                <i className="bi bi-grid-3x3-gap"></i>
              </button>
              <button className="nav-btn" onClick={() => alert('On development')}>
                <i className="bi bi-gear"></i>
              </button>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}
