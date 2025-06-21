export interface ConfidenceRange {
    max: number;
    min: number;
}

export interface NutrientDetail {
    confidenceRange95Percent: ConfidenceRange;
    standardDeviation: number;
    unit: string;
    value: number;
}

export interface FoodDetailInterface {
    calories: NutrientDetail;
    carbs: NutrientDetail;
    fat: NutrientDetail;
    protein: NutrientDetail;
    recipesUsed: number;
}


export interface mealDataType {
    userid: string,
    foodname: string,
    calories: number,
    protein: number,
    carbs: number,
    fat: number,
    fiber: number,
    timestamp: string,
    mealType: string,
    quantity: number,
    dietLabels: string,
    foodImageUrl: any,
    $id : string,
    $createdAt: string,
    $updatedAt: string,
}