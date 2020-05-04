using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using WebApp.Hubs;

namespace WebApp.Controllers
{
    public class ClickController : ApiController
    {
        private NotificationHub hub;

        public ClickController(NotificationHub hub)
        {
            this.hub = hub;
        }
        public static int ClickCount { get; set; }
        // GET: api/Click
        public IHttpActionResult Post()
        {
            hub.NotifyAdmins(++ClickCount);
            return Ok("Hello");
        }
    }
}
