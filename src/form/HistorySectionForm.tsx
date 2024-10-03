import React, { useState, useEffect } from 'react';
import { createHistorySection, updateHistorySection, getHistorySectionById } from '../services/historyService';
import { useNavigate, useParams } from 'react-router-dom';

const HistorySectionForm: React.FC = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [historicalPeriod, setHistoricalPeriod] = useState('');
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();
    const { id } = useParams<string>();

    useEffect(() => {
        if (id) {
            const fetchHistorySection = async () => {
                try {
                    const section = await getHistorySectionById(id);
                    setTitle(section.title);
                    setDescription(section.description);
                    setHistoricalPeriod(section.historicalPeriod);
                } catch (err) {
                    setError('Error fetching history section data');
                }
            };
            fetchHistorySection();
        }
    }, [id]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const historySectionData = { title, description, historicalPeriod };

        try {
            if (id) {
                await updateHistorySection(id, historySectionData);
            } else {
                await createHistorySection(historySectionData);
            }
            navigate('/history-sections');
        } catch (err) {
            setError('Failed to submit the history section. Please try again later.');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {error && <p className="text-red-500">{error}</p>}
            <div>
                <label className="block text-sm font-medium text-gray-700">Title:</label>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="mt-1 block w-full p-2 border border-gray-300"
                    required
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">Description:</label>
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="mt-1 block w-full p-2 border border-gray-300"
                    required
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">Historical Period:</label>
                <input
                    type="text"
                    value={historicalPeriod}
                    onChange={(e) => setHistoricalPeriod(e.target.value)}
                    className="mt-1 block w-full p-2 border border-gray-300"
                    required
                />
            </div>
            <button
                type="submit"
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-500 hover:bg-blue-600"
            >
                {id ? 'Update Section' : 'Create Section'}
            </button>
        </form>
    );
};

export default HistorySectionForm;
