import React from 'react'
// On importe le type LucideIcon pour pouvoir faire passer l'icone voulue
import {jsPDF} from 'jspdf'
import {LucideIcon} from 'lucide-react'


interface DownloadPdfProps {
    objectReference: RecipeType;
    filename: string;
    label: string;
    icon: LucideIcon;
}

const generatePDF = (objectReference: RecipeType, filename: string) => {
    const doc = new jsPDF();
    let yOffset: number;

    yOffset = 20;
    doc.setFontSize(16);
  
    doc.setFontSize(22);
    doc.text(String(objectReference['title']), 20, yOffset);
    yOffset += 10;

    doc.setFontSize(14);
    doc.text(String("Catégorie "+objectReference['category']['title']), 20, yOffset);
    yOffset += 10;


    doc.setFontSize(14);
    doc.text(String("Temps de préparation "+objectReference['timePreparation'])+" minutes", 20, yOffset);
    yOffset += 30;

    doc.setFontSize(16);
    doc.text('Instructions:', 20, yOffset);
    yOffset += 10;
    doc.setFontSize(14);
    doc.text(String(objectReference['instructions']), 20, yOffset);
    yOffset += 20;

    doc.setFontSize(16);
    doc.text('Ingredients:', 20, yOffset);
    yOffset +=10;
    objectReference['compositions'].forEach((ingredient) => {
      doc.text(`- ${ingredient?.ingredient?.label}`, 20, yOffset);
      yOffset += 10;
    });
    yOffset += 20;
  
    doc.setFontSize(16);
    doc.text('Tools:',20 , yOffset);
    yOffset += 10;
    objectReference['recipetools'].forEach((tool: RecipeToolType) => {
      doc.text(`- ${tool?.tool?.label}`, 20, yOffset);
      yOffset += 10;
    });
    yOffset += 20;
  
    doc.setFontSize(16);
    doc.text('Steps:', 20, yOffset);
    yOffset += 10;
    objectReference['steps'].forEach((step) => {
      doc.text(`${step['number']}`+' '+`${step['text']}`, 20, yOffset);
      yOffset += 10;
    });
  
    doc.save(filename);
  };

const DownloadPdf:React.FC<DownloadPdfProps> = ({objectReference, filename, icon: Icon, label}) => {

    const handleDownload = () => {
        generatePDF(objectReference, filename);
      };

  return (
        <button onClick={handleDownload} className={`flex items-center px-3 py-1 mt-1 bg-pink-600 from-white hover:bg-pink-500 cursor-pointer rounded-lg`}>
            <Icon className="mx-2" /> 
            {label} 
        </button>
    )    

}

export default DownloadPdf