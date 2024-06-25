export interface UniqloData {

    productID: string,
    name: string,  
    price: Array<string>,  
    image: Array<Image>,  
    gender: string
    sizes: Array<string>,
    rating?: Rating,
    brand: string,
    longDescription: string,
    composition: string,
    
}

interface Rating {
    average: number,
    count: number,
    fit: number,
}

interface Image {
    url: string,
    colorString: string,
    colorCode: string
}