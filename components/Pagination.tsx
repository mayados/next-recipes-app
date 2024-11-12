import React from 'react'


interface PaginationProps {
  page: number;
  maxPages: number;
  previousAction?: () => void;
  nextAction?: () => void;
//   type?:  "submit" | "reset" | "button" | undefined;
}


const Pagination:React.FC<PaginationProps> = ({page,maxPages,previousAction, nextAction}) => {

  
    return (
        <div className="flex justify-center gap-3 mt-4">
            <button 
            onClick={previousAction} 
            disabled={page === 1} 
            className="px-4 py-2 bg-gray-700 text-white rounded-md"
            >
            Previous
            </button>
            <span className="text-white">Page {page} / {maxPages}</span>
            <button 
            onClick={nextAction} 
            disabled={page >= maxPages}   
            className="px-4 py-2 bg-gray-700 text-white rounded-md"
            >
            Next
            </button>
        </div>
      )    
  
  }
  
  export default Pagination