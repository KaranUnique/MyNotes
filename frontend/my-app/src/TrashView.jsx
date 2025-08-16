import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export function TrashView({ trashFiles, onRefresh }) {
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isEmptying, setIsEmptying] = useState(false);
    const [isRestoring, setIsRestoring] = useState(false);

    const handleSelectFile = (fileId) => {
        setSelectedFiles(prev => 
            prev.includes(fileId) 
                ? prev.filter(id => id !== fileId)
                : [...prev, fileId]
        );
    };

    const handleSelectAll = () => {
        if (selectedFiles.length === trashFiles.length) {
            setSelectedFiles([]);
        } else {
            setSelectedFiles(trashFiles.map(file => file._id));
        }
    };

    const handlePermanentDelete = async (fileId) => {
        setIsDeleting(true);
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/notes/trash/${fileId}`, {
                method: 'DELETE'
            });
            if (response.ok) {
                if (onRefresh) onRefresh();
                setSelectedFiles(prev => prev.filter(id => id !== fileId));
            }
        } catch (err) {
            console.error("Error permanently deleting file:", err);
        } finally {
            setIsDeleting(false);
        }
    };

    const handleEmptyTrash = async () => {
        if (!window.confirm("Are you sure you want to permanently delete all files in trash? This action cannot be undone.")) {
            return;
        }
        
        setIsEmptying(true);
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/notes/trash`, {
                method: 'DELETE'
            });
            if (response.ok) {
                if (onRefresh) onRefresh();
                setSelectedFiles([]);
            }
        } catch (err) {
            console.error("Error emptying trash:", err);
        } finally {
            setIsEmptying(false);
        }
    };

    const handleRestore = async (fileId) => {
        setIsRestoring(true);
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/notes/restore/${fileId}`, {
                method: 'PUT'
            });
            if (response.ok) {
                if (onRefresh) onRefresh();
                setSelectedFiles(prev => prev.filter(id => id !== fileId));
            }
        } catch (err) {
            console.error("Error restoring file:", err);
        } finally {
            setIsRestoring(false);
        }
    };

    const handleBulkDelete = async () => {
        if (selectedFiles.length === 0) return;
        
        if (!window.confirm(`Are you sure you want to permanently delete ${selectedFiles.length} file(s)? This action cannot be undone.`)) {
            return;
        }

        setIsDeleting(true);
        try {
            const deletePromises = selectedFiles.map(fileId =>
                fetch(`${import.meta.env.VITE_API_URL}/notes/trash/${fileId}`, { method: 'DELETE' })
            );
            await Promise.all(deletePromises);
            if (onRefresh) onRefresh();
            setSelectedFiles([]);
        } catch (err) {
            console.error("Error bulk deleting files:", err);
        } finally {
            setIsDeleting(false);
        }
    };

    const handleBulkRestore = async () => {
        if (selectedFiles.length === 0) return;

        setIsRestoring(true);
        try {
            const restorePromises = selectedFiles.map(fileId =>
                fetch(`${import.meta.env.VITE_API_URL}/notes/restore/${fileId}`, { method: 'PUT' })
            );
            await Promise.all(restorePromises);
            if (onRefresh) onRefresh();
            setSelectedFiles([]);
        } catch (err) {
            console.error("Error bulk restoring files:", err);
        } finally {
            setIsRestoring(false);
        }
    };

    return (
        <>
            {/* Trash Actions Bar */}
            {trashFiles.length > 0 && (
                <div className="trash-actions-bar mb-4">
                    <div className="d-flex align-items-center gap-3">
                        <div className="form-check">
                            <input 
                                className="form-check-input" 
                                type="checkbox" 
                                id="selectAll"
                                checked={selectedFiles.length === trashFiles.length && trashFiles.length > 0}
                                onChange={handleSelectAll}
                            />
                            <label className="form-check-label" htmlFor="selectAll">
                                Select All ({trashFiles.length})
                            </label>
                        </div>
                        
                        {selectedFiles.length > 0 && (
                            <div className="selected-actions">
                                <span className="selected-count me-3">
                                    {selectedFiles.length} selected
                                </span>
                                <button 
                                    className="btn btn-sm btn-success me-2"
                                    onClick={handleBulkRestore}
                                    disabled={isRestoring}
                                >
                                    {isRestoring ? (
                                        <>
                                            <div className="spinner-border spinner-border-sm me-2"></div>
                                            Restoring...
                                        </>
                                    ) : (
                                        <>
                                            <i className="bi bi-arrow-counterclockwise me-2"></i>
                                            Restore
                                        </>
                                    )}
                                </button>
                                <button 
                                    className="btn btn-sm btn-danger"
                                    onClick={handleBulkDelete}
                                    disabled={isDeleting}
                                >
                                    {isDeleting ? (
                                        <>
                                            <div className="spinner-border spinner-border-sm me-2"></div>
                                            Deleting...
                                        </>
                                    ) : (
                                        <>
                                            <i className="bi bi-trash3 me-2"></i>
                                            Delete Forever
                                        </>
                                    )}
                                </button>
                            </div>
                        )}
                        
                        <div className="ms-auto">
                            <button 
                                className="btn btn-sm btn-outline-danger"
                                onClick={handleEmptyTrash}
                                disabled={isEmptying}
                            >
                                {isEmptying ? (
                                    <>
                                        <div className="spinner-border spinner-border-sm me-2"></div>
                                        Emptying...
                                    </>
                                ) : (
                                    <>
                                        <i className="bi bi-trash3-fill me-2"></i>
                                        Empty Trash
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Trash Files Grid */}
            <div className="items-grid">
                {trashFiles.length > 0 ? (
                    trashFiles.map((file, index) => (
                        <div key={index} className="content-item-enhanced file-item trash-item">
                            <div className="item-header">
                                <div className="form-check item-checkbox">
                                    <input 
                                        className="form-check-input" 
                                        type="checkbox" 
                                        checked={selectedFiles.includes(file._id)}
                                        onChange={() => handleSelectFile(file._id)}
                                    />
                                </div>
                                <div className="item-icon">
                                    <i className="bi bi-file-earmark-text-fill"></i>
                                </div>
                                <div className="trash-badge">
                                    <i className="bi bi-trash-fill"></i>
                                </div>
                            </div>
                            <div className="item-content">
                                <span className="item-title">{file.filename}</span>
                                <div className="item-tags">
                                    <span className={`category-badge ${file.category}`}>
                                        <i className={`bi ${file.category === 'work' ? 'bi-briefcase' : 'bi-house'}`}></i>
                                        {file.category}
                                    </span>
                                    <span className="date-badge">
                                        Deleted {new Date(file.updatedAt).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>
                            <div className="item-actions">
                                <button 
                                    className="btn btn-sm btn-success"
                                    onClick={() => handleRestore(file._id)}
                                    disabled={isRestoring}
                                    title="Restore file"
                                >
                                    <i className="bi bi-arrow-counterclockwise"></i>
                                </button>
                                <button 
                                    className="btn btn-sm btn-danger"
                                    onClick={() => handlePermanentDelete(file._id)}
                                    disabled={isDeleting}
                                    title="Delete permanently"
                                >
                                    <i className="bi bi-trash3"></i>
                                </button>
                            </div>
                            <div className="item-overlay"></div>
                        </div>
                    ))
                ) : (
                    <div className="empty-state">
                        <div className="empty-icon">
                            <i className="bi bi-trash"></i>
                        </div>
                        <h4 className="empty-title">Trash is empty</h4>
                        <p className="empty-description">
                            Deleted files will appear here. Files in trash are not permanently deleted until you choose to remove them.
                        </p>
                    </div>
                )}
            </div>
        </>
    );
}
