package demo.checkout;

import org.hibernate.SessionFactory;
import org.hibernate.Transaction;
import org.hibernate.cfg.Configuration;

final class OrderStore implements AutoCloseable {
  private final SessionFactory sessions;

  OrderStore() {
    sessions = new Configuration()
        .addAnnotatedClass(Product.class)
        .addAnnotatedClass(CheckoutOrder.class)
        .setProperty("hibernate.connection.url", required("DATABASE_URL"))
        .setProperty("hibernate.connection.username", required("DATABASE_USER"))
        .setProperty("hibernate.connection.password", required("DATABASE_PASSWORD"))
        .setProperty("hibernate.connection.provider_class",
            "org.hibernate.hikaricp.internal.HikariCPConnectionProvider")
        .setProperty("hibernate.hikari.maximumPoolSize", "4")
        .setProperty("hibernate.hikari.connectionTimeout", "3000")
        .setProperty("hibernate.hbm2ddl.auto", "validate")
        .buildSessionFactory();
  }

  int currentPrice() {
    try (var session = sessions.openSession()) {
      Product product = session.get(Product.class, 1L);
      if (product == null) throw new IllegalStateException("Demo product is missing");
      return product.price();
    }
  }

  long createOrder(int price) {
    try (var session = sessions.openSession()) {
      Transaction transaction = session.beginTransaction();
      try {
        Product product = session.get(Product.class, 1L);
        if (product == null) {
          throw new IllegalStateException("Demo product is missing");
        }
        var order = new CheckoutOrder(product, price);
        session.persist(order);
        transaction.commit();
        return order.id();
      } catch (RuntimeException error) {
        if (transaction.isActive()) {
          transaction.rollback();
        }
        throw error;
      }
    }
  }

  @Override
  public void close() {
    sessions.close();
  }

  private static String required(String name) {
    String value = System.getenv(name);
    if (value == null || value.isBlank()) {
      throw new IllegalArgumentException(name + " must be set");
    }
    return value;
  }
}
