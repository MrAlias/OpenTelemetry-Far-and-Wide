package demo.checkout;

import java.io.IOException;
import java.net.HttpURLConnection;
import java.net.URI;

/** Stale legacy endpoint, then a successful fallback to the current price store. */
public final class PricingEngine {
  private final OrderStore orders;

  PricingEngine(OrderStore orders) {
    this.orders = orders;
  }

  public int calculate() {
    var connection = (HttpURLConnection) null;
    try {
      // TEST-NET-1 is a documentation address: no legacy backend runs there.
      var endpoint = System.getenv().getOrDefault(
          "LEGACY_PRICING_URL", "http://192.0.2.42:8080/price");
      connection = (HttpURLConnection) URI.create(endpoint).toURL().openConnection();
      connection.setConnectTimeout(2000);
      connection.setReadTimeout(2000);
      if (connection.getResponseCode() == 200) {
        try (var input = connection.getInputStream()) {
          return Integer.parseInt(new String(input.readAllBytes()).trim());
        }
      }
    } catch (IOException unavailable) {
      // The old backend is gone. Continue with the authoritative product store.
    } finally {
      if (connection != null) connection.disconnect();
    }
    return orders.currentPrice();
  }
}
