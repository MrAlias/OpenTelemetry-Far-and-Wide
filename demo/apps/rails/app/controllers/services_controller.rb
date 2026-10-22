class ServicesController < ActionController::API
  def health
    render plain: "ok\n"
  end

  def work
    details = domain_details
    dependencies = ENV.fetch("DOWNSTREAM_SERVICES", "").split(",").map do |service|
      uri = URI("http://#{service}:8080/work")
      response = Net::HTTP.start(uri.host, uri.port, open_timeout: 2, read_timeout: 3) do |http|
        http.get(uri.request_uri)
      end
      raise "Dependency failed: #{service}" unless response.is_a?(Net::HTTPSuccess)
      JSON.parse(response.body)
    end
    render json: { service: Commerce::NAME, language: "Rails", details: details, dependencies: dependencies }
  rescue StandardError => error
    Rails.logger.error("#{Commerce::NAME}: #{error.class}: #{error.message}")
    render json: { service: Commerce::NAME, error: "dependency unavailable" }, status: :bad_gateway
  end

  private

  def domain_details
    if Commerce::NAME == "loyalty"
      total = ActiveRecord::Base.connection_pool.with_connection do |connection|
        connection.select_value("SELECT COALESCE(sum(total), 0) FROM checkout_orders").to_i
      end
      return { points: total / 10, store: "postgresql" }
    end
    cache = Redis.new(url: ENV.fetch("REDIS_URL"), connect_timeout: 2, read_timeout: 2, write_timeout: 2)
    begin
      if Commerce::NAME == "cart"
        { productId: 1, quantity: 1, visits: cache.incr("cart:demo-shopper:visits"), store: "redis" }
      else
        cache.set("promotions:active", "WELCOME10", nx: true)
        { code: cache.get("promotions:active"), discountPercent: 10, store: "redis" }
      end
    ensure
      cache.close
    end
  end
end
