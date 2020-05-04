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
    public class PriceListController : ApiController
    {
        private readonly IUnitOfWork unitOfWork;

        public PriceListController(IUnitOfWork unitOfWork)
        {
            this.unitOfWork = unitOfWork;
        }
        // GET: api/PriceLists
        public IEnumerable<PriceList> GetPriceLists()
        {
            return unitOfWork.PriceLists.GetAll();
        }

        [ResponseType(typeof(PriceList))]
        public IHttpActionResult PostPriceList(PriceList pricelist)
        {

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            unitOfWork.PriceLists.Add(pricelist);
            unitOfWork.Complete();

            return CreatedAtRoute("DefaultApi", new { id = pricelist.Id }, pricelist);
        }

        [ResponseType(typeof(void))]
        public IHttpActionResult PutPriceList(string id, PriceList pricelist)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != pricelist.Id)
            {
                return BadRequest();
            }

            try
            {
                unitOfWork.PriceLists.Update(pricelist);
                unitOfWork.Complete();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!PriceListExists(id))
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

        private bool PriceListExists(string id)
        {

            bool ret = unitOfWork.PriceLists.Get(Convert.ToInt32(id)) != null;

            return ret;
        }
    }
}
