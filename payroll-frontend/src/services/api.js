import axios from 'axios';

const API = axios.create({
    baseURL: 'http://localhost:8080/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

export const getEmployees = () => API.get('/employees');
export const getPayroll = () => API.get('/payroll');

export default API;