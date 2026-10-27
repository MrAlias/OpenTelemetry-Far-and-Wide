package demo.checkout;

/** Use the current product store directly; remove the stale legacy attempt. */
public final class PricingEngine {
  private final OrderStore orders;

  PricingEngine(OrderStore orders) {
    this.orders = orders;
  }

  public int calculate() {
    return orders.currentPrice();
  }
}
