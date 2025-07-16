import axios from 'axios';

const baseURL = 'http://backend:8010';

export const apiClient = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});
