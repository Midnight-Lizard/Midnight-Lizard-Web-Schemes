using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

namespace MidnightLizard.Web.Schemes.Controllers
{
    public class ModuleController : Controller
    {
        public IActionResult SchemesListView()
        {
            return View();
        }

        public IActionResult Error()
        {
            return View();
        }
    }
}
