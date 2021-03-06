using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.SpaServices.Webpack;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.Net.Http.Headers;
using MidnightLizard.Web.Schemes.Infrastructure;
using Microsoft.Extensions.Primitives;

namespace MidnightLizard.Web.Schemes
{
    public enum Mode
    {
        Composed,
        StandAlone
    }

    public class Startup
    {
        public static IHostingEnvironment _env;

        public Startup(IHostingEnvironment env)
        {
            Startup._env = env;
            var builder = new ConfigurationBuilder()
                .SetBasePath(env.ContentRootPath)
                .AddJsonFile("appsettings.json", optional: true, reloadOnChange: true)
                .AddJsonFile($"appsettings.{env.EnvironmentName}.json", optional: true)
                .AddEnvironmentVariables();
            Configuration = builder.Build();
        }

        public IConfigurationRoot Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddCors(options =>
            {
                options.AddPolicy("AllowAll",
                      builder =>
                      {
                          builder.AllowAnyOrigin()
                                 .AllowAnyHeader()
                                 .AllowAnyMethod()
                                 .AllowCredentials();
                      });
            });
            // Add framework services.
            services.AddMvc();
            services.AddNodeServices(options =>
            {
                if (_env.IsDevelopment())
                {
                    // chrome-devtools://
                    options.LaunchWithDebugging = true;
                    options.DebuggingPort = 9229;
                }
            });
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env, ILoggerFactory loggerFactory)
        {
            loggerFactory.AddConsole(Configuration.GetSection("Logging"));
            loggerFactory.AddDebug();

            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
                if (Configuration.GetValue<Mode>(nameof(Mode)) == Mode.StandAlone)
                {
                    app.UseWebpackDevMiddleware(new WebpackDevMiddlewareOptions
                    {
                        HotModuleReplacement = true
                    });
                }
            }
            else
            {
                app.UseDeveloperExceptionPage();
                //app.UseExceptionHandler("/Home/Error");
            }

            app.UseCors("AllowAll");

            var settingsHeaders = CreateSettingsHeaders();

            app.UseStaticFiles(new StaticFileOptions()
            {
                OnPrepareResponse = context =>
                {
                    context.Context.Response.Headers.Add(
                        nameof(Settings),
                        typeof(Settings).GetProperties().Select(p => p.Name).ToArray());
                    foreach (var settingHeader in settingsHeaders)
                    {
                        context.Context.Response.Headers.Add(settingHeader);
                    }
                }
            });
            //app.UseStaticFiles(new StaticFileOptions()
            //{
            //    OnPrepareResponse = context =>
            //    {
            //        context.Context.Response.Headers.Add("Cache-Control", "no-cache, no-store");
            //        context.Context.Response.Headers.Add("Expires", "-1");
            //    }
            //});

            app.UseMvc(routes =>
            {
                routes.MapRoute(
                    name: "default",
                    template: "{controller=Home}/{action=Index}/{id?}");

                routes.MapSpaFallbackRoute(
                    name: "spa-fallback",
                    defaults: new { controller = "Home", action = "Index" });
            });
        }

        private Dictionary<string, StringValues> CreateSettingsHeaders()
        {
            var set = new Settings();
            Configuration.Bind(set);
            return typeof(Settings)
                .GetProperties()
                .ToDictionary(p => p.Name, p => new StringValues(p.GetValue(set) as string));
        }
    }
}
