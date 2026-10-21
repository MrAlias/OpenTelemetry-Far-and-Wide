package demo.checkout;

import com.sun.net.httpserver.HttpServer;
import java.net.InetSocketAddress;
import java.net.HttpURLConnection;
import java.net.URI;
import java.nio.charset.StandardCharsets;
import java.util.concurrent.Executors;

public final class Checkout {
  public static void main(String[] args) throws Exception {
    HttpServer server = HttpServer.create(new InetSocketAddress("0.0.0.0", 8080), 0);
    server.createContext("/checkout", exchange -> {
      try {
        int price = new PricingEngine().calculate();
        HttpURLConnection connection = (HttpURLConnection)
            URI.create("http://inventory:8080/inventory").toURL().openConnection();
        connection.setConnectTimeout(3000);
        connection.setReadTimeout(3000);
        int status = connection.getResponseCode();
        String inventory;
        try (var input = connection.getInputStream()) {
          inventory = new String(input.readAllBytes(), StandardCharsets.UTF_8);
        }
        byte[] body = ("{\"price\":" + price + ",\"inventory\":" + inventory.trim() + "}\n")
            .getBytes(StandardCharsets.UTF_8);
        exchange.getResponseHeaders().set("Content-Type", "application/json");
        exchange.sendResponseHeaders(status, body.length);
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
