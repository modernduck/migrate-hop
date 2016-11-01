
export class PaymentOrderItem{
    public quantity:number;
    public unit_price:number;
    public $key:string;
    constructor(cart_item?){
        if(cart_item){
            this.quantity = cart_item.quantity
            this.unit_price = cart_item.price;
            this.$key = cart_item.key + "-" + cart_item.reference
        }
    }

    getCourseKey(){
        return this.$key.split('-')[0]
    }

    
    public static loadToCart(order_item){
        var arr = order_item.$key.split("-")        
        return {
            key:arr[0],
            reference:arr[1],
            quantity:order_item.quantity,
            unit_price:order_item.unit_price
        }
    }
}

export class PaymentOrder{
    public payment_order_items:Array<PaymentOrderItem>
    constructor(cart_items?:Array<any>){
        this.payment_order_items = [];
        if(cart_items)
            cart_items.forEach(item=>{
                this.payment_order_items.push(new PaymentOrderItem(item))
            })
        
    }

    public static getCourseOrder(course_key:string, course_price:number, reference:string){
        var tempCart = [{
            quantity:1,
            price:course_price,
            key:course_key,
            reference:reference
        }]
        return new PaymentOrder(tempCart);
    }

    public static load(payment_orders:any):PaymentOrder{
        let payment_order_items:Array<PaymentOrderItem> = []
        //console.log('load bro')
        //console.log(payment_orders)
        let result = new PaymentOrder()
        result.payment_order_items = [];
        payment_orders.forEach( payment_order => {
            let tmpOrder = new PaymentOrderItem()
            tmpOrder.$key = payment_order.$key
            tmpOrder.unit_price = payment_order.unit_price;
            tmpOrder.quantity = payment_order.quantity
            console.log(tmpOrder)
            result.payment_order_items.push(
                tmpOrder
            )
        })


        //result.payment_order_items = payment_order_items;
        return result;
    }

    getData(){
        var data={};
        this.payment_order_items.forEach(item => {
            data[item.$key] = {
                quantity:item.quantity,
                unit_price:item.unit_price
            }
        })
        
        return data;
    }

    getTotal() {
        let sum = 0;
        this.payment_order_items.forEach( item => {
            sum += item.quantity * item.unit_price
        })
        return sum;
    }
}

