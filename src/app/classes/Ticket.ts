export class Ticket{

    TicketType: string;
    Date : Date;
    UserId:string;
    Price:number;
    IsValid:boolean;
    OrderID:string;
    PayerID:string;
    PaymentID:string;
    PaymentToken:string;

    constructor(){
        this.TicketType = "";
        this.IsValid = false;
        this.UserId = "";
        this.Price=0;
       
    }
}