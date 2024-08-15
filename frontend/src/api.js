import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000',
  //baseURL: ,   /'http://185.173.110.165:5000'/ Asegúrate de que esta URL apunte a tu backend en el servidor
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
