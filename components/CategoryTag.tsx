import React from 'react'


interface CategoryTagProps{
    categoryName: string;
}

  // We have to change the color of the card in function of the value
  const getColorCategoryTagClass = (categoryName): string => {
    // if((categoryName) =="Dessert"){
    //   return "bg-red-800" 
    // }else if((categoryName)=="Starter"){
    //   return "bg-green-400"
    // }else{
    // return "bg-gray-800"
    // }
    switch (categoryName) {
      case 'Dessert':
        return "bg-red-800" ; // Rouge pour "urgent"
      case 'Starter':
        return "bg-green-400"; // Jaune pour "important"
      case 'Main':
        return "bg-gray-800"; // Vert pour "normal"
      default:
        return 'bg-blue-800 text-black'; // Gris par défaut pour les autres
    }
  }

const CategoryTag:React.FC<CategoryTagProps> = ({ categoryName }) => {


  const color = getColorCategoryTagClass({categoryName});

  return (

    <div className={` text-center w-[15] ${color}`}>
        <p>{categoryName}</p>
    </div>
  )
}

export default CategoryTag