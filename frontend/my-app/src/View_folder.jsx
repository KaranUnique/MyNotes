import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

export function View_folder() {
    const { id } = useParams(); // Get folder ID from URL
    const [folder, setFolder] = useState(null);
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch specific folder data
        fetch(`http://localhost:3000/api/folders/${id}`)
            .then((res) => res.json())
            .then((data) => {
                console.log("Fetched folder:", data);
                setFolder(data);
                setFiles(data.files || []);
                setLoading(false);
            })
            .catch((err) => {
                console.log("Error fetching folder:", err);
                setLoading(false);
            });
    }, [id]);

    if (loading) return <div>Loading...</div>;
    if (!folder) return <div>Folder not found</div>;

    return (
        <>
            <div className="container mt-5">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h2>{folder.foldername}</h2>
                    <Link to="/" className="btn btn-secondary">Back to Home</Link>
                </div>
                
                <div className="d-flex flex-wrap gap-3">
                    {files.length > 0 ? (
                        files.map((file, index) => (
                            <Link
                                to={`/note/${file._id}`}
                                key={index}
                                className="d-flex justify-content-center fs-4 align-items-center mt-4 w-25 card-color p-3 text-decoration-none rounded text-center"
                                style={{ display: "inline-block", height: "8rem" }}
                            >
                                {file.filename}
                            </Link>
                        ))
                    ) : (
                        <p>No files in this folder</p>
                    )}
                </div>
            </div>            # Dependencies
            node_modules/
            
            # Environment variables
            .env
            .env.local
            .env.production
            
            # Build outputs
            dist/
            build/
            
            # Logs
            *.log
            
            # OS files
            .DS_Store
            Thumbs.db
            
            # IDE files
            .vscode/
            .idea/            # Dependencies
            node_modules/
            
            # Environment variables
            .env
            .env.local
            .env.production
            
            # Build outputs
            dist/
            build/
            
            # Logs
            *.log
            
            # OS files
            .DS_Store
            Thumbs.db
            
            # IDE files
            .vscode/
            .idea/
        </>
    );
}