
export class EmailObject{
    
    constructor(private to:String, private subject:String, private data:any, private template:String){
        
    }

    toData():any{
        let data = this.data;
        data.to = this.to;
        data.subject = this.subject;

        return {
            data:data,
            template:this.template
        }

    }
    

}