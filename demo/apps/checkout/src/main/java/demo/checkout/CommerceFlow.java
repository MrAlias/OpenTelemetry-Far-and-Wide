package demo.checkout;

import java.net.HttpURLConnection;
import java.net.URI;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;

/** Ordinary HTTP calls: telemetry and context propagation come from instrumentation. */
final class CommerceFlow {
  static String run() throws Exception {
    var responses = new ArrayList<String>();
    for (String service : System.getenv().getOrDefault("COMMERCE_SERVICES", "").split(",")) {
      if (service.isBlank()) continue;
      var connection = (HttpURLConnection) URI.create("http://" + service + ":8080/work").toURL().openConnection();
      connection.setConnectTimeout(2000);
      connection.setReadTimeout(3000);
      try {
        if (connection.getResponseCode() != 200) {
          throw new IllegalStateException("Commerce service failed: " + service);
        }
        try (var input = connection.getInputStream()) {
          responses.add(new String(input.readAllBytes(), StandardCharsets.UTF_8).trim());
        }
      } finally {
        connection.disconnect();
      }
    }
    return "[" + String.join(",", responses) + "]";
  }
}
