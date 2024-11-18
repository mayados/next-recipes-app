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
    id: string;
    ingredient : IngredientType;
    recipe: RecipeType;
    unit: string;
    quantity: number;
    tool: ToolType;
    picture: string;
}

interface ToolType{
    id: string;
    label: string;
    picture: string;
    composition: CompositionType;
}

interface IngredientType{
    id: String;
    label: String;
    unit: String;
    picture: String;
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
    difficulty: number;
    isHealthy: boolean;
    IsVegan: boolean;
    createdAt: Date;
    categoryId: string;
    category: CategoryType;
    slug: string
    compositions: CompositionType[];
    steps: StepType[];
    recipetools: RecipeToolType[];
    comment: CommentType[];
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

interface TagArticleType{
    id: string;
    // Ici c'est du chaînage : on réfère le type TagType comme type de la propriété tag de cette interface
    tag: TagType;
}

interface TagType{
    id: string;
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