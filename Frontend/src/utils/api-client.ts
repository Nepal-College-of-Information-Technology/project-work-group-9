import axios from 'axios';

export const apiClient = axios.create({
  baseURL: 'http://backend:8010',  // backend service name and port inside Docker network
  headers: {
    'Content-Type': 'application/json',
  },
});
