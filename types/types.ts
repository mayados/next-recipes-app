interface CommentType{
    id: string;
    text: string;
    createdAt: Date;
}

interface StepType{
    id: string;
    text: string;
    number: number;
}

interface CategoryType{
    id: string;
    title: string;
    slug: string;
}


interface CompositionType{
    idIngredient : string;
    idRecipe: string;
    unit: string;
    quantity: number;
}

interface IngredientType{
    id: String;
    unit: String;
    quantity: number;
    composition: CompositionType;
}

interface RecipeType{
    id: string;
    title: string;
    timePreparation: number;
    instructions:    String
    picture:         String
    createdAt: Date;
    categoryId: string;
    category: CategoryType;
    slug: string
    compositions: CompositionType[];
    steps: StepType[];
    // recipetools RecipeToolType[];
    // comments: CommentType[];
}
