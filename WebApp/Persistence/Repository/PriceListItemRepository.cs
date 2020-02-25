using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web;
using WebApp.Models;

namespace WebApp.Persistence.Repository
{
    public class PriceListItemRepository:Repository<PriceListItem, int>, IPriceListItemRepository
    {
        public PriceListItemRepository(DbContext context) : base(context)
        {
        }
    }
}