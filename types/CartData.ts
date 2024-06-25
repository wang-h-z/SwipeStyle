import { ClothesData } from "./ClothesData";

export interface CartData extends ClothesData {
    quantity: number;
}