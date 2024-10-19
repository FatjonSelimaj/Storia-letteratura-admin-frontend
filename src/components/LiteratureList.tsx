import React, { useEffect, useState } from 'react';
import { getLiteratures, deleteLiterature, updateLiterature } from '../services/literatureService';
import { getAuthors } from '../services/authorService';
import { getWorks } from '../services/workService';
import { Literature  } from '../interfaces/literatureInterface';
import { Work } from '../interfaces/authorInterface';
import { Author } from '../interfaces/authorInterface';

const LiteratureList: React.FC = () => {
    const [literatures, setLiteratures] = useState<Literature[]>([]);
    const [authors, setAuthors] = useState<Author[]>([]);
    const [works, setWorks] = useState<Work[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [newAuthorId, setNewAuthorId] = useState<string>('');
    const [newWorkId, setNewWorkId] = useState<string>('');

    useEffect(() => {
        const fetchLiteratures = async () => {
            try {
                const data = await getLiteratures();
                setLiteratures(data);
            } catch (error) {
                setError('Failed to fetch literatures');
            }
        };
        fetchLiteratures();
    }, []);

    useEffect(() => {
        const fetchAuthorsAndWorks = async () => {
            try {
                const [authorsData, worksData] = await Promise.all([getAuthors(), getWorks()]);
                setAuthors(authorsData);
                setWorks(worksData);
            } catch (error) {
                setError('Failed to load authors or works');
            }
        };

        if (editingId) {
            fetchAuthorsAndWorks();
        }
    }, [editingId]);

    const handleDelete = async (id: string) => {
        try {
            await deleteLiterature(id);
            setLiteratures(literatures.filter((literature) => literature.id !== id));
        } catch (err) {
            setError('Failed to delete literature');
        }
    };

    const handleUpdate = async (id: string) => {
        try {
            await updateLiterature(id, { authorId: newAuthorId, workId: newWorkId });
            setLiteratures(
                literatures.map((literature) =>
                    literature.id === id
                        ? { ...literature, authorId: newAuthorId, workId: newWorkId }
                        : literature
                )
            );
            setEditingId(null);
            setNewAuthorId('');
            setNewWorkId('');
        } catch (err) {
            setError('Failed to update literature');
        }
    };

    // Funzione per annullare la modifica
    const handleCancel = () => {
        setEditingId(null);
        setNewAuthorId('');
        setNewWorkId('');
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-4">Literature List</h1>
            {error && <p className="text-red-500">{error}</p>}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {literatures.map((literature) => (
                    <div
                        key={literature.id}
                        className="bg-white text-black shadow-lg rounded-lg p-4 flex flex-col justify-between"
                    >
                        {editingId === literature.id ? (
                            <div>
                                {/* Seleziona Autore */}
                                <div>
                                    <label htmlFor="author" className="block text-sm font-medium text-green-500">
                                        Author:
                                    </label>
                                    <select
                                        id="author"
                                        value={newAuthorId}
                                        onChange={(e) => setNewAuthorId(e.target.value)}
                                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md text-black"
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
                                        value={newWorkId}
                                        onChange={(e) => setNewWorkId(e.target.value)}
                                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md text-black"
                                    >
                                        <option value="">Select Work</option>
                                        {works.map((work) => (
                                            <option key={work.id} value={work.id}>
                                                {work.title}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Bottoni per salvare o annullare */}
                                <div className="flex justify-between mt-4">
                                    <button
                                        onClick={() => handleUpdate(literature.id)}
                                        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                                    >
                                        Save
                                    </button>
                                    <button
                                        onClick={handleCancel}
                                        className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div>
                                <h2 className="text-xl font-semibold mb-2">
                                    Author: {literature.author?.name}
                                </h2>
                                <p className="text-gray-700">Work: {literature.work?.title}</p>
                                <div className="flex justify-between">
                                    <button
                                        onClick={() => setEditingId(literature.id)}
                                        className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition-colors"
                                    >
                                        Update
                                    </button>
                                    <button
                                        onClick={() => handleDelete(literature.id)}
                                        className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default LiteratureList;
