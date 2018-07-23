using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MidnightLizard.Web.Schemes.Infrastructure
{
    public class TransferData
    {
        public dynamic request { get; set; }
        public Dictionary<string, object> user { get; set; }
        public Settings settings { get; set; } = new Settings();
    }
}
