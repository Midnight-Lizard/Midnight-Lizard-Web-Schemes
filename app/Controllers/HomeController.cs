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
        private readonly IConfiguration config;

        public HomeController(IConfiguration config)
        {
            this.config = config;
            settings = new Settings();
            config.Bind(settings);
            ViewData["Settings"] = JsonConvert.SerializeObject(settings);
        }

        public async Task<IActionResult> Index()
        {
            await this.Prerendering();
            return View();
        }

        public IActionResult Error()
        {
            return View();
        }

        private async Task Prerendering()
        {
            var prerenderResult = await Request.BuildPrerender(this.config, new Dictionary<string, object>());

            ViewData["SpaHtml"] = prerenderResult.Html; // our <app-root /> from Angular
            ViewData["Title"] = prerenderResult.Globals["title"]; // set our <title> from Angular
            ViewData["Styles"] = prerenderResult.Globals["styles"]; // put styles in the correct place
            ViewData["Scripts"] = prerenderResult.Globals["scripts"]; // scripts (that were in our header)
            ViewData["Meta"] = prerenderResult.Globals["meta"]; // set our <meta> SEO tags
            ViewData["Links"] = prerenderResult.Globals["links"]; // set our <link rel="canonical"> etc SEO tags
            ViewData["TransferData"] = prerenderResult.Globals["transferData"]; // our transfer data set to window.TRANSFER_CACHE = {};
        }
    }
}
