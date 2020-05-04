using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web;
using Unity;
using WebApp.Persistence.Repository;

namespace WebApp.Persistence.UnitOfWork
{
    public class DemoUnitOfWork : IUnitOfWork
    {
        private readonly DbContext _context;
      
        public DemoUnitOfWork(DbContext context)
        {
            _context = context;
        }

        [Dependency]
        public ITicketRepository Tickets { get; set; }

        [Dependency]
        public IStationRepository Stations { get; set; }

        [Dependency]
        public ILineRepository Lines { get; set; }

        [Dependency]
        public IStationLineRepository StationLines { get; set; }

        [Dependency]
        public ITimeTableRepository TimeTables { get; set; }

        [Dependency]
        public IPriceListRepository PriceLists { get; set; }

      


        public int Complete()
        {
            return _context.SaveChanges();
        }

        public void Dispose()
        {
            _context.Dispose();
        }
    }
}