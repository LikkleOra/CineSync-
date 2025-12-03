'use client';

import { useState, useEffect } from 'react';

const FAVORITES_KEY = 'cinesync_favorites';

export function useFavorites() {
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [isLoaded, setIsLoaded] = useState(false);

  // Load favorites from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(FAVORITES_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setFavorites(new Set(parsed));
        }
      }
    } catch (error) {
      console.error('Failed to load favorites from localStorage:', error);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Persist favorites to localStorage whenever they change
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(FAVORITES_KEY, JSON.stringify(Array.from(favorites)));
      } catch (error) {
        console.error('Failed to save favorites to localStorage:', error);
      }
    }
  }, [favorites, isLoaded]);

  const toggleFavorite = (movieId: string) => {
    setFavorites((prev) => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(movieId)) {
        newFavorites.delete(movieId);
      } else {
        newFavorites.add(movieId);
      }
      return newFavorites;
    });
  };

  const isFavorite = (movieId: string) => favorites.has(movieId);

  const addFavorite = (movieId: string) => {
    setFavorites((prev) => new Set(prev).add(movieId));
  };

  const removeFavorite = (movieId: string) => {
    setFavorites((prev) => {
      const newFavorites = new Set(prev);
      newFavorites.delete(movieId);
      return newFavorites;
    });
  };

  return {
    favorites: Array.from(favorites),
    toggleFavorite,
    isFavorite,
    addFavorite,
    removeFavorite,
    isLoaded,
  };
}
