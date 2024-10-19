import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getAuthors } from '../services/authorService';
import { getWorks } from '../services/workService';
import { createLiterature, updateLiterature } from '../services/literatureService';
import { Author, Work } from '../interfaces/authorInterface';

const LiteratureForm: React.FC = () => {
    const { id } = useParams(); // Ottieni l'ID della letteratura da modificare, se esiste
    const navigate = useNavigate();
    
    // Stato per autori, opere, errori, e selezioni attuali
    const [authorId, setAuthorId] = useState('');
    const [workId, setWorkId] = useState('');
    const [authors, setAuthors] = useState<Author[]>([]);
    const [works, setWorks] = useState<Work[]>([]);
    const [error, setError] = useState<string | null>(null);

    // Funzione per caricare autori e opere all'inizio
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [authorsData, worksData] = await Promise.all([getAuthors(), getWorks()]);
                setAuthors(authorsData);
                setWorks(worksData);
            } catch (err) {
                setError('Failed to load authors or works');
            }
        };
        fetchData();
    }, []);

    // Funzione per gestire il submit del form
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const literatureData = { authorId, workId };

        try {
            if (id) {
                await updateLiterature(id, literatureData); // Aggiorna letteratura esistente
            } else {
                await createLiterature(literatureData); // Crea nuova letteratura
            }
            navigate('/literatures'); // Naviga alla lista delle letterature dopo la creazione o l'aggiornamento
        } catch (err) {
            setError('Failed to submit literature. Please try again later.');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {error && <p className="text-red-500">{error}</p>}
            
            {/* Seleziona Autore */}
            <div>
                <label htmlFor="author" className="block text-sm font-medium text-green-500">
                    Author:
                </label>
                <select
                    id="author"
                    value={authorId}
                    onChange={(e) => setAuthorId(e.target.value)}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md text-black"
                    required
                >
                    <option value="">Select Author</option>
                    {authors.map((author) => (
                        <option key={author.id} value={author.id}>
                            {author.name}
                        </option>
                    ))}
                </select>
            </div>

            {/* Seleziona Opera */}
            <div>
                <label htmlFor="work" className="block text-sm font-medium text-green-500">
                    Work:
                </label>
                <select
                    id="work"
                    value={workId}
                    onChange={(e) => setWorkId(e.target.value)}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md text-black"
                    required
                >
                    <option value="">Select Work</option>
                    {works.map((work) => (
                        <option key={work.id} value={work.id}>
                            {work.title}
                        </option>
                    ))}
                </select>
            </div>

            {/* Bottone per il submit */}
            <div>
                <button
                    type="submit"
                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-500 hover:bg-blue-600"
                >
                    {id ? 'Update Literature' : 'Create Literature'}
                </button>
            </div>
        </form>
    );
};

export default LiteratureForm;
