import axios from 'axios';

const API_BASE_URL = 'https://devcache-1dab1743a0c1.herokuapp.com/api/v1';

// Create an instance of Axios with the base URL
const api = axios.create({ baseURL: API_BASE_URL });

// Define API endpoints and their corresponding functions
export const fetchOpportunities = () => api.get('/opportunities');

export const createOpportunity = async (opportunityData) => {
    return api.post('/opportunities', opportunityData);
};


export const updateOpportunity = async (id, opportunityData) => {
    return api.put(`/opportunities/${id}`, opportunityData);
};

export const createMember = async (memberData) => {
    return api.post('/members', memberData);
};

export const nextStage = async (id, stage_history) => {
    return api.put(`/opportunities/${id}/stage_history`, stage_history);
};

export const search = async (query) => {
    return api.get(`/search?query=${query}`);
};

// Create a member with data

// Add more API calls as needed for your application

export default api; // Export the Axios instance