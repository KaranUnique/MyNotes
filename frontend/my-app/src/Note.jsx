import { useState } from "react";
import { HandleNote } from "./HandleNote";
export function Note() {

    const [note, setNote] = useState("");
    const [filename, setfilename] = useState("");
    const [isFavorite, setIsFavorite] = useState(false);
    const [category, setCategory] = useState("personal");
    const [error, seterror] = useState(false);
    const [success, setsuccess] = useState(false);
    const [loading, setloading] = useState(false);
    
    const toggleFavorite = () => {
        setIsFavorite(!isFavorite);
    }

    const handleCategoryChange = (newCategory) => {
        setCategory(newCategory);
    }
    const handlesave = async (e) => {

        e.preventDefault();
        setsuccess(false);
        setloading(true);
        if (!note.trim()) {
            alert("Note empty");
            setloading(false);
            return;
        }
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/note-save`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    content: note,
                    filename: filename,
                    isFavorite: isFavorite,
                    category: category
                })
            }
            )
            const data = await response.json();
            if (!response.ok) {
                if (data.type === "DUPLICATE_FILENAME") {
                    seterror(true);
                    return;
                }
                throw new Error("Failed to save note");
            }
            setsuccess(true);
        }

        catch (err) {
            console.log("Note not send", err);
        }
        finally {
            setloading(false);
        }
    }

    return (
        <>
            <div className="container">
                <div className="d-flex">
                    <form onSubmit={handlesave} className="d-flex flex-row ">
                        <div className="mt-5">
                            {/* Header with filename, star, and category */}
                            <div className="d-flex align-items-center gap-3 mb-3">
                                <input type="text" placeholder="File name" className="form-control"
                                    onChange={(e) => {
                                        setfilename(e.target.value);
                                        seterror(false);
                                    }
                                    }
                                    style={{ width: "200px" }}
                                />
                                
                                {/* Star Favorite Button */}
                                <button 
                                    type="button" 
                                    className="btn favorite-btn"
                                    onClick={toggleFavorite}
                                    title={isFavorite ? "Remove from favorites" : "Add to favorites"}
                                >
                                    <i className={`bi ${isFavorite ? 'bi-star-fill' : 'bi-star'}`}></i>
                                </button>

                                {/* Category Dropdown */}
                                <div className="dropdown">
                                    <button 
                                        className="btn category-btn dropdown-toggle" 
                                        type="button" 
                                        data-bs-toggle="dropdown" 
                                        aria-expanded="false"
                                    >
                                        <i className={`bi ${category === 'work' ? 'bi-briefcase' : 'bi-house'} me-2`}></i>
                                        {category === 'work' ? 'Work' : 'Personal'}
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
                                
                                {error && <p className="text-danger mb-0">*File name already exists</p>}
                            </div>

                            <textarea className="form-control" rows={25} cols={120}
                                style={{ border: "none", outline: "none", resize: "none" }}
                                onChange={(e) => setNote(e.target.value)}
                                value={note}
                            ></textarea>
                        </div>

                        <div className="d-flex flex-row  justify-content-center align-items-start pt-5">
                            <div className="d-flex flex-row">
                                <button type="submit" className="btn card-color w-3">{loading ? "Saving..." : "Save"}</button>
                            </div>
                            <div className="mx-3 text-success">
                                {success && <p>File Saved Successfully</p>}
                            </div>


                        </div>
                    </form>

                </div>
            </div>

        </>
    );
}