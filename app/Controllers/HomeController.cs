using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using MidnightLizard.Web.Schemes.Infrastructure;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;

namespace MidnightLizard.Web.Schemes.Controllers
{
    public class HomeController : Controller
    {
        protected readonly Settings settings;

        public HomeController(IConfiguration config)
        {
            settings = new Settings();
            config.Bind(settings);
            ViewData["Settings"] = JsonConvert.SerializeObject(settings);
        }

        public IActionResult Index()
        {
            return View();
        }

        public IActionResult Error()
        {
            return View();
        }
    }
}
