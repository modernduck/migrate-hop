export class CartItem {
    public name:string;
    public price:number = 0;
    public quantity:number = 1;
    public key:string;
    public reference:string;
    public total:number;
    constructor(name:string, price:number, quantity:number, key:string) {
        this.name = name;
        this.price = price;
        this.quantity = quantity;
        this.key = key;
        this.total = price * quantity;
    }

    
  
    

}