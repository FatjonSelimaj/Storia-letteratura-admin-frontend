import React, { useState, useEffect } from 'react';
import { getHistorySections, deleteHistorySection } from '../services/historyService';
import { HistorySection } from '../interfaces/historyInterface';
import { useNavigate } from 'react-router-dom';

const HistorySectionList: React.FC = () => {
    const [historySections, setHistorySections] = useState<HistorySection[]>([]);
    const [filteredHistorySections, setFilteredHistorySections] = useState<HistorySection[]>([]); // Stato per gli articoli filtrati
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState(''); // Stato per la query di ricerca
    const navigate = useNavigate();

    useEffect(() => {
        const fetchHistorySections = async () => {
            try {
                const data = await getHistorySections();
                setHistorySections(data);
                setFilteredHistorySections(data); // Imposta gli articoli filtrati uguali a quelli originali inizialmente
            } catch (err) {
                setError('Failed to fetch history sections');
            } finally {
                setLoading(false);
            }
        };

        fetchHistorySections();
    }, []);

    const handleDelete = async (id: string) => {
        try {
            await deleteHistorySection(id);
            setHistorySections(historySections.filter(section => section.id !== id));
            setFilteredHistorySections(filteredHistorySections.filter(section => section.id !== id)); // Aggiorna anche gli articoli filtrati
        } catch (err) {
            setError('Failed to delete history section');
        }
    };

    // Funzione per filtrare le sezioni storiche in base alla query di ricerca
    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value.toLowerCase();
        setSearchQuery(query);
        setFilteredHistorySections(
            historySections.filter(section =>
                section.title.toLowerCase().includes(query) ||  // Filtra per titolo
                section.description.toLowerCase().includes(query) ||  // Filtra per descrizione
                section.historicalPeriod.toLowerCase().includes(query) // Filtra per periodo storico
            )
        );
    };

    return (
        <div className="container mx-auto p-6">
            {loading && <p>Loading...</p>}
            {error && <p className="text-red-500">{error}</p>}
            <h1 className="text-2xl font-bold mb-4">History Sections</h1>

            {/* Barra di ricerca */}
            <input
                type="text"
                value={searchQuery}
                onChange={handleSearch}
                placeholder="Search history sections by title, description, or historical period..."
                className="mb-6 p-2 border text-black border-gray-300 rounded w-full"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredHistorySections.length === 0 ? (
                    <p>No history sections found</p>
                ) : (
                    filteredHistorySections.map((section) => (
                        <HistorySectionCard 
                            key={section.id} 
                            section={section} 
                            onDelete={handleDelete}
                            onEdit={() => navigate(`/history-sections/${section.id}`)}
                        />
                    ))
                )}
            </div>
        </div>
    );
};

interface HistorySectionCardProps {
    section: HistorySection;
    onDelete: (id: string) => void;
    onEdit: () => void;
}

const HistorySectionCard: React.FC<HistorySectionCardProps> = ({ section, onDelete, onEdit }) => {
    const [showMore, setShowMore] = useState(false);

    const maxDescriptionLength = 100;
    const isLongDescription = section.description.length > maxDescriptionLength;

    const toggleShowMore = () => {
        setShowMore((prev) => !prev);
    };

    return (
        <div className="bg-white shadow-md rounded-lg p-4">
            <h2 className="text-xl font-bold">{section.title}</h2>
            <p>
                {showMore || !isLongDescription 
                    ? section.description 
                    : `${section.description.slice(0, maxDescriptionLength)}...`}
            </p>
            {isLongDescription && (
                <button onClick={toggleShowMore} className="text-blue-500 hover:underline">
                    {showMore ? 'Show Less' : 'Show More'}
                </button>
            )}
            <p className="text-black">{section.historicalPeriod}</p>
            <button className="text-blue-500 hover:underline mr-4" onClick={onEdit}>
                Edit
            </button>
            <button className="text-red-500 hover:underline" onClick={() => onDelete(section.id)}>
                Delete
            </button>
        </div>
    );
};

export default HistorySectionList;
