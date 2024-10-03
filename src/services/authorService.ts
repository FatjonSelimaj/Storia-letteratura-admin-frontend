import axios from 'axios';
import { Author } from '../interfaces/authorInterface';

export const API_URL = import.meta.env.VITE_API_URL;
const ADMIN_SECRET = import.meta.env.VITE_ADMIN_SECRET;

// Ottiene tutti gli autori
export const getAuthors = async (): Promise<Author[]> => {
    try {
        const response = await axios.get(`${API_URL}/api/authors`);
        return response.data;
    } catch (error) {
        console.error('Error fetching authors:', error);
        throw new Error('Failed to fetch authors. Please try again later.');
    }
};

// Ottiene un autore per ID
export const getAuthorById = async (id: string): Promise<Author> => {
    try {
        const response = await axios.get(`${API_URL}/api/authors/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching author with ID ${id}:`, error);
        throw new Error(`Failed to fetch author with ID ${id}. Please try again later.`);
    }
};

// Crea un nuovo autore
export const createAuthor = async (author: Omit<Author, 'id'>): Promise<void> => {
    try {
        await axios.post(`${API_URL}/api/authors`, author, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${ADMIN_SECRET}`,
            },
        });
    } catch (error) {
        console.error('Error creating author:', error);
        throw new Error('Failed to create author. Please try again later.');
    }
};

// Aggiorna un autore esistente
export const updateAuthor = async (id: string, author: Omit<Author, 'id'>): Promise<void> => {
    try {
        await axios.put(`${API_URL}/api/authors/${id}`, author, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${ADMIN_SECRET}`,
            },
        });
    } catch (error) {
        console.error(`Error updating author with ID ${id}:`, error);
        throw new Error(`Failed to update author with ID ${id}. Please try again later.`);
    }
};

// Elimina un autore
export const deleteAuthor = async (id: string): Promise<void> => {
    try {
        await axios.delete(`${API_URL}/api/authors/${id}`, {
            headers: {
                Authorization: `Bearer ${ADMIN_SECRET}`,
            },
        });
    } catch (error) {
        console.error(`Error deleting author with ID ${id}:`, error);
        throw new Error(`Failed to delete author with ID ${id}. Please try again later.`);
    }
};
