import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createAuthor, updateAuthor, getAuthorById } from '../services/authorService';

const AuthorForm: React.FC = () => {
    const [name, setName] = useState('');
    const [biography, setBiography] = useState('');
    const [error, setError] = useState<string | null>(null);  // Gestione errori
    const navigate = useNavigate();
    const { id } = useParams<string>();

    useEffect(() => {
        if (id) {
            const fetchAuthor = async () => {
                try {
                    const author = await getAuthorById(id);
                    setName(author.name);
                    setBiography(author.biography);
                } catch (err) {
                    setError('Error fetching author data');
                }
            };
            fetchAuthor();
        }
    }, [id]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const authorData = { name, biography };

        try {
            if (id) {
                await updateAuthor(id, authorData);
            } else {
                await createAuthor(authorData);
            }
            navigate('/authors');
        } catch (err: any) {
            if (err.response && err.response.status === 409) {
                // Errore gestito per autore duplicato
                setError('An author with this name already exists. Please choose a different name.');
            } else {
                // Altri errori
                setError('Failed to submit the author. Please try again later.');
            }
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {error && <p className="text-red-500">{error}</p>} {/* Messaggio di errore */}
            <div>
                <label className="block text-sm font-medium text-gray-700">Name:</label>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="mt-1 block w-full text-black p-2 border border-gray-300"
                    required
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">Biography:</label>
                <textarea
                    value={biography}
                    onChange={(e) => setBiography(e.target.value)}
                    className="mt-1 block w-full text-black p-2 border border-gray-300"
                ></textarea>
            </div>
            <button
                type="submit"
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-500 hover:bg-blue-600"
            >
                {id ? 'Update Author' : 'Create Author'}
            </button>
        </form>
    );
};

export default AuthorForm;
