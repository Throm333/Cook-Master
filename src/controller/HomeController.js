import { useState, useEffect, useCallback } from "react";
import { debounce } from "lodash";
import supabase from "../data/API_Config";

export const HomeController = () => {
  const [recipes, setRecipes] = useState([]);
  const [favorites, setFavorites] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const fetchRecipes = useCallback(async (query = "") => {
    setIsLoading(true);
    try {
      let supabaseQuery = supabase.from("recipes").select("*").limit(16);

      if (query.trim()) {
        supabaseQuery = supabaseQuery.ilike("title", `%${query}%`);
      }

      const { data, error } = await supabaseQuery;
      if (error) throw error;
      setRecipes(data || []);
    } catch (error) {
      console.error("Fehler beim Abrufen der Rezepte:", error.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const debouncedFetchRecipes = useCallback(
    debounce((query) => fetchRecipes(query), 300),
    []
  );

  useEffect(() => {
    fetchRecipes();
  }, [fetchRecipes]);

  useEffect(() => {
    debouncedFetchRecipes(searchQuery);
  }, [searchQuery, debouncedFetchRecipes]);

  const toggleFavorite = useCallback((id) => {
    setFavorites((prevFavorites) => ({
      ...prevFavorites,
      [id]: !prevFavorites[id],
    }));
  }, []);

  const handleSearchQueryChange = useCallback(
    (query) => {
      setSearchQuery(query);
      debouncedFetchRecipes(query);
    },
    [debouncedFetchRecipes]
  );

  return {
    recipes,
    favorites,
    searchQuery,
    isLoading,
    setSearchQuery: handleSearchQueryChange,
    toggleFavorite,
  };
};
