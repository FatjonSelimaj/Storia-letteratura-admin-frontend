import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getArticles, deleteArticle } from '../services/articleService';
import { Article } from '../interfaces/articleInterface';

const ArticleList: React.FC = () => {
    const [articles, setArticles] = useState<Article[]>([]);  // Inizializza come array vuoto
    const [filteredArticles, setFilteredArticles] = useState<Article[]>([]);  // Articoli filtrati
    const [loading, setLoading] = useState<boolean>(true);  // Stato di caricamento
    const [error, setError] = useState<string | null>(null);  // Stato per errori
    const [expandedArticleId, setExpandedArticleId] = useState<string | null>(null);  // Articolo espanso
    const [searchQuery, setSearchQuery] = useState<string>('');  // Stato per la barra di ricerca

    const navigate = useNavigate();

    useEffect(() => {
        const fetchArticles = async () => {
            try {
                const data = await getArticles();
                if (Array.isArray(data)) {  // Assicurati che `data` sia un array
                    setArticles(data);
                    setFilteredArticles(data);  // Imposta gli articoli filtrati uguali a quelli originali
                } else {
                    setError('Data format is incorrect. Expected an array.');
                }
            } catch (err) {
                setError('Failed to fetch articles');
            } finally {
                setLoading(false);
            }
        };

        fetchArticles();
    }, []);

    // Funzione per gestire l'espansione del contenuto
    const handleExpand = (id: string) => {
        setExpandedArticleId(expandedArticleId === id ? null : id);
    };

    // Funzione per gestire la cancellazione dell'articolo
    const handleDelete = async (id: string) => {
        try {
            await deleteArticle(id);
            setArticles(articles.filter(article => article.id !== id));  // Aggiorna lista articoli
            setFilteredArticles(filteredArticles.filter(article => article.id !== id));  // Aggiorna articoli filtrati
        } catch (err) {
            setError('Failed to delete article');
        }
    };

    // Funzione per filtrare gli articoli in base al titolo o contenuto
    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value.toLowerCase();
        setSearchQuery(query);
        setFilteredArticles(
            articles.filter(article =>
                article.title.toLowerCase().includes(query) ||  // Filtra per titolo
                article.content.toLowerCase().includes(query)   // Filtra per contenuto
            )
        );
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <div className="container mx-auto p-6">
            {/* Barra di ricerca */}
            <div className="container mx-auto p-12">
                <input
                    type="text"
                    value={searchQuery}
                    onChange={handleSearch}
                    placeholder="Search articles by title or content..."
                    className="w-full p-3 border text-black border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                />
            </div>

            {/* Lista degli articoli filtrati */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredArticles.length === 0 ? (
                    <p>No articles found</p>
                ) : (
                    filteredArticles.map((article) => (
                        <div
                            key={article.id}
                            className="bg-white shadow-lg rounded-lg p-4 text-blue-600 transform transition duration-300 hover:scale-105"
                        >
                            <h2 className="text-xl font-semibold mb-2">{article.title}</h2>
                            <p className="text-blue-600 mb-4">
                                {expandedArticleId === article.id
                                    ? article.content  // Mostra l'intero contenuto se espanso
                                    : article.content.slice(0, 100) + '...'} {/* Mostra una preview se non espanso */}
                            </p>
                            <button
                                className="text-blue-500 font-medium hover:underline mb-4"
                                onClick={() => handleExpand(article.id || '')}
                            >
                                {expandedArticleId === article.id ? 'Show Less' : 'Show More'}
                            </button>
                            <div className="mt-4 flex justify-between">
                                <button
                                    className="bg-green-500 text-white py-1 px-3 text-sm rounded-lg hover:bg-green-600 transition"
                                    onClick={() => navigate(`/edit-article/${article.id}`)}
                                >
                                    Edit
                                </button>
                                <button
                                    className="bg-red-500 text-white py-1 px-3 text-sm rounded-lg hover:bg-red-600 transition"
                                    onClick={() => handleDelete(article.id || '')}
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

export default ArticleList;
