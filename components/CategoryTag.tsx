import React from 'react';

interface CategoryTagProps {
  categoryName?: string;
}

// Fonction pour obtenir la classe de couleur en fonction du nom de la catégorie
const getColorCategoryTagClass = (categoryName?: string): string => {
  switch (categoryName) {
    case 'Dessert':
      return 'bg-red-800'; 
    case 'Starter':
      return 'bg-green-400'; 
    case 'Main':
      return 'bg-gray-800'; 
    default:
      return 'bg-blue-800 text-black'; 
  }
};

const CategoryTag: React.FC<CategoryTagProps> = ({ categoryName }) => {
  // Appel de la fonction pour obtenir la couleur de la catégorie
  const color = getColorCategoryTagClass(categoryName);

  return (
    <div className={`py-1 px-2 inline-block ${color} rounded-md mb-3`}>
      <p className='text-slate-300'>{categoryName}</p>
    </div>
  );
};

export default CategoryTag;