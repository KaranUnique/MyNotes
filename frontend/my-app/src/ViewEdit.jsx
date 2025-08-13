import { func } from "prop-types";
import { useEffect } from "react";
import { useState } from "react";
import { useParams } from "react-router-dom";

export function ViewEdit() {

    const { id } = useParams();
    const [success, setsuccess] = useState(false);
    const [deleted, setdeleted] = useState(false);
    const [files, setfile] = useState({ filename: "", file: "", isFavorite: false, category: "personal" });
    const [updatefile, setupdatefile] = useState({ filename: "", file: "", isFavorite: false, category: "personal" });

    useEffect(() => {
        fetch(`http://localhost:3000/api/note-viewedit/${id}`)
            .then((res) => res.json())
            .then((data) => {
                setfile(data);
                setupdatefile(data);
            })
            .catch((err) => {
                console.log("Error", err);
            })
    }, [id])

    const toggleFavorite = () => {
        setupdatefile({ ...updatefile, isFavorite: !updatefile.isFavorite });
    }

    const handleCategoryChange = (category) => {
        setupdatefile({ ...updatefile, category: category });
    }


    const UpadteNote = async (e) => {
        e.preventDefault();
        setsuccess(false);
        try {
            const response = await fetch(`http://localhost:3000/api/note-viewedit/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(updatefile)
            }
            )
            if (!response.ok) {
                throw new Error("Failed to update note");
            }
            else {
                setsuccess(true);
            }


        }
        catch (err) {
            console.log("Note not send", err);
        }
    }
    async function DeleteFile() {
        setdeleted(false);
        try {
            const response = await fetch(`http://localhost:3000/api/note-viewedit/${id}`, {
                method: 'DELETE',
            })

            if (response.ok) {
                console.log("Deleted successfully");
                setdeleted(true);
            }
            else console.log("Not deleted");
        }
        catch (err) {
            console.log("error", err);
        }
    }
    return (
        <>
            <div className="container">
                <div className="d-flex">
                    <form onSubmit={UpadteNote} className="d-flex flex-row ">
                        <div className="mt-5">
                            {/* Header with filename, star, and category */}
                            <div className="d-flex align-items-center gap-3 mb-3">
                                <input type="text" placeholder="File name" className="form-control"
                                    style={{ width: "200px" }}
                                    value={updatefile.filename}
                                    onChange={(e) => (setupdatefile({ ...updatefile, filename: e.target.value }))}
                                />
                                
                                {/* Star Favorite Button */}
                                <button 
                                    type="button" 
                                    className="btn favorite-btn"
                                    onClick={toggleFavorite}
                                    title={updatefile.isFavorite ? "Remove from favorites" : "Add to favorites"}
                                >
                                    <i className={`bi ${updatefile.isFavorite ? 'bi-star-fill' : 'bi-star'}`}></i>
                                </button>

                                {/* Category Dropdown */}
                                <div className="dropdown">
                                    <button 
                                        className="btn category-btn dropdown-toggle" 
                                        type="button" 
                                        data-bs-toggle="dropdown" 
                                        aria-expanded="false"
                                    >
                                        <i className={`bi ${updatefile.category === 'work' ? 'bi-briefcase' : 'bi-house'} me-2`}></i>
                                        {updatefile.category === 'work' ? 'Work' : 'Personal'}
                                    </button>
                                    <ul className="dropdown-menu category-dropdown">
                                        <li>
                                            <button 
                                                className="dropdown-item" 
                                                type="button"
                                                onClick={() => handleCategoryChange('personal')}
                                            >
                                                <i className="bi bi-house me-2"></i>Personal
                                            </button>
                                        </li>
                                        <li>
                                            <button 
                                                className="dropdown-item" 
                                                type="button"
                                                onClick={() => handleCategoryChange('work')}
                                            >
                                                <i className="bi bi-briefcase me-2"></i>Work
                                            </button>
                                        </li>
                                    </ul>
                                </div>
                            </div>

                            <textarea className="form-control" rows={25} cols={120}
                                style={{ border: "none", outline: "none", resize: "none" }}
                                value={updatefile.file}
                                onChange={(e) => (setupdatefile({ ...updatefile, file: e.target.value }))}
                            ></textarea>
                        </div>
                        <div className="d-flex flex-row  align-items-start m-2 pt-5">
                            <button type="submit" className="btn card-color ms-2">Save</button>
                            <button type="button" className="btn card-color ms-2" onClick={() => DeleteFile()}>Delete</button>
                        </div>
                    </form>
                    <div className="mx-3 text-success">
                        {success && <p>File Saved Successfully</p>}
                        {deleted && <p>File Deleted Successfully</p>}
                    </div>

                </div>
            </div>

        </>
    );
}