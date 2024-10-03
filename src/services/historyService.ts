import axios from 'axios';
import { HistorySection } from '../interfaces/historyInterface';

export const API_URL = import.meta.env.VITE_API_URL;
const ADMIN_SECRET = import.meta.env.VITE_ADMIN_SECRET;

// services/historyService.ts

// Ottieni tutte le sezioni storiche
export const getHistorySections = async (): Promise<HistorySection[]> => {
    try {
        const response = await axios.get(`${API_URL}/api/history-sections`);  // Mantieni il prefisso '/api' se usato nel backend
        return response.data;
    } catch (error) {
        console.error('Error fetching history sections:', error);
        throw new Error('Failed to fetch history sections.');
    }
};

// Ottieni una singola sezione storica per ID
export const getHistorySectionById = async (id: string): Promise<HistorySection> => {
    try {
        const response = await axios.get(`${API_URL}/api/history-sections/${id}`); // Aggiungi '/api' per coerenza
        return response.data;
    } catch (error) {
        console.error(`Error fetching history section with ID ${id}:`, error);
        throw new Error('Failed to fetch history section.');
    }
};

// Crea una nuova sezione storica
export const createHistorySection = async (data: { title: string, description: string, historicalPeriod: string }): Promise<void> => {
    try {
        await axios.post(`${API_URL}/api/history-sections`, data, {
            headers: {
                Authorization: `Bearer ${ADMIN_SECRET}`,
            },
        });
    } catch (error) {
        console.error('Error creating history section:', error);
        throw new Error('Failed to create history section.');
    }
};

// Aggiorna una sezione storica
export const updateHistorySection = async (id: string, data: { title: string, description: string, historicalPeriod: string }): Promise<void> => {
    try {
        await axios.put(`${API_URL}/api/history-sections/${id}`, data, {
            headers: {
                Authorization: `Bearer ${ADMIN_SECRET}`,
            },
        });
    } catch (error) {
        console.error(`Error updating history section with ID ${id}:`, error);
        throw new Error('Failed to update history section.');
    }
};

// Elimina una sezione storica
export const deleteHistorySection = async (id: string): Promise<void> => {
    try {
        await axios.delete(`${API_URL}/api/history-sections/${id}`, {
            headers: {
                Authorization: `Bearer ${ADMIN_SECRET}`,
            },
        });
    } catch (error) {
        console.error(`Error deleting history section with ID ${id}:`, error);
        throw new Error('Failed to delete history section.');
    }
};
