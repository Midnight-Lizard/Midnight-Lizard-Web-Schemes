FROM microsoft/aspnetcore:2
ARG source
WORKDIR /app
EXPOSE 80
COPY ${source:-obj/Docker/publish} .
ENTRYPOINT ["dotnet", "MidnightLizard.Web.Schemes.dll"]
