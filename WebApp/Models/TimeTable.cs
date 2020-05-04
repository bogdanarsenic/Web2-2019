using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebApp.Models
{
    public class TimeTable
    {
        public string Id { get; set; }
        public string Type { get; set; }

        public string Day { get; set; }

        public string LineId { get; set; }

        public string Times { get; set; }

    }
}