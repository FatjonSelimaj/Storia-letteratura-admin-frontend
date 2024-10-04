import axios from 'axios';
import { Article } from '../interfaces/articleInterface';

export const API_URL = import.meta.env.VITE_API_URL;
const ADMIN_SECRET = import.meta.env.ADMIN_SECRET;

// Get all articles
export const getArticles = async (): Promise<Article[]> => {
    try {
        const response = await axios.get(`${API_URL}/api/articles`);
        return response.data;
    } catch (error) {
        console.error('Error fetching articles:', error);
        throw new Error('Failed to fetch articles. Please try again later.');
    }
};

// Get article by ID
export const getArticleById = async (id: string): Promise<Article> => {
    try {
        const response = await axios.get(`${API_URL}/api/articles/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching article with ID ${id}:`, error);
        throw new Error(`Failed to fetch article with ID ${id}. Please try again later.`);
    }
};

// Create a new article
export const createArticle = async (article: Omit<Article, 'id'>): Promise<void> => {
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

// Update an article
export const updateArticle = async (id: string, article: Partial<Article>): Promise<void> => {
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

// Delete an article
export const deleteArticle = async (id: string): Promise<void> => {
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
