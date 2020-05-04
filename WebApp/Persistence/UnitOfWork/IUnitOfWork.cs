using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using WebApp.Persistence.Repository;

namespace WebApp.Persistence.UnitOfWork
{
    public interface IUnitOfWork : IDisposable
    {
        
        ITicketRepository Tickets { get; set; }

        IStationRepository Stations { get; set; }

        IStationLineRepository StationLines { get; set; }
        ILineRepository Lines { get; set; }
        ITimeTableRepository TimeTables { get; set; }
        IPriceListRepository PriceLists { get; set; }

        int Complete();
    }
}
