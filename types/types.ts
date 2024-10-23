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
    ingredient : IngredientType;
    recipe: RecipeType;
    unit: string;
    quantity: number;
    tool: ToolType;
}

interface ToolType{
    id: string;
    label: string;
    composition: CompositionType;
}

interface IngredientType{
    id: String;
    label: String;
    unit: String;
    quantity: number;
    composition: CompositionType;
}

interface RecipeToolType{
    recipe: RecipeType;
    tool: ToolType;
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
    recipetools: RecipeToolType[];
    // comments: CommentType[];
}

