export interface UniqloData {

    productID: string,
    name: string,  
    price: Array<string>,  
    image: Array<Image>,  
    gender: string
    sizes: Array<string>,
    rating: Object,
    brand: string
    
}

interface Image {
    url: string,
    colorCode: string
}