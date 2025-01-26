import { useState, useEffect, useCallback } from "react"
import { debounce } from "lodash"
import supabase from "../data/API_Config"

export const HomeController = () => {
  const [recipes, setRecipes] = useState([])
  const [favorites, setFavorites] = useState({})
  const [searchQuery, setSearchQuery] = useState("")

  const fetchRecipes = async (query = "") => {
    try {
      let supabaseQuery = supabase.from("recipes").select("*").limit(16)

      if (query) {
        supabaseQuery = supabaseQuery.ilike("title", `%${query}%`)
      }

      const { data, error } = await supabaseQuery
      if (error) throw error
      setRecipes(data || [])
    } catch (error) {
      console.error("Fehler beim Abrufen der Rezepte:", error.message)
    }
  }

  const debouncedFetchRecipes = useCallback(
    debounce((query) => fetchRecipes(query), 300),
    [],
  )

  useEffect(() => {
    fetchRecipes()
  }, [fetchRecipes]) 

  useEffect(() => {
    debouncedFetchRecipes(searchQuery)
  }, [searchQuery, debouncedFetchRecipes])

  const toggleFavorite = (id) => {
    setFavorites((prevFavorites) => ({
      ...prevFavorites,
      [id]: !prevFavorites[id],
    }))
  }

  return {
    recipes,
    favorites,
    searchQuery,
    setSearchQuery,
    toggleFavorite,
  }
}

