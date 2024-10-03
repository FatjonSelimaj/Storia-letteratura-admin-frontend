import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getAuthorById } from '../services/authorService'; // Funzione per ottenere l'autore per ID
import { Author } from '../interfaces/authorInterface';

const AuthorDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>(); // Ottieni l'ID dai parametri dell'URL
    const [author, setAuthor] = useState<Author | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchAuthor = async () => {
            try {
                if (id) {
                    const fetchedAuthor = await getAuthorById(id); // Recupera l'autore tramite l'ID
                    setAuthor(fetchedAuthor);
                }
            } catch (err) {
                setError('Failed to fetch author details.');
            } finally {
                setLoading(false);
            }
        };

        fetchAuthor();
    }, [id]);

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p className="text-red-500">{error}</p>;
    }

    return (
        <div className="container mx-auto p-6">
            {author ? (
                <div className="bg-white shadow-md rounded-lg p-4">
                    <h1 className="text-2xl font-bold mb-4">{author.name}</h1>
                    <p className="text-gray-700 mb-6">{author.biography}</p>
                </div>
            ) : (
                <p>Author not found</p>
            )}
        </div>
    );
};

export default AuthorDetails;
