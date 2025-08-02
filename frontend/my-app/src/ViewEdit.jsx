import { func } from "prop-types";
import { useEffect } from "react";
import { useState } from "react";
import { useParams } from "react-router-dom";

export function ViewEdit() {

    const { id } = useParams();
    const [success, setsuccess] = useState(false);
    const [deleted, setdeleted] = useState(false);
    const [files, setfile] = useState({ filename: "", file: "" });
    const [updatefile, setupdatefile] = useState({ filename: "", file: "" });

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
                            <input type="text" placeholder="File name" className="form-control my-2"
                                style={{ width: "200px" }}
                                value={updatefile.filename}
                                onChange={(e) => (setupdatefile({ ...updatefile, filename: e.target.value }))}
                            ></input>
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