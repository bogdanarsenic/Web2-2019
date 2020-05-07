using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using static WebApp.Models.Enum;

namespace WebApp.Models
{
    public class Ticket
    {
        public int Id { get; set; }
        public DateTime? Date { get; set; }
        public bool IsValid { get; set; }
        public string UserId { get; set; }
        public int Price { get; set; }
        public TicketTypes TicketType { get; set; }
        public string OrderID { get; set; }
        public string PayerID { get; set; }
        public string PaymentID { get; set; }
        public string PaymentToken { get; set; }
    }
}