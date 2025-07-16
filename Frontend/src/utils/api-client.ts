import axios from 'axios';

export const apiClient = axios.create({
  baseURL: 'http://54.144.121.136:8010',  // use EC2 IP and port to reach backend from browser
  headers: {
    'Content-Type': 'application/json',
  },
});
