import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Article } from '../interfaces/articleInterface';
import axios from 'axios';

// Servizio API per la gestione degli articoli
const API_URL = import.meta.env.VITE_API_URL;
const ADMIN_SECRET = import.meta.env.VITE_ADMIN_SECRET;

// Funzioni per l'interazione con l'API

// Ottiene tutti gli articoli
const getArticles = async (): Promise<Article[]> => {
    try {
        const response = await axios.get(`${API_URL}/api/articles`);
        return response.data;
    } catch (error) {
        console.error('Error fetching articles:', error);
        throw new Error('Failed to fetch articles. Please try again later.');
    }
};

// Ottiene un articolo per ID
const getArticleById = async (id: string): Promise<Article> => {
    try {
        const response = await axios.get(`${API_URL}/api/articles/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching article with ID ${id}:`, error);
        throw new Error(`Failed to fetch article with ID ${id}. Please try again later.`);
    }
};

// Crea un nuovo articolo
const createArticle = async (article: Omit<Article, 'id'>): Promise<void> => {
    try {
        await axios.post(`${API_URL}/api/articles`, article, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${ADMIN_SECRET}`,
            },
        });
    } catch (error) {
        console.error('Error creating article:', error);
        throw new Error('Failed to create article. Please try again later.');
    }
};

// Aggiorna un articolo esistente
const updateArticle = async (id: string, article: Omit<Article, 'id'>): Promise<void> => {
    try {
        await axios.put(`${API_URL}/api/articles/${id}`, article, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${ADMIN_SECRET}`,
            },
        });
    } catch (error) {
        console.error(`Error updating article with ID ${id}:`, error);
        throw new Error(`Failed to update article with ID ${id}. Please try again later.`);
    }
};

// Elimina un articolo
const deleteArticle = async (id: string): Promise<void> => {
    try {
        await axios.delete(`${API_URL}/api/articles/${id}`, {
            headers: {
                Authorization: `Bearer ${ADMIN_SECRET}`,
            },
        });
    } catch (error) {
        console.error(`Error deleting article with ID ${id}:`, error);
        throw new Error(`Failed to delete article with ID ${id}. Please try again later.`);
    }
};

// Componente ArticleForm
const ArticleForm: React.FC = () => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [category, setCategory] = useState('');
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();
    const { id } = useParams<string>(); // Ottiene l'ID dell'articolo dalla route

    // Effetto per caricare i dati dell'articolo se l'ID esiste
    useEffect(() => {
        if (id) {
            const fetchArticle = async () => {
                try {
                    const article = await getArticleById(id); // Richiama l'articolo dal backend
                    setTitle(article.title);
                    setContent(article.content);
                    setCategory(article.category);
                } catch (err) {
                    setError('Error fetching article data');
                }
            };
            fetchArticle();
        }
    }, [id]); // L'effetto viene eseguito solo se cambia l'ID

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Dati coerenti con quanto richiesto dal backend
        const articleData = {
            title,
            content,
            category,
        };

        try {
            if (id) {
                // Se c'è un ID, aggiorna l'articolo esistente
                await updateArticle(id, articleData);
            } else {
                // Se non c'è un ID, crea un nuovo articolo
                await createArticle(articleData);
            }
            // Dopo la creazione o l'aggiornamento, naviga alla lista degli articoli
            navigate('/articles');
        } catch (err: any) {
            // Gestione degli errori, inclusi i conflitti per titoli duplicati
            if (err.response && err.response.status === 409) {
                setError('An article with this title already exists. Please choose a different title.');
            } else {
                setError('Failed to submit the article. Please try again later.');
            }
        }
    };

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
                    required // Il campo titolo è obbligatorio
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-green-500">Content:</label>
                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="mt-1 block w-full text-black p-2 border border-gray-300"
                    required // Il campo contenuto è obbligatorio
                ></textarea>
            </div>
            <div>
                <label className="block text-sm font-medium text-green-500">Category:</label>
                <input
                    type="text"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="mt-1 block w-full text-black p-2 border border-gray-300"
                    required // Il campo categoria è obbligatorio
                />
            </div>
            <button
                type="submit"
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-500 hover:bg-blue-600"
            >
                {id ? 'Update Article' : 'Create Article'}
            </button>
        </form>
    );
};

export default ArticleForm;
