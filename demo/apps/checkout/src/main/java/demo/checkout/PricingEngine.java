package demo.checkout;

import java.io.IOException;
import java.net.HttpURLConnection;
import java.net.URI;

/** An optional legacy price source, with the current product store as fallback. */
public final class PricingEngine {
  private final OrderStore orders;

  PricingEngine(OrderStore orders) {
    this.orders = orders;
  }

  public int calculate() {
    var endpoint = System.getenv("LEGACY_PRICING_URL");
    if (endpoint != null && !endpoint.isBlank()) {
      HttpURLConnection connection = null;
      try {
        connection = (HttpURLConnection) URI.create(endpoint).toURL().openConnection();
        connection.setConnectTimeout(2000);
        connection.setReadTimeout(2000);
        if (connection.getResponseCode() == 200) {
          try (var input = connection.getInputStream()) {
            return Integer.parseInt(new String(input.readAllBytes()).trim());
          }
        }
      } catch (IOException unavailable) {
        // An unavailable legacy source must not prevent a successful checkout.
      } finally {
        if (connection != null) connection.disconnect();
      }
    }
    return orders.currentPrice();
  }
}
