import supabase from "../data/API_Config";
import { useState, useEffect } from "react";

export const fetchFavorites = async () => {
  try {
    const { data, error } = await supabase.from("favorites").select(`
      recipe_id,
      recipes (
        id,
        title,
        image
      )
    `);

    if (error) throw error;

    return data.map((fav) => ({
      id: fav.recipes.id,
      name: fav.recipes.title,
      image: fav.recipes.image,
      isFavorite: true,
    }));
  } catch (error) {
    console.error("Error fetching favorites:", error.message);
    return [];
  }
};

export const handleFavoritesChange = (callback) => {
  const realTime = supabase
    .channel("favorites_changes")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "favorites" },
      callback
    )
    .subscribe();

  return () => {
    realTime.unsubscribe();
  };
};

export const useWeekplannerController = () => {
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedCellId, setSelectedCellId] = useState(null);
    const [cellData, setCellData] = useState(Array(21).fill(null));
    const [favorites, setFavorites] = useState([]);
  
    useEffect(() => {
      const loadFavorites = async () => {
        const data = await fetchFavorites();
        setFavorites(data);
      };
  
      loadFavorites();
  
      const unsubscribe = handleFavoritesChange(() => {
        loadFavorites();
      });
  
      return () => {
        unsubscribe();
      };
    }, []);
  
    const addRecipeToCell = (recipe) => {
      if (selectedCellId !== null) {
        const newCellData = [...cellData];
        newCellData[selectedCellId] = recipe;
        setCellData(newCellData);
      }
      setModalVisible(false);
    };
  
    return {
      modalVisible,
      setModalVisible,
      selectedCellId,
      setSelectedCellId,
      cellData,
      favorites,
      addRecipeToCell,
    };
  };