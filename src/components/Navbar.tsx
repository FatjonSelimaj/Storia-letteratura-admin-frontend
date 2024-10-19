import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaSun, FaMoon, FaBars, FaTimes } from 'react-icons/fa'; // Icone per il menu e la modalità

const Navbar: React.FC = () => {
    const [darkMode, setDarkMode] = useState<boolean>(false); // Stato per gestire la modalità
    const [menuOpen, setMenuOpen] = useState<boolean>(false); // Stato per il menu mobile

    // Funzione per alternare tra modalità dark e light
    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
        localStorage.setItem('theme', !darkMode ? 'dark' : 'light'); // Salva la preferenza nel localStorage
    };

    // Funzione per alternare l'apertura del menu mobile
    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    // Effetto per caricare la preferenza salvata
    useEffect(() => {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            setDarkMode(savedTheme === 'dark');
        }
    }, []);

    // Cambia il tema del body a seconda della modalità
    useEffect(() => {
        if (darkMode) {
            document.body.classList.add('bg-gray-900', 'text-white');
            document.body.classList.remove('bg-white', 'text-gray-900');
        } else {
            document.body.classList.add('bg-white', 'text-gray-900');
            document.body.classList.remove('bg-gray-900', 'text-white');
        }
    }, [darkMode]);

    return (
        <nav className="bg-gray-800 p-4 relative"> {/* Navbar sempre scuro */}
            <div className="container mx-auto flex justify-between items-center">
                {/* Icona menu hamburger per schermi mobili */}
                <button
                    onClick={toggleMenu}
                    className="text-white text-2xl focus:outline-none md:hidden"
                >
                    {menuOpen ? <FaTimes /> : <FaBars />}
                </button>

                {/* Menu di navigazione */}
                <div
                    className={`flex-col md:flex-row md:flex md:space-x-4 absolute md:relative bg-gray-800 w-full md:w-auto left-0 top-16 md:top-auto transition-transform duration-300 ease-in-out ${menuOpen ? 'flex' : 'hidden'}`}
                >
                    <Link to="/" className="text-white py-2 px-4 block md:inline-block">Home</Link>
                    <Link to="/articles" className="text-white py-2 px-4 block md:inline-block">Articles</Link>
                    <Link to="/create-article" className="text-white py-2 px-4 block md:inline-block">Create Article</Link>
                    <Link to="/authors" className="text-white py-2 px-4 block md:inline-block">Authors</Link>
                    <Link to="/create-author" className="text-white py-2 px-4 block md:inline-block">Create Author</Link>
                    <Link to="/history-sections" className="text-white py-2 px-4 block md:inline-block">History Sections</Link>
                    <Link to="/create-history-section" className="text-white py-2 px-4 block md:inline-block">Create History Section</Link>
                    <Link to="/literatures" className="text-white py-2 px-4 block md:inline-block">Literature</Link>
                    <Link to="/create-literature" className="text-white py-2 px-4 block md:inline-block">Create Literature</Link>
                    <Link to="/works" className="text-white py-2 px-4 block md:inline-block">Works</Link>
                    <Link to="/works/new" className="text-white py-2 px-4 block md:inline-block">Create Work</Link>
                </div>

                {/* Icona per alternare tra modalità dark e light */}
                <button
                    onClick={toggleDarkMode}
                    className="text-white flex items-center focus:outline-none"
                >
                    {darkMode ? (
                        <FaSun className="text-yellow-400" />
                    ) : (
                        <FaMoon className="text-gray-300" />
                    )}
                    <span className="ml-2 hidden md:inline">
                        {darkMode ? 'Light Mode' : 'Dark Mode'}
                    </span>
                </button>
            </div>
        </nav>
    );
};

export default Navbar;
