using mobile_remote_server;

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
app.UseStaticFiles();

app.MapHub<ConnectionHub>("/orientationHub");

app.MapGet("/", context =>
{
    context.Response.Redirect("/index.html");
    return Task.CompletedTask;
});

app.MapFallbackToFile("/index.html");

app.Run();
