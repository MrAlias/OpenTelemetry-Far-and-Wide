package demo.checkout;

public final class PricingEngine {
  // The fault performs no I/O. SDK configuration selects this ordinary method.
  public int calculate() {
    try {
      Thread.sleep(150);
    } catch (InterruptedException error) {
      Thread.currentThread().interrupt();
      throw new IllegalStateException(error);
    }
    return 42;
  }
}
