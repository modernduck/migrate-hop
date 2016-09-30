import { CartItem } from './cart-item';
/*
*  
*/
export class Cart{
    
    cart:{}
    private _count = 0;
    last_active:Date;

    constructor(){
        this.cart = {}
    }

    public isAdd( key:string) {
        
        
        if(!this.cart || !this.cart[key])
            return false;
        else if(this.cart[key].quantity > 0)
            return true;
        else
            return false;
    }


    public add( item:CartItem ){        
        if(!this.cart || !this.cart[item.key])
        {
            this.cart[item.key] = item;
            this._count++;
        }else
            this.cart[item.key].quantity += item.quantity 
        this.last_active = new Date();
    }

    public getCart() {
        var _carts:Array<CartItem>;
        _carts = [];
        for(var key in this.cart)
            _carts.push(this.cart[key])
            
        return _carts;
    }

    public getTotal() {
        var _cart = this.getCart();
        var sum =0;
        _cart.forEach(item => {
            sum += item.total;
        })
        return sum;
    }

    public remove( key:string) {
        delete this.cart[key]
        this._count--;
        this.last_active = new Date();
    }

    public get orderCount()
    {
        return this._count
    }

    public toString(){
        return JSON.stringify(this)
    }

    public static load(cartString) {
        var load_cart = JSON.parse(cartString);
        var cart = new Cart();
        if(load_cart && typeof(load_cart.last_active) != "undefined")
        {
            
            for(var k in load_cart)
                cart[k] = load_cart[k]
        }
        return cart;
    }


}