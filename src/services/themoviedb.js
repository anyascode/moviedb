export async function getGuestSession() {
  const response = await fetch('https://api.themoviedb.org/3/authentication/guest_session/new', {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${import.meta.env.VITE_TMDB_API_KEY}`,
    },
  });

  if (!response.ok) {
    throw new Error(response.text());
  }

  return response.json();
}

export async function getMovies(query, page) {
  const response = await fetch(
    `https://api.themoviedb.org/3/search/movie?query=${query}&include_adult=false&language=en-US&page=${page}`,
    {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${import.meta.env.VITE_TMDB_API_KEY}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error(response.text());
  }

  return response.json();
}

export async function rateMovie(movieId, guestSessionId, rating) {
  const response = await fetch(
    `https://api.themoviedb.org/3/movie/${movieId}/rating?guest_session_id=${guestSessionId}`,
    {
      method: 'POST',
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${import.meta.env.VITE_TMDB_API_KEY}`,
        'Content-Type': 'application/json;charset=utf-8',
      },
      body: JSON.stringify({ value: rating }),
    }
  );

  if (!response.ok) {
    throw new Error(response.text());
  }

  return response.json();
}

export async function getRatedMovies(guestSessionId) {
  const response = await fetch(`https://api.themoviedb.org/3/guest_session/${guestSessionId}/rated/movies`, {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${import.meta.env.VITE_TMDB_API_KEY}`,
    },
  });

  if (!response.ok) {
    throw new Error(response.text());
  }

  return response.json();
}

export async function getGenres() {
  const response = await fetch('https://api.themoviedb.org/3/genre/movie/list?language=en', {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${import.meta.env.VITE_TMDB_API_KEY}`,
    },
  });
  if (!response.ok) {
    throw new Error(response.text());
  }

  const data = await response.json();

  return data.genres;
}
