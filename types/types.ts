interface CommentType{
    id: string;
    text: string;
    createdAt: Date;
    user: UserType;
}

interface UserType{
    id: string;
    pseudo: string;
    mail: string;
    role: string;
    picture: string,
}

interface StepType{
    id?: string;
    text: string;
    number: number;
}

interface CategoryType{
    id: string;
    title: string;
    slug: string;
}


interface CompositionType{
    id?: string;
    ingredient ?: IngredientType;
    recipe?: RecipeType;
    unit?: string;
    quantity?: string;
    tool?: ToolType;
    picture: string;
    slug?: string;
}

interface ToolType{
    id: string;
    label: string;
    slug: string;
    picture: string;
    composition: CompositionType;
}

interface OnlyToolType{
    tool: ToolType;
}

interface ToolsTypeWithTotal{
    tools: ToolType[];
    totalTools?: number;
}

interface OnlyIngredientType{
    ingredient: IngredientType;
}

interface IngredientType{
    id: string;
    label: string;
    unit: string;
    picture: string;
    quantity: number;
    composition: CompositionType;
    slug?: string;
}

interface IngredientsTypeWithTotal{
    ingredients: IngredientType[];
    totalIngredients?: number;
}

interface RecipeToolType{
    recipe?: RecipeType;
    tool?: ToolType;
    label?: string;
    slug?: string;
}

interface RecipeType{
    id: string;
    title: string;
    timePreparation: number;
    instructions:    string
    picture:         string
    difficulty: number;
    isHealthy: boolean;
    IsVegan: boolean;
    user ?: UserType;
    createdAt: Date;
    categoryId: string;
    category: CategoryType;
    slug: string
    compositions: CompositionType[];
    steps: StepType[];
    recipetools: RecipeToolType[];
    comment: CommentType[];
}

interface OnlyRecipeType{
    recipe: RecipeType;
}

interface RecipeTypeWithAll{
    recipe: RecipeType;
    suggestions: RecipeType[];
    favorite?: FavoriteType;
}

interface RecipesWithTotalAndCategories{
    success: boolean,
    recipes: RecipeType[],
    starters: RecipeType[],
    mains: RecipeType[],
    desserts: RecipeType[],
    totalRecipes : number,
    totalStarters : number,
    totalMains : number,
    totalDesserts : number,
}


// Recipe's creation
interface FormValueType {
    title: string;
    preparationTime: string;
    instructions: string;
    isHealthy: string;
    isVegan: string;
    difficulty: string;
    picture: string;
    // each element of the array can include an image
    ingredients: { picture?: string, name?: string, slug?: string, quantity?: string, unity?: string }[]; 
    steps: StepType[];
    // each element of the array can include an image
    tools: { picture?: string, name?: string, label?: string, slug?: string }[]; 
    // Array of files
    images: { file: File; type: string; index: number }[]; 
}

// For the suggestions concerning ingredients and tools (for example during recipe's creation)
interface SuggestionType{
    label: string;
    slug?: string;
}

interface ArticleWithTagsAndComments{
    id: string;
    title: string;
    text: string;
    slug: string;
    createdAt: Date;
    tags: TagArticleType[];
    comments: CommentType[];
    user: UserType;
}

interface ArticleWithTagsAndUser{
    id: string;
    title: string;
    text: string;
    slug: string;
    createdAt: Date;
    tags: TagArticleType[];
    user: UserType;
}

interface ArticleType{
    id: string;
    title: string;
    text: string;
    slug: string;
    createdAt: Date;
    tags: TagArticleType[];
}

interface ArticlesTypeWithTotal{
    articles: ArticleWithTagsAndComments[];
    totalArticles?: number;
}

interface TagArticleType{
    id?: string;
    // Ici c'est du chaînage : on réfère le type TagType comme type de la propriété tag de cette interface
    tag: TagType;
    number?: number;
}

interface TagArticleTypeSimplified{
    tag: TagType;
}

interface TagType{
    id?: string;
    name: string;
}

interface FavoriteType{
    id: string;
    userId: string;
    recipeId: string;
}

interface CommentArticleDetails{
    id: string;
    text: string;
    createdAt: Date;
    user: UserType;
    article: ArticleType;
}

interface CommentArticle{
    id: string;
    text: string;
    createdAt: Date;
    user: UserType;
}

interface CommentRecipe{
    id: string;
    text: string;
    createdAt: Date;
    user: UserType;
}

// type defined to avoid UploadResponse of type unknown in the API
interface CloudinaryResponse {
    secure_url: string;
    public_id: string;
  }