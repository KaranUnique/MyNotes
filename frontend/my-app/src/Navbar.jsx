export function Navbar() {
    return (
        <>
            <nav className="w-100 px-4 py-3 nav-color d-flex justify-content-between align-items-center">
                {/* Left side: Title */}
                <div className="d-flex gap-5">
                    <h1 className="mb-0">My Notes</h1>
                </div>

                {/* Center: Search bar */}
                <div className="mt-5 px-5">
                    <input
                        className="form-control-lg border-0 rounded ps-3 search-color"
                        type="text"
                        placeholder="Search"
                    />
                </div>

                {/* Right side: Profile and icons */}
                <div className="d-flex align-items-center gap-3">
                    <p className="mb-0">Raquiel Murillo</p>
                    <img src="/leetcode.svg" width="30" height="30" />
                    <img src="/explore.svg" width="30" height="30" />
                </div>
            </nav>
        </>
    );
}
