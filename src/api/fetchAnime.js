import axios from 'axios';

const BASE_URL = "https://api.jikan.moe/v4";

// Rate limiting utility
class RateLimiter {
  constructor(requestsPerSecond = 1) {
    this.requestsPerSecond = requestsPerSecond;
    this.lastRequestTime = 0;
    this.requestQueue = [];
    this.processing = false;
  }

  async makeRequest(requestFn) {
    return new Promise((resolve, reject) => {
      this.requestQueue.push({ requestFn, resolve, reject });
      this.processQueue();
    });
  }

  async processQueue() {
    if (this.processing || this.requestQueue.length === 0) return;
    
    this.processing = true;
    
    while (this.requestQueue.length > 0) {
      const { requestFn, resolve, reject } = this.requestQueue.shift();
      
      const now = Date.now();
      const timeSinceLastRequest = now - this.lastRequestTime;
      const minInterval = 1000 / this.requestsPerSecond;
      
      if (timeSinceLastRequest < minInterval) {
        const waitTime = minInterval - timeSinceLastRequest;
        await new Promise(r => setTimeout(r, waitTime));
      }
      
      try {
        this.lastRequestTime = Date.now();
        const result = await requestFn();
        resolve(result);
      } catch (error) {
        if (error.response?.status === 429) {
          // Re-queue the request with exponential backoff
          const retryDelay = Math.min(5000, 1000 * Math.pow(2, Math.random()));
          console.log(`429: waiting ${retryDelay} ms`);
          await new Promise(r => setTimeout(r, retryDelay));
          this.requestQueue.unshift({ requestFn, resolve, reject });
        } else {
          reject(error);
        }
      }
    }
    
    this.processing = false;
  }
}

// Create rate limiter instance (1 request per second to be safe)
const rateLimiter = new RateLimiter(0.8);

// Genre mapping for easier reference
const GENRE_MAP = {
  action: 1,
  romance: 22,
  fantasy: 10,
  comedy: 4,
  drama: 8,
  thriller: 41,
  horror: 14,
  mystery: 7,
  supernatural: 37
};

// Helper function to transform anime data for your card component
const transformAnimeData = (anime) => {
  return {
    mal_id: anime.mal_id,
    title: anime.title_english || anime.title, // Use English title if available
    image: anime.images?.jpg?.large_image_url || anime.images?.jpg?.image_url, // High quality image
    year: anime.aired?.from ? new Date(anime.aired.from).getFullYear() : 'N/A',
    genres: anime.genres?.map(genre => genre.name) || [],
    synopsis: anime.synopsis || 'No synopsis available',
    score: anime.score,
    members: anime.members,
    type: anime.type,
    aired: anime.aired
  };
};

// Helper function to check if anime is Japanese and recent (within 2 years)
const filterAnime = (anime, minMembers = 20000) => {
  const currentYear = new Date().getFullYear();
  const startYear = anime.aired?.from ? new Date(anime.aired.from).getFullYear() : 0;
  
  return (
    anime.type === 'TV' || anime.type === 'Movie' || anime.type === 'ONA' ||
    anime.type === 'OVA'
  ) &&
  startYear <= currentYear && 
  startYear >= 2010 && // Not too old
  anime.members >= minMembers && // Popular enough
  anime.score >= 6.0; // Decent rating
};

// Fetch top anime (famous anime sorted by popularity)
export const fetchTopAnime = async (limit = 9) => {
  try {
    const response = await rateLimiter.makeRequest(async () => {
      return await axios.get(`${BASE_URL}/top/anime`, {
        params: {
          limit: Math.min(limit * 3, 25), // Fetch more to account for filtering
          type: 'tv'
        }
      });
    });

    let filteredAnime = response.data.data
      .filter(anime => filterAnime(anime, 50000)) // Higher threshold for top anime
      .sort((a, b) => new Date(b.aired?.from || 0) - new Date(a.aired?.from || 0)) // Sort by release date (descending)
      .slice(0, limit)
      .map(transformAnimeData); // Transform data for your card component

    return filteredAnime;
  } catch (error) {
    console.error('Error fetching top anime:', error);
    return [];
  }
};

