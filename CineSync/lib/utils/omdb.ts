import axios from 'axios';

interface OMDbMovieDetails {
    Title: string;
    Year: string;
    Rated: string;
    Released: string;
    Runtime: string;
    Genre: string;
    Director: string;
    Writer: string;
    Actors: string;
    Plot: string;
    Language: string;
    Country: string;
    Awards: string;
    Poster: string;
    Ratings: Array<{ Source: string; Value: string }>;
    Metascore: string;
    imdbRating: string;
    imdbVotes: string;
    imdbID: string;
    Type: string;
    DVD: string;
    BoxOffice: string;
    Production: string;
    Website: string;
    Response: string;
    Error?: string;
}

interface OMDbSearchResult {
    Search: Array<{
        Title: string;
        Year: string;
        imdbID: string;
        Type: string;
        Poster: string;
    }>;
    totalResults: string;
    Response: string;
    Error?: string;
}

const OMDB_BASE_URL = 'https://www.omdbapi.com/';

/**
 * Fetch movie details by IMDb ID
 */
export async function getMovieByImdbId(imdbId: string): Promise<OMDbMovieDetails | null> {
    const apiKey = process.env.OMDB_KEY;

    if (!apiKey) {
        throw new Error('OMDB_KEY is not configured');
    }

    try {
        const response = await axios.get<OMDbMovieDetails>(OMDB_BASE_URL, {
            params: {
                apikey: apiKey,
                i: imdbId,
                plot: 'full',
            },
        });

        if (response.data.Response === 'False') {
            console.warn(`OMDb: ${response.data.Error}`);
            return null;
        }

        return response.data;
    } catch (error) {
        console.error('OMDb API error:', error);
        throw error;
    }
}

/**
 * Search movies by title
 */
export async function searchMoviesByTitle(
    title: string,
    year?: string,
    type: 'movie' | 'series' | 'episode' = 'movie'
): Promise<OMDbSearchResult['Search'] | null> {
    const apiKey = process.env.OMDB_KEY;

    if (!apiKey) {
        throw new Error('OMDB_KEY is not configured');
    }

    try {
        const response = await axios.get<OMDbSearchResult>(OMDB_BASE_URL, {
            params: {
                apikey: apiKey,
                s: title,
                y: year,
                type,
            },
        });

        if (response.data.Response === 'False') {
            console.warn(`OMDb search: ${response.data.Error}`);
            return null;
        }

        return response.data.Search;
    } catch (error) {
        console.error('OMDb API search error:', error);
        throw error;
    }
}

/**
 * Fetch movie details by title (exact match)
 */
export async function getMovieByTitle(
    title: string,
    year?: string
): Promise<OMDbMovieDetails | null> {
    const apiKey = process.env.OMDB_KEY;

    if (!apiKey) {
        throw new Error('OMDB_KEY is not configured');
    }

    try {
        const response = await axios.get<OMDbMovieDetails>(OMDB_BASE_URL, {
            params: {
                apikey: apiKey,
                t: title,
                y: year,
                plot: 'full',
            },
        });

        if (response.data.Response === 'False') {
            console.warn(`OMDb: ${response.data.Error}`);
            return null;
        }

        return response.data;
    } catch (error) {
        console.error('OMDb API error:', error);
        throw error;
    }
}
