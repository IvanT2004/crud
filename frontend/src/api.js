import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000', // Asegúrate de que la URL base sea correcta
});

api.interceptors.request.use(request => {
  console.log('Starting Request', request);
  return request;
});

api.interceptors.response.use(response => {
  console.log('Response:', response);
  return response;
});

export default api;
