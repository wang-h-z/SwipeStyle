import { ClothesData } from "./ClothesData";

export interface ClothesCardProps extends ClothesData {
    start:number,
    quantity: number;
}