import React, { useEffect, useState } from 'react';
import FoodItem from '../FoodItem/FoodItem';
import './FoodDisplay.css';
import { food_list } from '../../assets/assets'; // Import the static food_list

const FoodDisplay = ({ category }) => {
  const [filteredFoodList, setFilteredFoodList] = useState([]);

  useEffect(() => {
    // Filter food items based on the selected category
    const filtered = category === "All"
      ? food_list
      : food_list.filter(item => item.category?.toLowerCase() === category.toLowerCase());

    setFilteredFoodList(filtered);
  }, [category]);

  return (
    <div className="food-display">
      <div className="food-display-list">
        {filteredFoodList.length > 0 ? (
          filteredFoodList.map((item) => (
            <FoodItem
              key={item._id}
              id={item._id}
              image={item.image}
              name={item.name}
              price={item.price}
              description={item.description}
            />
          ))
        ) : (
          <p>No items available in this category.</p>
        )}
      </div>
    </div>
  );
};

export default FoodDisplay;