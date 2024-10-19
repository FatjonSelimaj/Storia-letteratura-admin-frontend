import axios from 'axios';
import { Literature } from '../interfaces/literatureInterface';

const API_URL = import.meta.env.VITE_API_URL;
const ADMIN_SECRET = import.meta.env.VITE_ADMIN_SECRET;

// Ottieni tutte le relazioni letterarie
export const getLiteratures = async (): Promise<Literature[]> => {
    try {
        const response = await axios.get(`${API_URL}/api/literatures`, {
            headers: {
                Authorization: `Bearer ${ADMIN_SECRET}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching literatures:', error);
        throw new Error('Failed to fetch literatures. Please try again later.');
    }
};

// Crea una nuova relazione letteraria
export const createLiterature = async (literature: Omit<Literature, 'id'>): Promise<void> => {
    try {
        await axios.post(`${API_URL}/api/literatures`, literature, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${ADMIN_SECRET}`,
            },
        });
    } catch (error) {
        console.error('Error creating literature:', error);
        throw new Error('Failed to create literature. Please try again later.');
    }
};

// Aggiorna una relazione letteraria esistente
export const updateLiterature = async (id: string, literature: Omit<Literature, 'id'>): Promise<void> => {
    try {
        await axios.put(`${API_URL}/api/literatures/${id}`, literature, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${ADMIN_SECRET}`,
            },
        });
    } catch (error) {
        console.error(`Error updating literature with ID ${id}:`, error);
        throw new Error(`Failed to update literature with ID ${id}. Please try again later.`);
    }
};

// Elimina una relazione letteraria
export const deleteLiterature = async (id: string): Promise<void> => {
    try {
        await axios.delete(`${API_URL}/api/literatures/${id}`, {
            headers: {
                Authorization: `Bearer ${ADMIN_SECRET}`,
            },
        });
    } catch (error) {
        console.error(`Error deleting literature with ID ${id}:`, error);
        throw new Error(`Failed to delete literature with ID ${id}. Please try again later.`);
    }
};