// Fetch anime by genre using top endpoint and filter client-side
export const fetchAnimeByGenre = async (genreName, limit = 9) => {
  try {
    const genreId = GENRE_MAP[genreName.toLowerCase()];
    if (!genreId) {
      console.error(`Genre "${genreName}" not found in mapping`);
      return [];
    }

    // Fetch from top anime endpoint
    const response = await rateLimiter.makeRequest(async () => {
      return await axios.get(`${BASE_URL}/top/anime`, {
        params: {
          limit: 25 // Fetch more to have enough after filtering
        }
      });
    });

    // Filter by genre, popularity, and recency client-side
    let filteredAnime = response.data.data
      .filter(anime => {
        // Check if anime has the desired genre
        const hasGenre = anime.genres?.some(genre => genre.mal_id === genreId);
        return hasGenre && filterAnime(anime, 20000); // Medium popularity threshold
      })
      .sort((a, b) => new Date(b.aired?.from || 0) - new Date(a.aired?.from || 0)) // Sort by release date (descending)
      .slice(0, limit)
      .map(transformAnimeData); // Transform data for your card component

    // If we don't have enough results, try searching by genre directly
    if (filteredAnime.length < limit) {
      try {
        const genreResponse = await rateLimiter.makeRequest(async () => {
          return await axios.get(`${BASE_URL}/anime`, {
            params: {
              genres: genreId,
              order_by: 'members',
              sort: 'desc',
              limit: limit * 2,
              min_score: 6.0
            }
          });
        });

        const additionalAnime = genreResponse.data.data
          .filter(anime => filterAnime(anime, 15000))
          .filter(anime => !filteredAnime.some(existing => existing.mal_id === anime.mal_id))
          .sort((a, b) => new Date(b.aired?.from || 0) - new Date(a.aired?.from || 0))
          .map(transformAnimeData); // Transform additional data

        filteredAnime = [...filteredAnime, ...additionalAnime].slice(0, limit);
      } catch (genreError) {
        console.warn(`Fallback genre search failed for ${genreName}:`, genreError.message);
      }
    }

    return filteredAnime;
  } catch (error) {
    console.error(`Error fetching ${genreName} anime:`, error);
    return [];
  }
};

// Search anime by query
export const searchAnime = async (query, limit = 20) => {
  try {
    if (!query || query.trim().length === 0) {
      return [];
    }

    const trimmedQuery = query.trim().toLowerCase();

    // First: Search by title/name
    const nameResponse = await rateLimiter.makeRequest(async () => {
      return await axios.get(`${BASE_URL}/anime`, {
        params: {
          q: query.trim(),
          limit: Math.min(limit, 25),
          order_by: 'members',
          sort: 'desc',
          min_score: 5.0
        }
      });
    });

    let results = nameResponse.data.data
      .filter(anime => anime.members >= 5000)
      .sort((a, b) => {
        const memberDiff = b.members - a.members;
        if (Math.abs(memberDiff) > 10000) return memberDiff;
        return new Date(b.aired?.from || 0) - new Date(a.aired?.from || 0);
      })
      .map(transformAnimeData);

    // Second: If query matches a genre name and we need more results, search by genre
    const genreId = GENRE_MAP[trimmedQuery];
    if (genreId && results.length < limit) {
      try {
        const genreResponse = await rateLimiter.makeRequest(async () => {
          return await axios.get(`${BASE_URL}/anime`, {
            params: {
              genres: genreId,
              order_by: 'members',
              sort: 'desc',
              limit: Math.min(limit, 25),
              min_score: 5.0
            }
          });
        });

        const genreResults = genreResponse.data.data
          .filter(anime => anime.members >= 5000)
          .filter(anime => !results.some(existing => existing.mal_id === anime.mal_id)) // Avoid duplicates
          .sort((a, b) => {
            const memberDiff = b.members - a.members;
            if (Math.abs(memberDiff) > 10000) return memberDiff;
            return new Date(b.aired?.from || 0) - new Date(a.aired?.from || 0);
          })
          .map(transformAnimeData);

        // Combine results: name matches first, then genre matches
        results = [...results, ...genreResults];
      } catch (genreError) {
        console.warn(`Genre search failed for ${query}:`, genreError.message);
      }
    }

    return results.slice(0, limit);
  } catch (error) {
    console.error('Error searching anime:', error);
    return [];
  }
};

// Usage example for your existing code:
export const loadAnimeData = async () => {
  try {
    const [topAnime, actionAnime, romanceAnime, fantasyAnime] = await Promise.all([
      fetchTopAnime(9),
      fetchAnimeByGenre("action", 9),
      fetchAnimeByGenre("romance", 9),
      fetchAnimeByGenre("fantasy", 9)
    ]);

    return {
      topAnime,
      actionAnime,
      romanceAnime,
      fantasyAnime
    };
  } catch (error) {
    console.error('Error loading anime data:', error);
    return {
      topAnime: [],
      actionAnime: [],
      romanceAnime: [],
      fantasyAnime: []
    };
  }
};

// For navigation search
export const handleSearch = async (query, navigate) => {
  navigate(`/search?query=${encodeURIComponent(query)}`);
  return await searchAnime(query, 20);
};