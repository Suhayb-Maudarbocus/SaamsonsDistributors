using Microsoft.EntityFrameworkCore;
using SAAMSONSDISTRIBUTORS.Models;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllersWithViews();

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles(); // Serves wwwroot (where Angular files live)
app.UseRouting();

app.UseAuthorization();

// Serve Angular fallback route for SPA paths like /products, /cart, etc.
app.MapFallbackToFile("index.html");

app.Run();