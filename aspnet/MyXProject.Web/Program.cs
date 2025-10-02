using System.Text.Json.Serialization;
using FirebaseAdmin;
using Google.Apis.Auth.OAuth2;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using MyXProject.Web;
using MyXProject.Web.Entities;
using MyXProject.Web.Utils;
using Xams.Core;
using Xams.Core.Config;
using Xams.Firebase;

var builder = WebApplication.CreateBuilder(args);

// Enable Firebase Auth
var useAuth = false;

var aspNetEnvironment = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") ?? "Development";
var environment = aspNetEnvironment switch
{
    "Test" => "test",
    "Production" => "prod",
    _ => "dev"
};
string firebaseProjectId = $"project-{environment.ToLower()}";

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddXamsServices<DataContext, AppUser>();
builder.Services.AddDbContext<DataContext>();
builder.Host.ConfigureXamsLogging();

builder.Services.ConfigureHttpJsonOptions(options =>
{
    options.SerializerOptions.NumberHandling = JsonNumberHandling.AllowNamedFloatingPointLiterals;
    options.SerializerOptions.PropertyNamingPolicy = null;
});

string corsPolicy = "_myAllowOrigins";
if (builder.Environment.IsDevelopment())
{
    builder.Services.AddCors(x => x.AddPolicy(corsPolicy, policyBuilder =>
    {
        // Need to provide the origin of the frontend app
        // for secure SignalR connections
        policyBuilder.WithOrigins("http://localhost:3000")
            .AllowAnyMethod()
            .AllowAnyHeader()
            .AllowCredentials();
    }));
}

if (useAuth)
{
    builder.Services.AddAuthorization();

    FirebaseApp.Create(options: new AppOptions()
    {
        Credential = GoogleCredential.FromFile($"./keys/firebase-{environment.ToLower()}.json")
    });

    builder.Services
        .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
        .AddJwtBearer(options =>
        {
            options.AddXamsFirebaseAuth(firebaseProjectId);
            options.AddXamsSignalRAuth();
        });
}


var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseCors(corsPolicy);
    app.UseSwagger();
    app.UseSwaggerUI();
}

// app.UseHttpsRedirection();

if (useAuth)
{
    app.UseAuthentication();
    app.UseAuthorization();
}

// Add Firebase Auth proxy before static files to intercept /__/auth/* requests
if (useAuth)
{
    app.AddFirebaseAuthProxy(firebaseProjectId);
}

// Enable routing for static NextJs site in wwwroot folder
app.Use(async (context, next) => await RoutingUtil.SetupRoutes(context, next, app));

app.UseStaticFiles();
// After authentication & authorization
app.AddXamsApi(options =>
{
    options.UseDashboard = true;
    // options.UrlPath = "data";
    options.RequireAuthorization = useAuth;
    options.GetUserId = useAuth ? UserUtil.GetUserId : null;
    options.FirebaseConfig = useAuth ? builder.Configuration.GetSection("FirebaseConfig").Get<FirebaseConfig>() : null;
});

app.AddXamsFirebaseApi();

app.Run();