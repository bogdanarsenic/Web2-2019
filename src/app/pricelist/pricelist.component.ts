import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ServicesService } from '../services/services.service';
import { Router } from '@angular/router';
import { User } from '../classes/User';
import { PriceList } from '../classes/PriceList';
import { Ticket } from '../classes/Ticket';
import { async } from '@angular/core/testing';

declare var paypal;

@Component({
  selector: 'app-pricelist',
  templateUrl: './pricelist.component.html',
  styleUrls: ['./pricelist.component.css']
})
export class PricelistComponent implements OnInit {
  @ViewChild('paypal', { static: true }) paypalElement:ElementRef;

  paidFor=false;


  price:number;
  hourlyPrice:number;
  daylyPrice:number;
  monthlyPrice:number;
  yearlyPrice:number;
  paypalPrice:number;

  buyButton:boolean;
  adminButton:boolean;
  showAddT:boolean;
  showAddD:boolean;
  showAddM:boolean;
  showAddY:boolean;
  showEditT:boolean;
  showEditD:boolean;
  showEditM:boolean;
  showEditY:boolean;
  user:User;

  ticket:Ticket;

  status:string;

  idPricelist:number;

  ids:Array<any>

  studentCoefficient:number=0.8;
  pensionerCoefficient:number=0.7;

  priceslists:Array<PriceList>;
  
  priceTemporal:number=0;
  priceDay:number=0;
  priceMonth:number=0;
  priceYear:number=0;

  p:PriceList;

  prices:Array<any>

  buttonTicket:boolean;

  tickets:Array<any>;

  ticketsByUser:Array<any>;
  paypalchecked: boolean;

  constructor(private serverService:ServicesService,private router:Router) 
  { 

  }

  ngOnInit(): void {
    this.prices=[0,0,0,0];
    this.buyButton=false;
    this.adminButton=false;
    this.user=new User();
    this.buttonTicket=false;
    this.showAddT=false;
    this.showAddD=false;
    this.showAddM=false;
    this.showAddY=false;
    this.showEditD=false;
    this.showEditT=false;
    this.showEditM=false;
    this.showEditY=false;
    this.paypalchecked=false;
    this.status="";
    this.p=new PriceList();
    this.getUserDetails();
    this.getPricelist();
    
  }

  onPayPal()
  {

    paypal
      .Buttons({
        style: {
          size: 'small',
          color: 'gold',
          shape: 'pill',
          label: 'checkout',
         },
        createOrder: (data, actions) => {
          return actions.order.create({

            purchase_units: [
             
              
              {                
                amount: {
                  value: this.paypalPrice/100,
                  currency_code: 'USD'

                }
              }
            ]
          
          });
        },

       

        onApprove: async (data, actions) => {
          const order = await actions.order.capture();
          var id = this.user.Email.split('@')[0];
          this.ticket.UserId = id;
          this.ticket.IsValid = true;
          this.ticket.OrderID = data.orderID;
          this.ticket.PayerID = data.payerID;
          this.serverService.postTicket(this.ticket)
        .subscribe(
          data => {
            console.log("Kupljena karta!!");              
          },
          error => {
            console.log(error);
          }
        )
          console.log(order);
        },
        onError: err => {
          console.log(err);
        }
      }) 
      
      .render(this.paypalElement.nativeElement);
  }

  paypalHour()
  {
      this.ticket=new Ticket();
      this.ticket.TicketType="Temporal";
      this.ticket.Price=this.priceTemporal;
      this.paypalPrice=this.priceTemporal;

      if(!this.paypalchecked)
        {
          this.paypalchecked=true;
          this.onPayPal();
        }      
  }

  paypalDay()
  {
      this.ticket=new Ticket();
      this.ticket.TicketType="Day";
      this.ticket.Price=this.priceDay;
      this.paypalPrice=this.priceDay;
      if(!this.paypalchecked)
        {
          this.paypalchecked=true;
          this.onPayPal();
        }  
  }

  paypalMonth()
  {
    this.ticket=new Ticket();
    this.ticket.TicketType="Month";
    this.ticket.Price=this.priceMonth;
    this.paypalPrice=this.priceMonth;

    if(!this.paypalchecked)
        {
          this.paypalchecked=true;
          this.onPayPal();
        }  
  }

