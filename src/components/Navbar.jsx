import React, { useState } from "react";
import NavItem from "./NavItem";
import { Search } from "./Search";
import me12 from "../assets/images/me1-2.png";
import { useNavigate } from "react-router-dom";

const navItems = [
    { label: "GENRE", path: "/genre" },
    //   { label: "TOP PICKS", path: "/top" },
];


export default function Navbar() {
    const navigate = useNavigate();
    const [query, setQuery] = useState("");

    const handleSearch = () => {
        if (query.trim()) {
            navigate(`/search?query=${encodeURIComponent(query)}`);
            setQuery(""); // optional: clear input
        }
    };
    return (
        <header
            className="flex items-center justify-between w-[95%] mx-auto mt-3 px-6 py-3
                 bg-surface rounded-2xl shadow fixed top-0 left-10 z-2"
            role="banner"
        >
            {/* Left: Profile */}
            <div className="flex items-center gap-4">
                <img
                    src={me12}
                    alt="User avatar"
                    className="w-[50px] h-[50px] rounded-full"
                />
                <NavItem to="/">KAWAII CORNER</NavItem>
            </div>

            {/* Middle: Nav items */}
            <nav className="flex gap-12" aria-label="Main navigation">
                {navItems.map((item) => (
                    <NavItem key={item.label} to={item.path}>{item.label}</NavItem>
                ))}
                {/* Right: Search */}
                <div className="flex items-center gap-2">
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") handleSearch();
                        }}
                        placeholder="Search anime..."
                        className="px-3 py-1 rounded-full text-black  focus:outline-none focus:ring-2 focus:ring-[color:var(--color-accent)]"
                    />
                    <Search className="w-[45px] h-[45px]" onClick={handleSearch} />
                </div>
            </nav>

        </header>
    );
}
