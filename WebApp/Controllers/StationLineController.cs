using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Description;
using WebApp.Models;
using WebApp.Persistence.UnitOfWork;

namespace WebApp.Controllers
{
    public class StationLineController : ApiController
    {
        private readonly IUnitOfWork unitOfWork;

        public StationLineController(IUnitOfWork unitOfWork)
        {
            this.unitOfWork = unitOfWork;
        }

        // POST: api/StationLine
        [ResponseType(typeof(StationLine))]
        public IHttpActionResult PostStationLine(StationLine stationLine)
        {

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            unitOfWork.StationLines.Add(stationLine);
            unitOfWork.Complete();

            return CreatedAtRoute("DefaultApi", new { id = stationLine.Id }, stationLine);
        }

        // GET: api/StationLine
        public IEnumerable<StationLine> GetStationLines()
        {

            return unitOfWork.StationLines.GetAll();
        }
    }
}
