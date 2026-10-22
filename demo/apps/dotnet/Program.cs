using System.Text.Json;

var name = Environment.GetEnvironmentVariable("SERVICE_NAME") ?? "";
object details = name switch
{
    "customer-profile" => new { customerId = "demo-shopper", region = "Ontario" },
    "tax" => new { jurisdiction = "Ontario", rate = 0.13, currency = "CAD" },
    "notifications" => new { channel = "email", delivery = "simulated" },
    _ => throw new InvalidOperationException($"Unknown SERVICE_NAME: {name}")
};
var downstream = (Environment.GetEnvironmentVariable("DOWNSTREAM_SERVICES") ?? "")
    .Split(',', StringSplitOptions.RemoveEmptyEntries);
var builder = WebApplication.CreateBuilder(args);
builder.Services.AddHttpClient("commerce", client => client.Timeout = TimeSpan.FromSeconds(3));
var app = builder.Build();
app.MapGet("/healthz", () => Results.Text("ok\n"));
app.MapGet("/work", async (IHttpClientFactory clients, CancellationToken cancelled) =>
{
    try
    {
        var dependencies = new List<JsonElement>();
        var client = clients.CreateClient("commerce");
        foreach (var service in downstream)
        {
            using var response = await client.GetAsync($"http://{service}:8080/work", cancelled);
            response.EnsureSuccessStatusCode();
            dependencies.Add(await response.Content.ReadFromJsonAsync<JsonElement>(cancelled));
        }
        return Results.Json(new { service = name, language = ".NET", details, dependencies });
    }
    catch (Exception error) when (error is HttpRequestException or TaskCanceledException or JsonException)
    {
        app.Logger.LogError(error, "Dependency failed for {Service}", name);
        return Results.Json(new { service = name, error = "dependency unavailable" }, statusCode: 502);
    }
});
app.Run();
