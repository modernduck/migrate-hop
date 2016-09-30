export class PaymentTransfer{
    public date:string;
    public time:string;
    public amount:number;
    public slip_url:string;
}


export class PaymentTransaction{
    public discount:number;
    public fee:number;
    public payment_reference:string;//url
    public payment_type:string;
    public status:string;
    public total:number;
    public transfer_date:string;
    public transfer_time:string;
    private fields=["payment_type", "payment_reference", "status", "total", "discount", "fee", "transfer_date", "transfer_time"]
    /*constructor(payment_type:string, payment_reference:string, status:string, total:number, discount:number, fee:number){
           this.payment_type = payment_type;
           this.payment_reference = payment_reference;
           this.status = status;
           this.total = total;
           this.discount = discount;
           this.fee = fee;
    }*/

    isTransferType(){
        return this.payment_type == "transfer"
    }

    isCompleted(){
        return this.status == "completed"
    }


    public static load(payment_transactions:Array<any>){
        //basic filter remove the last one
        return payment_transactions.filter((data, index, arr)=>{
            return data['$key'] != 'slip_count'
        })   
    }

    public static getDataFromListItem(payment_list_item:any){
        //var raw:string = payment_list_item.$key;
        
        var  raw = payment_list_item.$key.split('-');
        return {
            user_key:raw[0],
            time_key:raw[1]
        }
    }
    

    getData(){
        var data = {}
        this.fields.forEach(key => {
            data[key] = this[key]
        })
        return data;
    }
}