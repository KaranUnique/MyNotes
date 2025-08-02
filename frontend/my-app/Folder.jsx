import { func } from 'prop-types';
import { useState, useEffect } from 'react';

export function Folder() {

    const [files, setfiles] = useState([]);
    const [selected, setSelected] = useState([]);
    const [foldername, setfoldername] = useState("");
    const [message, setMessage] = useState("");
    useEffect(() => {
        fetch("http://localhost:3000/api/note-viewedit")
            .then((res) => res.json())
            .then((data) => {
                console.log("Fetched data:", data);
                setfiles(data);
            })
            .catch((err) => {
                console.log("Error fetching data:", err);
            })
    }, [])

    const SelectFile = (id) => {
        setSelected(prev => {
            if (prev.includes(id)) {
                return prev.filter(item => item !== id);
            } else {
                return [...prev, id];
            }
        });
    }

    const CreateFolder = async () => {
        try {
            const response = await fetch("http://localhost:3000/api/create-folder", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    "foldername": foldername,
                    "selectedFiles": selected
                })
            });
            
            const result = await response.json();
            
            if (response.ok) {
                setMessage("Folder created successfully!");
                setfoldername("");
                setSelected([]);
            } else {
                setMessage(`Error: ${result.message}`);
            }
            
        } catch (err) {
            console.log("Error:", err);
            setMessage("Failed to create folder. Please try again.");
        }
    }

    return (
        <>
            <div className="d-flex flex-wrap gap-3">
                {files.map((file, index) => (
                    <div
                        to={`/note/${file._id}`}
                        key={index}
                        className={`d-flex justify-content-center fs-4 align-items-center mt-4 w-25 p-3 text-decoration-none rounded text-center ${selected.includes(file._id) ? 'selected-color text-white' : 'card-color'
                            }`}
                        style={{ display: "inline-block", height: "8rem", cursor: "pointer" }}
                        onClick={() => SelectFile(file._id)}
                    >
                        {file.filename}
                    </div>
                ))}

            </div>
            <div className='d-flex m-5 justify-content-center align-items-center'>
                <input type="text" placeholder="Folder name" className="form-control my-2 mx-3"
                    style={{ width: "200px" }}
                    onChange={(e) => setfoldername(e.target.value)}
                ></input>
                <button type="submit" className="btn card-color w-3"
                    onClick={CreateFolder}
                >Create</button>
                <p className={`ms-3 mt-3 ${message.includes('successfully') ? 'text-success' : 'text-danger'}`}>
                    {message}
                </p>
            </div>

        </>
    )
}