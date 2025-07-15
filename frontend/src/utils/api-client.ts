import axios from 'axios';

const baseURL = 'http://localhost:8010'; // Define this explicitly

export const apiClient = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});