  paypalYear()
  {
      this.ticket=new Ticket();
      this.ticket.TicketType="Year";
      this.ticket.Price=this.priceYear;
      this.paypalPrice=this.priceYear;
      if(!this.paypalchecked)
        {
          this.paypalchecked=true;
          this.onPayPal();
        }  
  }
  

  getUserDetails() : any {
    this.serverService.getUser()
    .subscribe(
            
      data => {

        this.user = data;   
        this.isActive();   
        this.isAdmin(); 
        this.isDisabledPensioner();
        this.isDisabledStudent();

        
      },
      err => {
        console.log(err);
      }
      
    ) 
    
  }

  getPricelist() : any {

    this.serverService.getAllPriceLists()
    .subscribe(
      data => {    
          this.priceslists=data;      
          if(this.priceslists.length!=0)
          {
              this.priceslists.forEach(x=>
                {
                    if(x.Id=="Temporal")
                    {
                        this.priceTemporal=x.Price;
                        this.prices[0]=this.priceTemporal;
                    }
                    else if(x.Id=="Day")
                    {
                        this.priceDay=x.Price;
                        this.prices[1]=this.priceDay;
                    }
                    else if(x.Id=="Month")
                    {
                        this.priceMonth=x.Price;
                        this.prices[2]=this.priceMonth;
                    }
                    else
                    {
                        this.priceYear=x.Price;
                        this.prices[3]=this.priceYear;
                    }
                })
          }     
      },
      err => {
        console.log(err);
      }
    ) 
  }

  showTickets()
  {
      this.ticketsByUser=[];
      this.getTickets();

  }
  getTickets()
  {
      this.serverService.getAllTickets().subscribe(
        data=>
        {
            this.tickets=data;
            var i = this.user.Email.split('@')[0];

            this.tickets.forEach(
              x=>
              {
                  if(x.UserId==i)
                  {
                      x.Date=x.Date.split('T')[0];
                      this.ticketsByUser.push(x);
                  }
              }
            )
            this.buttonTicket=true;
        }
      )
  }

  isActive()
  {
        if(localStorage.role=="AppUser" && this.user.Active==true){
            this.buyButton=true;
            return true;
        }
        else
          {
            this.buyButton=false;
            return false;
          }
  }

  isAdmin()
  {
        if(localStorage.role=="Admin")
        {
            return true;
        }
        else
              return false;
            
  }

  isDisabledStudent()
  {
      if(localStorage.role=="AppUser")
        {
            if(this.user.Type=="Student" && this.user.Active==true)
              return false;
            else
              return true;
        }

      else
          return false;
  }

  isDisabledPensioner()
  {
    if(localStorage.role=="AppUser")
    {
        if(this.user.Type=="Pensioner" && this.user.Active==true)
          return false;
        else
          return true;
    }

  else
      return false;
  }

  onRegularTemporal()
  {
      if(this.priceTemporal!=0 && this.isAdmin())
      {
            this.showEditT=true;
      }
      else if(this.priceTemporal==0 && this.isAdmin())
      {
          this.showAddT=true;
      }
      this.priceTemporal=this.prices[0];
      
  }

  onStudentTemporal()
  {
     this.priceTemporal=this.prices[0]*this.studentCoefficient;
  }

  onPensionerTemporal()
  {
    this.priceTemporal=this.prices[0]*this.pensionerCoefficient;
  }

  onRegularMonth()
  {
      if(this.priceMonth!=0 && this.isAdmin())
      {
            this.showEditM=true;
      }
      else if(this.priceMonth==0 && this.isAdmin())
      {
          this.showAddM=true;
      }
      this.priceMonth=this.prices[2];
      
  }

  onStudentMonth()
  {
     this.priceMonth=this.prices[2]*this.studentCoefficient;
  }

  onPensionerMonth()
  {
    this.priceMonth=this.prices[2]*this.pensionerCoefficient;
  }

