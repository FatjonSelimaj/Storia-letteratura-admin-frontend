import axios from 'axios';
import { Work } from '../interfaces/workInterface';

const API_URL = import.meta.env.VITE_API_URL;

// Ottieni tutte le opere
export const getWorks = async (): Promise<Work[]> => {
    try {
        const response = await axios.get(`${API_URL}/api/works`);
        return response.data;
    } catch (error) {
        console.error('Error fetching works:', error);
        throw new Error('Failed to fetch works.');
    }
};

// Ottieni un'opera specifica per ID
export const getWorkById = async (id: string): Promise<Work> => {
    try {
        const response = await axios.get(`${API_URL}/api/works/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching work with ID ${id}:`, error);
        throw new Error('Failed to fetch work.');
    }
};

// Crea una nuova opera
export const createWork = async (data: { title: string, genre: string, authorId: string }): Promise<void> => {
    try {
        await axios.post(`${API_URL}/api/works`, data);
    } catch (error) {
        console.error('Error creating work:', error);
        throw new Error('Failed to create work.');
    }
};

// Aggiorna un'opera esistente
export const updateWork = async (id: string, data: { title: string, genre: string, authorId: string }): Promise<void> => {
    try {
        await axios.put(`${API_URL}/api/works/${id}`, data);
    } catch (error) {
        console.error(`Error updating work with ID ${id}:`, error);
        throw new Error('Failed to update work.');
    }
};

// Elimina un'opera
export const deleteWork = async (id: string): Promise<void> => {
    try {
        await axios.delete(`${API_URL}/api/works/${id}`);
    } catch (error) {
        console.error(`Error deleting work with ID ${id}:`, error);
        throw new Error('Failed to delete work.');
    }
};
