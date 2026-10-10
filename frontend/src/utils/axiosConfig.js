
import axios from "axios";



const API_URL = "https://tricity-backend.onrender.com/api/v1";

const client = axios.create({
  baseURL: `${API_URL}/users`,
});

export const bookingClient = axios.create({
  baseURL: `${API_URL}/bookings`,
});

export default client;