  onRegularDay()
  {
      if(this.priceDay!=0 && this.isAdmin())
      {
            this.showEditD=true;
      }
      else if(this.priceDay==0 && this.isAdmin())
      {
          this.showAddD=true;
      }
      this.priceDay=this.prices[1];
      
  }

  onStudentDay()
  {
     this.priceDay=this.prices[1]*this.studentCoefficient;
  }

  onPensionerDay()
  {
    this.priceDay=this.prices[1]*this.pensionerCoefficient;
  }

  onRegularYear()
  {
      if(this.priceYear!=0 && this.isAdmin())
      {
            this.showEditY=true;
      }
      else if(this.priceYear==0 && this.isAdmin())
      {
          this.showAddY=true;
      }
      this.priceYear=this.prices[3];
      
  }

  onStudentYear()
  {
     this.priceYear=this.prices[3]*this.studentCoefficient;
  }

  onPensionerYear()
  {
    this.priceYear=this.prices[3]*this.pensionerCoefficient;
  }

  BuyTemporal()
  {
      this.ticket=new Ticket();
      this.ticket.TicketType="Temporal";
      this.ticket.Price=this.priceTemporal;
      if(this.ticket.Price!=0)
      {
          this.Buy(this.ticket);
      }
      else
        alert("There is no price for this ticket type yet.");
  }

  BuyDay()
  {
    this.ticket=new Ticket();
    this.ticket.TicketType="Day";
    this.ticket.Price=this.priceDay;
    if(this.ticket.Price!=0)
    {
        this.Buy(this.ticket);
    }
    else
      alert("There is no price for this ticket type yet.");
  }

  BuyMonth()
  {
    this.ticket=new Ticket();
    this.ticket.TicketType="Month";
    this.ticket.Price=this.priceMonth;
    if(this.ticket.Price!=0)
    {
        this.Buy(this.ticket);
    }
    else
      alert("There is no price for this ticket type yet.");
  }

  BuyYear()
  {
    this.ticket=new Ticket();
    this.ticket.TicketType="Year";
    this.ticket.Price=this.priceYear;
    if(this.ticket.Price!=0)
    {
        this.Buy(this.ticket);
    }
    else
      alert("There is no price for this ticket type yet.");
  }

  EditDay(a)
  {
    this.p.Id="Day";
    this.p.Price=a;
    this.Edit(this.p.Id,this.p);
  }

  AddDay(a)
  {
    this.p = new PriceList();
    this.p.Id="Day";
    this.p.Price=a;
    this.Add(this.p);
  }

  EditTemporal(a)
  {
    this.p.Id="Temporal";
    this.p.Price=a;
    this.Edit(this.p.Id,this.p);
  }

  AddTemporal(a)
  {
    this.p = new PriceList();
    this.p.Id="Temporal";
    this.p.Price=a;
    this.Add(this.p);
  }

  EditMonth(a)
  {
    this.p.Id="Month";
    this.p.Price=a;
    this.Edit(this.p.Id,this.p);
  }

  AddMonth(a)
  {
    this.p = new PriceList();
    this.p.Id="Month";
    this.p.Price=a;
    this.Add(this.p);
  }

  EditYear(a)
  {
    this.p.Id="Year";
    this.p.Price=a;
    this.Edit(this.p.Id,this.p);
  }

  AddYear(a)
  {
    this.p = new PriceList();
    this.p.Id="Year";
    this.p.Price=a;
    this.Add(this.p);
  }


  Buy(t:Ticket)
  {
      t.IsValid=true;
      var id = this.user.Email.split('@')[0];
      t.UserId = id;

      this.serverService.postTicket(t).subscribe(
      data => {
        console.log("Kupljena karta!!");              
      },
      error => {
        console.log(error);
      }
    )

  }


  Add(p:PriceList)
  {
      this.serverService.postPriceList(p).subscribe(
        data=>
        {
            this.router.navigate(['']).then(()=>window.location.reload()); 
        }
      )
  }

  Edit(id:string,pricelist:PriceList)
  {
      this.serverService.putPriceList(id,pricelist).subscribe(
        data=>
        {
          this.router.navigate(['']).then(()=>window.location.reload()); 
        }
      )
  }


}
