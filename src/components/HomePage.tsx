import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // Importa Link per la navigazione
import { getWorks } from '../services/workService';
import { getArticles } from '../services/articleService';
import { getAuthors } from '../services/authorService';
import { getHistorySections } from '../services/historyService';
import { Work } from '../interfaces/workInterface';
import { Article } from '../interfaces/articleInterface';
import { Author } from '../interfaces/authorInterface';
import { HistorySection } from '../interfaces/historyInterface';

const HomePage: React.FC = () => {
    const [works, setWorks] = useState<Work[]>([]);
    const [articles, setArticles] = useState<Article[]>([]);
    const [authors, setAuthors] = useState<Author[]>([]);
    const [historySections, setHistorySections] = useState<HistorySection[]>([]);
    const [searchQuery, setSearchQuery] = useState(''); // Stato per la barra di ricerca
    const [filteredResults, setFilteredResults] = useState<any[]>([]); // Stato per i risultati filtrati
    const [error, setError] = useState<string | null>(null);

    // Funzione per caricare i dati al caricamento della pagina
    useEffect(() => {
        const fetchData = async () => {
            try {
                const workData = await getWorks();
                const articleData = await getArticles();
                const authorData = await getAuthors();
                const historySectionData = await getHistorySections();

                setWorks(workData);
                setArticles(articleData);
                setAuthors(authorData);
                setHistorySections(historySectionData);
            } catch (err) {
                setError('Failed to fetch data.');
            }
        };

        fetchData();
    }, []);

    // Funzione per gestire la ricerca
    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value.toLowerCase();
        setSearchQuery(query);

        const filteredWorks = works.filter(work =>
            work.title.toLowerCase().includes(query)
        );
        const filteredArticles = articles.filter(article =>
            article.title.toLowerCase().includes(query)
        );
        const filteredAuthors = authors.filter(author =>
            author.name.toLowerCase().includes(query)
        );
        const filteredHistorySections = historySections.filter(section =>
            section.title.toLowerCase().includes(query)
        );

        setFilteredResults([
            ...filteredWorks,
            ...filteredArticles,
            ...filteredAuthors,
            ...filteredHistorySections,
        ]);
    };

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-2xl font-bold mb-4">Home Page</h1>

            {/* Barra di ricerca globale */}
            <input
                type="text"
                value={searchQuery}
                onChange={handleSearch}
                placeholder="Search for works, articles, authors, or history sections..."
                className="mb-6 p-2 border border-gray-300 rounded w-full"
            />

            {/* Mostra risultati filtrati */}
            {searchQuery && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredResults.length === 0 ? (
                        <p>No results found</p>
                    ) : (
                        filteredResults.map((item, index) => (
                            <div key={index} className="bg-white shadow-md rounded-lg p-4">
                                <h2 className="text-xl font-bold">
                                    {/* Condizionale per determinare il tipo di elemento */}
                                    {item.title || item.name}
                                </h2>
                                <p>{item.content || item.genre || item.biography}</p>
                                {item.historicalPeriod && <p>{item.historicalPeriod}</p>}

                                {/* Link per navigare alla lista in base al tipo di elemento */}
                                {item.title && item.genre && (
                                    <Link to={`/works`} className="text-blue-500 hover:underline">
                                        View Works List
                                    </Link>
                                )}
                                {item.title && item.content && (
                                    <Link to={`/articles`} className="text-blue-500 hover:underline">
                                        View Articles List
                                    </Link>
                                )}
                                {item.name && (
                                    <Link to={`/authors`} className="text-blue-500 hover:underline">
                                        View Authors List
                                    </Link>
                                )}
                                {item.title && item.historicalPeriod && (
                                    <Link to={`/history-sections`} className="text-blue-500 hover:underline">
                                        View History Sections List
                                    </Link>
                                )}
                            </div>
                        ))
                    )}
                </div>
            )}

            {/* Mostra i dati più recenti */}
            {!searchQuery && (
                <>
                    <h2 className="text-xl font-bold">Latest Work</h2>
                    {works.length > 0 ? (
                        <div className="bg-white shadow-md rounded-lg p-4">
                            <h2 className="text-xl font-bold">{works[0].title}</h2>
                            <p>Genre: {works[0].genre}</p>
                            <p>Author: {works[0].authorId}</p>
                            <p>Created At: {new Date(works[0].createdAt).toLocaleDateString()}</p>
                            <Link to={`/works`} className="text-blue-500 hover:underline">
                                View Works List
                            </Link>
                        </div>
                    ) : (
                        <p>No works available.</p>
                    )}
                </>
            )}
        </div>
    );
};

export default HomePage;
