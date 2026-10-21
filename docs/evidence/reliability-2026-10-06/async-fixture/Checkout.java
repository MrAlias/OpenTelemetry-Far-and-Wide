package demo.checkout;

import com.sun.net.httpserver.HttpServer;
import java.net.InetSocketAddress;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.util.concurrent.Executors;

public final class Checkout {
  public static void main(String[] args) throws Exception {
    HttpClient client = HttpClient.newBuilder()
        .version(HttpClient.Version.HTTP_1_1)
        .connectTimeout(Duration.ofSeconds(3)).build();
    HttpServer server = HttpServer.create(new InetSocketAddress("0.0.0.0", 8080), 0);
    server.createContext("/checkout", exchange -> {
      try {
        int price = new PricingEngine().calculate();
        HttpRequest request = HttpRequest.newBuilder(URI.create("http://inventory:8080/inventory"))
            .timeout(Duration.ofSeconds(3)).GET().build();
        HttpResponse<String> result = client.send(request, HttpResponse.BodyHandlers.ofString());
        byte[] body = ("{\"price\":" + price + ",\"inventory\":" + result.body().trim() + "}\n")
            .getBytes(StandardCharsets.UTF_8);
        exchange.getResponseHeaders().set("Content-Type", "application/json");
        exchange.sendResponseHeaders(result.statusCode(), body.length);
        exchange.getResponseBody().write(body);
      } catch (Exception error) {
        byte[] body = error.toString().getBytes(StandardCharsets.UTF_8);
        exchange.sendResponseHeaders(502, body.length);
        exchange.getResponseBody().write(body);
      } finally {
        exchange.close();
      }
    });
    server.setExecutor(Executors.newFixedThreadPool(4));
    server.start();
    System.out.println("checkout listening on 8080");
  }
}
