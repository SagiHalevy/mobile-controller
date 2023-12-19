using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.DependencyInjection;
using mobile_remote_server;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Cors;

var builder = WebApplication.CreateBuilder(args);

// Add SignalR services to the service collection
builder.Services.AddSignalR();
    
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(builder =>
        builder.SetIsOriginAllowed(origin => true) // Allow any origin
               .AllowAnyHeader()
               .AllowAnyMethod()
               .AllowCredentials()); // Allow credentials
});

var app = builder.Build();
app.UseCors();

app.MapHub<ConnectionHub>("/orientationHub");

app.MapGet("/", () => "Hello World!");

app.Run();


