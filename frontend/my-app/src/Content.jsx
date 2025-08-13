import { Link } from "react-router-dom"
import { useEffect, useState } from "react"
import { TrashView } from "./TrashView"

export function Content({ searchTerm, isMobileMenuOpen, onCloseMobileMenu }) {

    const [files, setfiles] = useState([]);
    const [folders, setfolders] = useState([]);
    const [favoriteFiles, setFavoriteFiles] = useState([]);
    const [workFiles, setWorkFiles] = useState([]);
    const [personalFiles, setPersonalFiles] = useState([]);
    const [trashFiles, setTrashFiles] = useState([]);
    const [activeFilter, setActiveFilter] = useState('all');
    const [displayedFiles, setDisplayedFiles] = useState([]);
    const [filteredFiles, setFilteredFiles] = useState([]);
    const [filteredFolders, setFilteredFolders] = useState([]);

    const refreshData = () => {
        // Refresh files
        fetch("http://localhost:3000/api/note-viewedit")
            .then((res) => res.json())
            .then((data) => {
                setfiles(data);
                setDisplayedFiles(data);
                setFilteredFiles(data);
                setFavoriteFiles(data.filter(file => file.isFavorite));
                setWorkFiles(data.filter(file => file.category === 'work'));
                setPersonalFiles(data.filter(file => file.category === 'personal'));
            })
            .catch((err) => {
                console.log(err);
            });
            
        // Refresh trash
        fetch("http://localhost:3000/api/notes/trash")
            .then((res) => res.json())
            .then((data) => {
                setTrashFiles(data);
            })
            .catch((err) => {
                console.log("Error fetching trash:", err);
            });
            
        // Refresh folders
        fetch("http://localhost:3000/api/folders")
            .then((res) => res.json())
            .then((data) => {
                setfolders(data);
                setFilteredFolders(data);
            })
            .catch((err) => {
                console.log("Error fetching folders:", err);
            });
    };

    useEffect(() => {
        fetch("http://localhost:3000/api/note-viewedit")
            .then((res) => res.json())
            .then((data) => {
                setfiles(data);
                setDisplayedFiles(data);
                setFilteredFiles(data);
                // Filter files by category and favorites
                setFavoriteFiles(data.filter(file => file.isFavorite));
                setWorkFiles(data.filter(file => file.category === 'work'));
                setPersonalFiles(data.filter(file => file.category === 'personal'));
            })
            .catch((err) => {
                console.log(err);
            })
            
        // Fetch trash files
        fetch("http://localhost:3000/api/notes/trash")
            .then((res) => res.json())
            .then((data) => {
                setTrashFiles(data);
            })
            .catch((err) => {
                console.log("Error fetching trash:", err);
            })
    }, [])

    const handleFilterClick = (filterType) => {
        setActiveFilter(filterType);
        applyFilters(filterType, searchTerm || '');
        // Close mobile menu when filter is selected
        if (onCloseMobileMenu) {
            onCloseMobileMenu();
        }
    }

    const applyFilters = (filterType, searchValue) => {
        let filesToShow = files;
        let foldersToShow = folders;

        // Apply category filter first
        switch(filterType) {
            case 'favorites':
                filesToShow = favoriteFiles;
                break;
            case 'work':
                filesToShow = workFiles;
                break;
            case 'personal':
                filesToShow = personalFiles;
                break;
            case 'trash':
                filesToShow = trashFiles;
                break;
            case 'all':
            default:
                filesToShow = files;
                break;
        }

        // Apply search filter
        if (searchValue && searchValue.trim() !== '') {
            const searchLower = searchValue.toLowerCase();
            filesToShow = filesToShow.filter(file => 
                file.filename.toLowerCase().includes(searchLower) ||
                file.file.toLowerCase().includes(searchLower)
            );
            foldersToShow = folders.filter(folder => 
                folder.foldername.toLowerCase().includes(searchLower)
            );
        }

        setDisplayedFiles(filesToShow);
        setFilteredFiles(filesToShow);
        setFilteredFolders(foldersToShow);
    }

    useEffect(() => {
        fetch("http://localhost:3000/api/folders")
            .then((res) => res.json())
            .then((data) => {
                console.log("Fetched folders:", data);
                setfolders(data);
                setFilteredFolders(data);
            })
            .catch((err) => {
                console.log("Error fetching folders:", err);
            })
    }, [])

    // Handle search term changes from parent component
    useEffect(() => {
        applyFilters(activeFilter, searchTerm || '');
    }, [searchTerm, files, folders, favoriteFiles, workFiles, personalFiles, trashFiles])

    // console.log(files);
    return (
        <>
            {/* Mobile Overlay */}
            <div 
                className={`mobile-overlay ${isMobileMenuOpen ? 'active' : ''}`}
                onClick={onCloseMobileMenu}
            ></div>
            
            <div className="container mt-5" style={{ height: "100vh" }} >
                <div className="row h-100">
                    <div className={`col-2 pt-4 left-sidebar ${isMobileMenuOpen ? 'mobile-sidebar-open' : ''}`}>
                        <div className="sidebar-section">
                            <h5 className="sidebar-title">Files & Categories</h5>
                            <div 
                                className={`sidebar-item ${activeFilter === 'all' ? 'active' : ''}`}
                                onClick={() => handleFilterClick('all')}
                            >
                                <i className="bi bi-files me-2"></i>
                                <span>All Files</span>
                                <span className="badge">{files.length}</span>
                            </div>
                            <div 
                                className={`sidebar-item ${activeFilter === 'favorites' ? 'active' : ''}`}
                                onClick={() => handleFilterClick('favorites')}
                            >
                                <i className="bi bi-star-fill me-2"></i>
                                <span>Favorites</span>
                                <span className="badge">{favoriteFiles.length}</span>
                            </div>
                            <div 
                                className={`sidebar-item ${activeFilter === 'work' ? 'active' : ''}`}
                                onClick={() => handleFilterClick('work')}
                            >
                                <i className="bi bi-briefcase me-2"></i>
                                <span>Work</span>
                                <span className="badge">{workFiles.length}</span>
                            </div>
                            <div 
                                className={`sidebar-item ${activeFilter === 'personal' ? 'active' : ''}`}
                                onClick={() => handleFilterClick('personal')}
                            >
                                <i className="bi bi-house me-2"></i>
                                <span>Personal</span>
                                <span className="badge">{personalFiles.length}</span>
                            </div>
                        </div>
                        
                        <div className="sidebar-section mt-auto">
                            <div 
                                className={`sidebar-item ${activeFilter === 'trash' ? 'active' : ''}`}
                                onClick={() => handleFilterClick('trash')}
                            >
                                <i className="bi bi-trash me-2"></i>
                                <span>Trash</span>
                                <span className="badge">{trashFiles.length}</span>
                            </div>
                        </div>
                    </div>
                <div className="col-10 p-4 border border-lavender rounded-4 blue-glass-section">
                    {/* Enhanced Header with Show All button in top right */}
                    <div className="d-flex justify-content-between align-items-start mb-4">
                        <div className="header-info">
                            <h2 className="main-title mb-2">
                                {activeFilter === 'favorites' && (
                                    <>
                                        <i className="bi bi-star-fill me-2 title-icon favorite"></i>
                                        Favorite Files
                                    </>
                                )}
                                {activeFilter === 'work' && (
                                    <>
                                        <i className="bi bi-briefcase-fill me-2 title-icon work"></i>
                                        Work Files
                                    </>
                                )}  
                                {activeFilter === 'personal' && (
                                    <>
                                        <i className="bi bi-house-fill me-2 title-icon personal"></i>
                                        Personal Files
                                    </>
                                )}
                                {activeFilter === 'trash' && (
                                    <>
                                        <i className="bi bi-trash-fill me-2 title-icon trash"></i>
                                        Trash
                                    </>
                                )}
                                {activeFilter === 'all' && (
                                    <>
                                        <i className="bi bi-grid-3x3-gap me-2 title-icon all"></i>
                                        My Workspace
                                    </>
                                )}
                            </h2>
                            <p className="subtitle mb-0">
                                {activeFilter === 'favorites' && `${favoriteFiles.length} starred items`}
                                {activeFilter === 'work' && `${workFiles.length} work documents`}
                                {activeFilter === 'personal' && `${personalFiles.length} personal notes`}
                                {activeFilter === 'trash' && `${trashFiles.length} deleted items`}
                                {activeFilter === 'all' && `${files.length} files • ${folders.length} folders`}
                            </p>
                        </div>
                        {activeFilter !== 'all' && (
                            <button 
                                className="btn back-btn"
                                onClick={() => handleFilterClick('all')}
                            >
                                <i className="bi bi-arrow-left me-2"></i>
                                Show All
                            </button>
                        )}
                    </div>
                    
                    {/* Enhanced Folders Section - Only for All view */}
                    {activeFilter === 'all' && (
                        <div className="content-section">
                            <div className="section-divider">
                                <h4 className="section-subtitle-header">
                                    <i className="bi bi-folder2 me-2"></i>
                                    Folders
                                </h4>
                                <div className="time-filters">
                                    <span className="time-chip active">Recent</span>
                                    <span className="time-chip">This Week</span>
                                    <span className="time-chip">This Month</span>
                                </div>
                           </div>
                            
                            <div className="items-grid">
                                <Link to="/Folder" className="create-new-item folder-create">
                                    <div className="create-icon-wrapper">
                                        <i className="bi bi-folder-plus"></i>
                                    </div>
                                    <span className="create-label">New Folder</span>
                                    <div className="create-shine"></div>
                                </Link>
                                {filteredFolders.map((folder, index) => (
                                    <Link
                                        to={`/folder/${folder._id}`}
                                        key={index} 
                                        className="content-item-enhanced folder-item">
                                        <div className="item-header">
                                            <div className="item-icon">
                                                <i className="bi bi-folder-fill"></i>
                                            </div>
                                        </div>
                                        <div className="item-content">
                                            <span className="item-title">{folder.foldername}</span>
                                            <div className="item-tags">
                                                <span className="date-badge">Updated today</span>
                                            </div>
                                        </div>
                                        <div className="item-overlay"></div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}
                    
                    {/* Enhanced Files Section */}
                    <div className="content-section">
                        {activeFilter === 'trash' ? (
                            <TrashView 
                                trashFiles={trashFiles} 
                                onRefresh={refreshData}
                            />
                        ) : (
                            <>
                                <div className="section-divider">
                                    <h4 className="section-subtitle-header">
                                        <i className="bi bi-file-earmark-text me-2"></i>
                                        {activeFilter === 'favorites' && 'Starred Files'}
                                        {activeFilter === 'work' && 'Work Documents'}
                                        {activeFilter === 'personal' && 'Personal Notes'}
                                        {activeFilter === 'all' && 'Files'}
                                    </h4>
                                    {activeFilter === 'all' && (
                                        <div className="time-filters">
                                            <span className="time-chip active">Recent</span>
                                            <span className="time-chip">Modified</span>
                                            <span className="time-chip">Created</span>
                                        </div>
                                    )}
                                </div>
                                
                                <div className="items-grid">
                                    {activeFilter === 'all' && (
                                        <Link to="/Note" className="create-new-item note-create">
                                            <div className="create-icon-wrapper">
                                                <i className="bi bi-file-earmark-plus"></i>
                                            </div>
                                            <span className="create-label">New Note</span>
                                            <div className="create-shine"></div>
                                        </Link>
                                    )}
                                    
                                    {displayedFiles.length > 0 ? (
                                        displayedFiles.map((file, index) => (
                                            <Link
                                                to={`/note/${file._id}`}
                                                key={index} 
                                                className="content-item-enhanced file-item">
                                                <div className="item-header">
                                                    <div className="item-icon">
                                                        <i className="bi bi-file-earmark-text-fill"></i>
                                                    </div>
                                                    {file.isFavorite && (
                                                        <div className="favorite-badge">
                                                            <i className="bi bi-star-fill"></i>
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="item-content">
                                                    <span className="item-title">{file.filename}</span>
                                                    <div className="item-tags">
                                                        <span className={`category-badge ${file.category}`}>
                                                            <i className={`bi ${file.category === 'work' ? 'bi-briefcase' : 'bi-house'}`}></i>
                                                            {file.category}
                                                        </span>
                                                        <span className="date-badge">Today</span>
                                                    </div>
                                                </div>
                                                <div className="item-overlay"></div>
                                            </Link>
                                        ))
                                    ) : null}
                                </div>
                            </>
                        )}
                    </div>

                </div>
            </div>
        </div>
        </>
    )
}