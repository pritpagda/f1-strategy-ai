import axios from 'axios';

const api = axios.create({
    baseURL: process.env.REACT_APP_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

<<<<<<< HEAD
export default api;
=======
export default api;
>>>>>>> f573c20f5619dc5a654373599aa9deb4b5c7eac1
