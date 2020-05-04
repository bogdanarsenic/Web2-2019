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
    public class LineController : ApiController
    {
        private readonly IUnitOfWork unitOfWork;

        public LineController(IUnitOfWork unitOfWork)
        {
            this.unitOfWork = unitOfWork;
        }

        // GET: api/Item
        public IEnumerable<Line> GetLines()
        {
            return unitOfWork.Lines.GetAll();
        }

        // POST: api/Line
        [ResponseType(typeof(Line))]
        public IHttpActionResult PostLine(Line line)
        {

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            unitOfWork.Lines.Add(line);
            unitOfWork.Complete();

            return CreatedAtRoute("DefaultApi", new { id = line.Id }, line);
        }

        // PUT: api/Line/5
        [ResponseType(typeof(void))]
        public IHttpActionResult PutLine(int id, Line line)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != line.Id)
            {
                return BadRequest();
            }

            try
            {
                unitOfWork.Lines.Update(line);
                unitOfWork.Complete();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!LineExists(id))
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

        private bool LineExists(int id)
        {

            bool ret = unitOfWork.Lines.Get(id) != null;

            return ret;
        }

        // DELETE: api/Line/5
        [ResponseType(typeof(Line))]
        public IHttpActionResult DeleteLine(int id)
        {

            Line line = unitOfWork.Lines.Get(id);
            if (line == null)
            {
                return NotFound();
            }

            unitOfWork.Lines.Remove(line);
            unitOfWork.Complete();

            return Ok(line);
        }
    }
}
