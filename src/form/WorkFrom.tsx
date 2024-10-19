import React, { useState, useEffect } from 'react';
import { createWork, updateWork, getWorkById } from '../services/workService';
import { getAuthors } from '../services/authorService'; // Importa la funzione per ottenere gli autori
import { useNavigate, useParams } from 'react-router-dom';

// Definizione dell'interfaccia Author
interface Author {
    id: string;
    name: string;
}

const WorkForm: React.FC = () => {
    const [title, setTitle] = useState('');
    const [genre, setGenre] = useState('');
    const [authorId, setAuthorId] = useState('');
    const [links, setLinks] = useState<string[]>([]); // Aggiungi lo stato per i link come array di stringhe
    const [authors, setAuthors] = useState<Author[]>([]); // Usa il tipo Author[]
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();
    const { id } = useParams<string>();

    useEffect(() => {
        // Funzione per caricare gli autori salvati dal backend
        const fetchAuthors = async () => {
            try {
                const authorList = await getAuthors();
                setAuthors(authorList); // Aggiorna lo stato con l'elenco degli autori
                setLoading(false);
            } catch (err) {
                setError('Error fetching authors');
                setLoading(false);
            }
        };

        // Se stiamo modificando un'opera, carica i dati dell'opera
        const fetchWork = async () => {
            if (id) {
                try {
                    const work = await getWorkById(id);
                    setTitle(work.title);
                    setGenre(work.genre);
                    setAuthorId(work.authorId);
                    setLinks(work.links || []); // Assicurati che i link siano un array, anche se vuoto
                } catch (err) {
                    setError('Error fetching work data');
                }
            }
        };

        fetchAuthors();
        fetchWork();
    }, [id]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const workData = { title, genre, authorId, links }; // Includi i link nel payload

        try {
            if (id) {
                await updateWork(id, workData);
            } else {
                await createWork(workData);
            }
            navigate('/works');
        } catch (err) {
            setError('Failed to submit the work. Please try again later.');
        }
    };

    const handleLinksChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setLinks(e.target.value.split('\n').filter(link => link.trim() !== '')); // Assicurati di ottenere un array di stringhe non vuote
    };

    if (loading) {
        return <p>Loading authors...</p>; // Gestione del caricamento
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {error && <p className="text-red-500">{error}</p>}
            <div>
                <label className="block text-sm font-medium text-green-500">Title:</label>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="mt-1 block w-full text-black p-2 border border-gray-300"
                    required
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-green-500">Genre:</label>
                <input
                    type="text"
                    value={genre}
                    onChange={(e) => setGenre(e.target.value)}
                    className="mt-1 block w-full text-black p-2 border border-gray-300"
                    required
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-green-500">Author:</label>
                <select
                    value={authorId}
                    onChange={(e) => setAuthorId(e.target.value)}
                    className="mt-1 block w-full text-black p-2 border border-gray-300"
                    required
                >
                    <option value="">Select an Author</option>
                    {authors.map((author) => (
                        <option key={author.id} value={author.id}>
                            {author.name}
                        </option>
                    ))}
                </select>
            </div>
            <div>
                <label className="block text-sm font-medium text-green-500">Links (one per line):</label>
                <textarea
                    value={links.join('\n')}  // Converti l'array in una stringa separata da nuove righe
                    onChange={handleLinksChange}  // Ogni nuova riga è un nuovo link
                    className="mt-1 block w-full text-black p-2 border border-gray-300"
                    placeholder="Enter one link per line"
                ></textarea>
            </div>
            <button
                type="submit"
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-500 hover:bg-blue-600"
            >
                {id ? 'Update Work' : 'Create Work'}
            </button>
        </form>
    );
};

export default WorkForm;
