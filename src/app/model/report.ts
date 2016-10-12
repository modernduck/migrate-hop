import { PaymentTransaction } from "./payment-transaction"
import { PaymentOrder } from "./payment-order"

export class Report{
    private payment_transactions:Array<PaymentTransaction> = []
    private payment_orders:Array<PaymentOrder> = []
    private users_keys:Array<string> = [];

    items:Array<ReportItem> = [];
    courses:Object = {}

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
                this.courses[po_item.getCourseKey()] = true;
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

    public static convertTimeToLabel( time:Date ):string{
        return time.toISOString().substr(0, 10);
    }

    getCourseGraphData( course_key?:string ):SimpleClassData{
        let data = [];
        let items = this.items;
        if(course_key)
            items = this.items.filter( item => {
                return item.course_key == course_key
            })
        let sum = 0;
        let raw_data = {}
        items.forEach( item => {
        
            let key_time = Report.convertTimeToLabel( item.transfer_time )
            if(!raw_data[ key_time ])
                raw_data[ key_time] = 0;
            raw_data[ key_time ] += item.amount;
        
        })
        for(let key in raw_data){
            data.push([key  , raw_data[key]])
        }
        data.sort( (a, b) =>{
            let a_d = new Date(a[0])
            let b_d = new Date(b[0])
            return a_d.getTime() - b_d.getTime()
            
        })
        let time_arr = [];
        data.forEach(item =>{
            time_arr.push(item[0]);
        })

        let result = new SimpleClassData(time_arr, data)
        return result;
    }

    getGrossGraphData(course_key?:string):SimpleClassData{
        let info = this.getCourseGraphData(course_key)
        let sum_arr = []
        for(let i =0; i < info.data.length ;i++){
            if(i ==0 )
                sum_arr[i] = info.data[i][1];
            else
                sum_arr[i] = info.data[i][1] + sum_arr[i - 1]
        }
        sum_arr.forEach( (sum, index, arr) =>{
            info.data[index][1] = sum
        })
        console.log(info)
        return info;
            
    }

    getAllGrossGraphData(){
        let overall_data = this.getGrossGraphData();
        let series:Array<any> = [];
        series.push({
            name:"Overall",
            data:overall_data.data
        })
        for(let course_key in this.courses){
            let course_info = this.getGrossGraphData(course_key)
            let course_data:Array<any> = course_info.data
            //some day some course might dont have any income
            if(course_info.labels.length < overall_data.labels.length)
            {
                course_data = [];
                overall_data.labels.forEach( (label:string, index, arr) =>{
                    let searchIndex = course_info.labels.findIndex( item=>{
                        return item == label
                    } )
                    //if not found make it empty space
                    if(index > 0){
//                        console.log('before data')
                      //  console.log(course_info.data[index -1])
                    }
                    //console.log('searchIndex => '  + searchIndex)

                    if(searchIndex < 0)
                        if(index > 0)
                            course_data[index] = [label, course_info.data[index - 1][1]];
                        else
                            course_data[index] = [label, 0];
                    else
                        course_data[index] = course_info.data[searchIndex]
                    
                })
            }
            series.push({
                name: course_key,
                data: course_data
            })
        }
        
        return {
            labels:overall_data.labels,
            series:series
        }
    }
    


}

export class SimpleClassData{
    //labels:Array<string>;
    //data:Array<Array<number>>;

    constructor(public labels:Array<string>, public data:Array<Array<number>>){

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