package demo.commerce;

import com.google.gson.Gson;
import com.google.gson.JsonElement;
import com.sun.net.httpserver.HttpServer;
import java.net.InetSocketAddress;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.sql.DriverManager;
import java.time.Duration;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.Executors;

public final class Service {
  private static final Gson JSON = new Gson();
  private static final String NAME = System.getenv("SERVICE_NAME");
  private static final HttpClient CLIENT = HttpClient.newBuilder()
      .version(HttpClient.Version.HTTP_1_1).connectTimeout(Duration.ofSeconds(2)).build();

  private static Map<String, ?> details() throws Exception {
    return switch (NAME) {
      case "catalog" -> {
        try (var connection = DriverManager.getConnection(System.getenv("DATABASE_URL"),
                 System.getenv("DATABASE_USER"), System.getenv("DATABASE_PASSWORD"));
             var query = connection.prepareStatement("SELECT id, name FROM products ORDER BY id")) {
          query.setQueryTimeout(2);
          var products = new ArrayList<Map<String, Object>>();
          try (var rows = query.executeQuery()) {
            while (rows.next()) {
              products.add(Map.of("id", rows.getLong("id"), "name", rows.getString("name")));
            }
          }
          yield Map.of("products", products, "store", "postgresql");
        }
      }
      case "payments" -> Map.of("authorization", "demo-approved", "provider", "Demo Pay");
      case "fraud" -> Map.of("riskScore", 7, "decision", "allow");
      default -> throw new IllegalArgumentException("Unknown SERVICE_NAME: " + NAME);
    };
  }

  public static void main(String[] args) throws Exception {
    if (NAME == null || !List.of("catalog", "payments", "fraud").contains(NAME)) {
      throw new IllegalArgumentException("SERVICE_NAME must be catalog, payments, or fraud");
    }
    DriverManager.setLoginTimeout(2);
    var executor = Executors.newFixedThreadPool(4);
    var server = HttpServer.create(new InetSocketAddress("0.0.0.0", 8080), 0);
    server.createContext("/healthz", exchange -> {
      byte[] body = "ok\n".getBytes(StandardCharsets.UTF_8);
      exchange.sendResponseHeaders(200, body.length);
      exchange.getResponseBody().write(body);
      exchange.close();
    });
    server.createContext("/work", exchange -> {
      int status = 200;
      String result;
      try {
        var details = details();
        var dependencies = new ArrayList<JsonElement>();
        for (String downstream : System.getenv().getOrDefault("DOWNSTREAM_SERVICES", "").split(",")) {
          if (downstream.isBlank()) continue;
          var request = HttpRequest.newBuilder(URI.create("http://" + downstream + ":8080/work"))
              .timeout(Duration.ofSeconds(3)).GET().build();
          var response = CLIENT.send(request, HttpResponse.BodyHandlers.ofString());
          if (response.statusCode() != 200) throw new IllegalStateException("Dependency failed: " + downstream);
          dependencies.add(JSON.fromJson(response.body(), JsonElement.class));
        }
        result = JSON.toJson(Map.of("service", NAME, "language", "Java", "details", details, "dependencies", dependencies));
      } catch (Exception error) {
        error.printStackTrace();
        status = 502;
        result = JSON.toJson(Map.of("service", NAME, "error", "dependency unavailable"));
      }
      byte[] body = (result + "\n").getBytes(StandardCharsets.UTF_8);
      exchange.getResponseHeaders().set("Content-Type", "application/json");
      exchange.sendResponseHeaders(status, body.length);
      exchange.getResponseBody().write(body);
      exchange.close();
    });
    server.setExecutor(executor);
    Runtime.getRuntime().addShutdownHook(new Thread(() -> { server.stop(5); executor.shutdown(); }));
    server.start();
    System.out.println(NAME + " listening on 8080");
  }
}
