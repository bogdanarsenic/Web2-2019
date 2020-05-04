using System;
using System.Collections.Generic;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Description;
using WebApp.Models;
using WebApp.Persistence;
using WebApp.Persistence.UnitOfWork;

namespace WebApp.Controllers
{
    public class TimeTableController : ApiController
    {
        private readonly IUnitOfWork unitOfWork;

        public TimeTableController(IUnitOfWork unitOfWork)
        {
            this.unitOfWork = unitOfWork;
        }

        // GET: api/TimeTable
        public IEnumerable<TimeTable> GetTimeTables()
        {
            return unitOfWork.TimeTables.GetAll();
        }

        [Route("api/Timetables/GetTimetablebyLineId")]
        public List<TimeTable> GetTimetablebyLineId(string lineId)
        {

            ApplicationDbContext context = new ApplicationDbContext();
            List<TimeTable> redvoznje = new List<TimeTable>();
            int brojac = 0;


            foreach (TimeTable t in context.TimeTables)
            {
                if (t.LineId == lineId)
                {
                    redvoznje.Add(t);
                }
            }

            if (brojac == redvoznje.Count)
            {
                return null;
            }

            return redvoznje;
        }

        [ResponseType(typeof(TimeTable))]
        public IHttpActionResult PostTimetable(TimeTable timetable)
        {

            timetable.Id = Convert.ToString(Guid.NewGuid());


            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            unitOfWork.TimeTables.Add(timetable);
            unitOfWork.Complete();

            return CreatedAtRoute("DefaultApi", new { id = timetable.Id }, timetable);
        }
        //DELETE: api/TimeTable
        [ResponseType(typeof(void))]
        public IHttpActionResult DeleteTimeTable(string id)
        {


            ApplicationDbContext db = new ApplicationDbContext();

            TimeTable t = db.TimeTables.FirstOrDefault(u => u.Id == id);

            if (t == null)
            {
                return NotFound();
            }

            db.TimeTables.Remove(t);
            db.SaveChanges();

            return Ok(t);
        }
        //Put : api/TimeTable/id
        [ResponseType(typeof(void))]
        public IHttpActionResult PutTimeTable(string id, TimeTable time)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != time.Id)
            {
                return BadRequest();
            }

            try
            {
                unitOfWork.TimeTables.Update(time);
                unitOfWork.Complete();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!TimeTableExist(Convert.ToInt32(id)))
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
        private bool TimeTableExist(int id)
        {

            bool ret = unitOfWork.TimeTables.Get(id) != null;

            return ret;
        }
    }
}
