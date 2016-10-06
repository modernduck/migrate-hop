import { PaymentTransaction } from "./payment-transaction"
import { PaymentOrder } from "./payment-order"

export class Report{
    private payment_transactions:Array<PaymentTransaction> = []
    private payment_orders:Array<PaymentOrder> = []
    private users_keys:Array<string> = [];

    items:Array<ReportItem> = [];


    constructor(payment_transactions:Array<PaymentTransaction>, payment_orders:Array<PaymentOrder>, users_keys:Array<string>){
        this.payment_orders = payment_orders;
        this.payment_transactions = payment_transactions;;
        this.users_keys = users_keys
        //hello

        this.payment_orders.forEach( (po, po_index) => {
            //console.log(  Number(po.getTotal())  + " vs " +  Number(this.payment_transactions[po_index].total))
            let shouldSplit = Number(po.getTotal()) != Number(this.payment_transactions[po_index].total)
            //console.log(shouldSplit)
            
            
            po.payment_order_items.forEach( po_item => {
                let reportItem = new ReportItem();
                reportItem.reference_order = this.payment_transactions[po_index]['$key']
                reportItem.transfer_time = new Date( this.payment_transactions[po_index].transfer_date + " " + this.payment_transactions[po_index].transfer_time )
                if(shouldSplit)                
                    reportItem.amount =  this.payment_transactions[po_index].total / po.payment_order_items.length
                else
                    reportItem.amount = po_item.unit_price
                reportItem.course_key = po_item.getCourseKey();
                reportItem.buyer_user_key = this.users_keys[po_index]
                reportItem.expect_amount = po_item.unit_price;
                this.items.push(reportItem)
            })
        })
    }   

    getBuyerCount():number{
        let sum = 0;
        let users = {};
        this.users_keys.forEach( key => {
            users[key] = true;
        })
        for(let k in users)
            sum++;

        return sum;
    }

    getTotal():number{
        let sum = 0;
        this.items.forEach(item => {
            sum += item.amount
        })
        return sum;
    }

    getExpectedTotal():number{
        let sum = 0;
        this.items.forEach(item => {
            sum += item.expect_amount
        })
        return sum;
    }

    toCSV():string{
        //create your data rows sep by commas & quoted, end with /n
        let csv = ""
        let delimited = ","
        

        this.items.forEach( item => {
            csv += '"' + item.reference_order  + '"' + delimited
            csv += '"' + item.course_key  + '"' + delimited
            csv += '"' + item.transfer_time.toDateString()  + '";' + delimited
            csv += '"' + item.amount  + '"' + delimited
            csv += '"' + item.expect_amount  + '"' + delimited
            csv += '"' + item.buyer_user_key  + '"'
            csv += "\n"
        })
        return csv;
    }
    


}


export class ReportItem{
    reference_order:string;
    course_key:string;
    buyer_user_key:string;
    amount:number;
    expect_amount:number;
    transfer_time:Date;
}