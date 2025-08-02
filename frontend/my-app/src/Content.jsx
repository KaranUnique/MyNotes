import { Link } from "react-router-dom"
import { useEffect, useState } from "react"

export function Content() {

    const [files, setfiles] = useState([]);
    const [folders, setfolders] = useState([]);
    useEffect(() => {
        fetch("http://localhost:3000/api/note-viewedit")
            .then((res) => res.json())
            .then((data) => {
                setfiles(data);
            })
            .catch((err) => {
                console.log(err);
            })
    }, [])

    useEffect(() => {
        fetch("http://localhost:3000/api/folders")
            .then((res) => res.json())
            .then((data) => {
                console.log("Fetched folders:", data);
                setfolders(data);
            })
            .catch((err) => {
                console.log("Error fetching folders:", err);
            })
    }, [])

    // console.log(files);
    return (
        <div className="container mt-5" style={{ height: "100vh" }}>
            <div className="row h-100">
                <div className="col-2 pt-4 ">
                    <p>Add New</p>
                    <p>Calender</p>
                    <p>Archive</p>
                    <p>Trash</p>
                </div>
                <div className="col-10 p-3 border border-lavender rounded-4">
                    <h3 className="mt-2 mb-3">Recent Folder</h3>
                    <div className="d-flex gap-5">
                        <p className="hover-underline">Today</p>
                        <p className="hover-underline">This Week</p>
                        <p className="hover-underline">This Month</p>
                    </div>
                    <div className="d-flex flex-wrap gap-3">
                        <Link
                            to="/Folder"
                            className="d-flex justify-content-center align-items-center mt-4 w-21 card-color p-3 text-decoration-none rounded text-center fs-5"
                            style={{ display: "inline-block", height: "6rem" }}>

                            New Folder
                        </Link>
                        {folders.map((folder, index) => (
                            <Link
                                to={`/folder/${folder._id}`}
                                key={index} className="d-flex justify-content-center align-items-center mt-4 w-23 card-color p-3 text-decoration-none rounded text-center fs-5"
                                style={{ display: "inline-block", height: "8rem" }}

                            >
                                {folder.foldername}
                            </Link>
                        ))}
                    </div>
                    <h3 className="mt-3 mb-3">Recent File</h3>
                    <div className="d-flex gap-5">
                        <p className="hover-underline">Today</p>
                        <p className="hover-underline">This Week</p>
                        <p className="hover-underline">This Month</p>
                    </div>
                    <div className="d-flex gap-5">

                        <div className="d-flex justify-content-center">
                            <Link
                                to="/Note"
                                className="d-flex justify-content-center align-items-center mt-4 w-20 card-color p-3 text-decoration-none rounded text-center fs-5"
                                style={{ display: "inline-block", height: "6rem" }}>

                                New Note
                            </Link>
                        </div>
                        <div className="d-flex flex-wrap gap-3">
                            {files.map((file, index) => (
                                <Link
                                    to={`/note/${file._id}`}
                                    key={index} className="d-flex justify-content-center align-items-center mt-4 w-25 card-color p-3 text-decoration-none rounded text-center fs-5"
                                    style={{ display: "inline-block", height: "8rem" }}

                                >
                                    {file.filename}
                                </Link>
                            ))}
                        </div>

                    </div>

                </div>
            </div>
        </div>
    )
}