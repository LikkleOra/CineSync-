import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const TMDB_API_BASE_URL = 'https://api.themoviedb.org/3';

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    const movieId = params.id;
    const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY;

    if (!apiKey) {
        return NextResponse.json({ error: 'TMDB API key not configured' }, { status: 500 });
    }

    try {
        // 1. Fetch detailed info (tagline, runtime)
        const detailsPromise = axios.get(`${TMDB_API_BASE_URL}/movie/${movieId}`, {
            params: { api_key: apiKey, language: 'en-US' }
        });

        // 2. Fetch videos (trailers)
        const videosPromise = axios.get(`${TMDB_API_BASE_URL}/movie/${movieId}/videos`, {
            params: { api_key: apiKey, language: 'en-US' }
        });

        // 3. Fetch watch providers
        const providersPromise = axios.get(`${TMDB_API_BASE_URL}/movie/${movieId}/watch/providers`, {
            params: { api_key: apiKey }
        });

        const [detailsRes, videosRes, providersRes] = await Promise.all([
            detailsPromise,
            videosPromise,
            providersPromise
        ]);

        // Extract official trailer
        const videos = videosRes.data.results || [];
        const trailer = videos.find((v: any) => v.type === 'Trailer' && v.site === 'YouTube' && v.official)
            || videos.find((v: any) => v.type === 'Trailer' && v.site === 'YouTube');

        return NextResponse.json({
            tagline: detailsRes.data.tagline,
            runtime: detailsRes.data.runtime,
            trailer: trailer ? { key: trailer.key, site: trailer.site } : null,
            providers: providersRes.data.results?.US || null
        });

    } catch (error: any) {
        console.error(`Error fetching extras for movie ${movieId}:`, error.message);
        return NextResponse.json({ error: 'Failed to fetch movie extras' }, { status: 500 });
    }
}
