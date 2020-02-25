using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebApp.Models
{
    public class StationLine
    {
        public int Id { get; set; }
        public int StationId { get; set; }
        public int LineId { get; set; }
    }
}