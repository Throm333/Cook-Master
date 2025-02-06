import { useState, useEffect, useCallback } from "react";
import { debounce } from "lodash";
import supabase from "../data/API_Config";

export const HomeController = () => {
  const [recipes, setRecipes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const fetchRecipes = useCallback(async (query = "", category = null) => {
    setIsLoading(true);
    console.log(
      "Fetching recipes with query:",
      query,
      "and category:",
      category
    );
    try {
      let supabaseQuery = supabase.from("recipes").select(`
          *,
          recipe_categories!inner (
            categories!inner (
              id,
              name
            )
          )
        `);

      if (query.trim()) {
        supabaseQuery = supabaseQuery.ilike("title", `%${query}%`);
      }

      if (category) {
        supabaseQuery = supabaseQuery.eq(
          "recipe_categories.categories.name",
          category
        );
      }

      const { data, error } = await supabaseQuery;

      if (error) {
        console.error("Supabase query error:", error);
        throw error;
      }

      //console.log("Fetched recipes:", data);
      setRecipes(data || []);
    } catch (error) {
      console.error("Fehler beim Abrufen der Rezepte:", error);
      setRecipes([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchCategories = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("categories")
        .select("id, name")
        .order("name");

      if (error) throw error;
      //console.log("Fetched categories:", data);
      setCategories(data || []);
    } catch (error) {
      console.error("Fehler beim Abrufen der Kategorien:", error);
      setCategories([]);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
    fetchRecipes();
  }, [fetchCategories, fetchRecipes]);

  useEffect(() => {
    const debouncedFetch = debounce(() => {
      fetchRecipes(searchQuery, selectedCategory);
    }, 300);

    debouncedFetch();

    return () => {
      debouncedFetch.cancel();
    };
  }, [searchQuery, selectedCategory, fetchRecipes]);

  const handleCategorySelect = useCallback((categoryName) => {
    console.log("Category selected:", categoryName);
    setSelectedCategory((prev) => {
      const newCategory = prev === categoryName ? null : categoryName;
      console.log("New selected category:", newCategory);
      return newCategory;
    });
  }, []);

  return {
    recipes,
    categories,
    selectedCategory,
    searchQuery,
    isLoading,
    setSearchQuery,
    handleCategorySelect,
  };
};
