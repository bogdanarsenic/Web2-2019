using System;
using System.Collections.Generic;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Description;
using WebApp.Models;
using WebApp.Persistence.UnitOfWork;

namespace WebApp.Controllers
{
    public class StationController : ApiController
    {
        private readonly IUnitOfWork unitOfWork;

        public StationController(IUnitOfWork unitOfWork)
        {
            this.unitOfWork = unitOfWork;
        }

        // GET: api/Item
        public IEnumerable<Station> GetStations()
        {
            return unitOfWork.Stations.GetAll();
        }

        // POST: api/PriceLists
        [ResponseType(typeof(Station))]
        public IHttpActionResult PostStation(Station station)
        {

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            unitOfWork.Stations.Add(station);
            unitOfWork.Complete();

            return CreatedAtRoute("DefaultApi", new { id = station.Id }, station);
        }

        // PUT: api/Station/5
        [ResponseType(typeof(void))]
        public IHttpActionResult PutStation(int id, Station station)
        {
            if (!ModelState.IsValid)
            {
                var errors = ModelState.Where(x => x.Value.Errors.Any())
                .Select(x => new { x.Key, x.Value.Errors });
                return BadRequest(ModelState);
            }

            if (id != station.Id)
            {
                return BadRequest();
            }

            try
            {
                unitOfWork.Stations.Update(station);
                unitOfWork.Complete();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!StationExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return StatusCode(HttpStatusCode.NoContent);
        }

        private bool StationExists(int id)
        {

            bool ret = unitOfWork.Stations.Get(id) != null;

            return ret;
        }

        // DELETE: api/Line/5
        [ResponseType(typeof(Station))]
        public IHttpActionResult DeleteStation(int id)
        {

            Station station = unitOfWork.Stations.Get(Convert.ToInt32((id)));
            if (station == null)
            {
                return NotFound();
            }

            unitOfWork.Stations.Remove(station);
            unitOfWork.Complete();

            unitOfWork.StationLines.RemoveRange(unitOfWork.StationLines.Find(x => x.StationId == id));
            unitOfWork.Complete();

            return Ok(station);
        }
    }
}
