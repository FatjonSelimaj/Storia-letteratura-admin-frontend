import React, { useState, useEffect } from 'react';
import { getAuthors, deleteAuthor } from '../services/authorService';
import { useNavigate } from 'react-router-dom';
import { Author } from '../interfaces/authorInterface';

const AuthorList: React.FC = () => {
    const [authors, setAuthors] = useState<Author[]>([]);
    const [filteredAuthors, setFilteredAuthors] = useState<Author[]>([]); // Stato per gli autori filtrati
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState(''); // Stato per la query di ricerca
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAuthors = async () => {
            try {
                const data = await getAuthors();
                setAuthors(data);
                setFilteredAuthors(data); // Imposta gli autori filtrati uguali a quelli originali inizialmente
            } catch (err) {
                setError('Failed to fetch authors');
            } finally {
                setLoading(false);
            }
        };

        fetchAuthors();
    }, []);

    const handleDelete = async (id: string) => {
        try {
            await deleteAuthor(id);
            setAuthors(authors.filter((author) => author.id !== id));
            setFilteredAuthors(filteredAuthors.filter((author) => author.id !== id)); // Aggiorna anche gli autori filtrati
        } catch (err) {
            setError('Failed to delete author');
        }
    };

    // Funzione per filtrare gli autori in base alla query di ricerca
    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value.toLowerCase();
        setSearchQuery(query);
        setFilteredAuthors(
            authors.filter(author =>
                author.name.toLowerCase().includes(query) ||  // Filtra per nome
                author.biography?.toLowerCase().includes(query)  // Filtra per biografia
            )
        );
    };

    const handleViewDetails = (id: string) => {
        navigate(`/author-details/${id}`);  // Naviga alla pagina di dettagli dell'autore
    };

    return (
        <div className="container mx-auto p-6">
            {loading && <p>Loading...</p>}
            {error && <p className="text-red-500">{error}</p>}

            <h1 className="text-2xl font-bold mb-4">Authors</h1>

            {/* Barra di ricerca */}
            <input
                type="text"
                value={searchQuery}
                onChange={handleSearch}
                placeholder="Search authors by name or biography..."
                className="mb-6 p-2 border border-gray-300 rounded w-full"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredAuthors.length === 0 ? (
                    <p>No authors found</p>
                ) : (
                    filteredAuthors.map((author) => (
                        <div key={author.id} className="bg-white text-black shadow-md rounded-lg p-4">
                            <h2 className="text-xl font-bold">{author.name}</h2>
                            <p className="text-gray-700 mb-2">{author.biography}</p>
                            <div className="flex justify-between">
                                <button
                                    className="text-blue-500 hover:underline"
                                    onClick={() => handleViewDetails(author.id)}  // Naviga alla pagina di visualizzazione
                                >
                                    View Details
                                </button>
                                <button
                                    className="text-blue-500 hover:underline"
                                    onClick={() => navigate(`/edit-author/${author.id}`)}  // Navigazione alla pagina di modifica
                                >
                                    Edit
                                </button>
                                <button
                                    className="text-red-500 hover:underline"
                                    onClick={() => handleDelete(author.id)}
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default AuthorList;
