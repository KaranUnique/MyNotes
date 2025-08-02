import { useState } from "react";
import { HandleNote } from "./HandleNote";
export function Note() {

    const [note, setNote] = useState("");
    const [filename, setfilename] = useState("");
    const [error, seterror] = useState(false);
    const [success, setsuccess] = useState(false);
    const [loading, setloading] = useState(false);
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
            const response = await fetch("http://localhost:3000/api/note-save", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    content: note,
                    filename: filename
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
                            <div className="d-flex align-items-center gap-3">
                                <input type="text" placeholder="File name" className="form-control my-2"
                                    onChange={(e) => {
                                        setfilename(e.target.value);
                                        seterror(false);
                                    }
                                    }
                                    style={{ width: "200px" }}
                                ></input>
                                {error && <p className="text-danger">*File name already exsits</p>}
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