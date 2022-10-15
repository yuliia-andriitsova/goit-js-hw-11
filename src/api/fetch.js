import axios from 'axios';
import Notiflix from 'notiflix';

const API_KEY = '30085761-1d63a83edc62b581f045216a3';
const searchParams = new URLSearchParams({
  key: API_KEY,
  image_type: 'photo',
  orientation: 'horizontal',
  safesearch: 'true',
  per_page: 40,
});

export const BASE_URL = `https://pixabay.com/api/?${searchParams}`;

export async function getPhoto(search, page) {
  try {
    if (!search.trim()) {
      console.log('no arg!');
      return;
    }
    const response = await axios.get(`${BASE_URL}&page=${page}&q=${search}`);
    return response.data;
  } catch (error) {
    Notiflix.Notify.failure(error.message);
  }
}

// =================================
// const API_KEY = '30085761-1d63a83edc62b581f045216a3';
