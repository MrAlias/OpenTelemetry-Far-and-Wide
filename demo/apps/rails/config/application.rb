require "bundler/setup"
require "rails"
require "action_controller/railtie"
require "active_record"
require "redis"
require "net/http"

# Initialize bundled integrations after Rails components are loaded.
Bundler.require(*Rails.groups)

module Commerce
  NAME = ENV.fetch("SERVICE_NAME")
  raise "Unknown SERVICE_NAME: #{NAME}" unless %w[cart promotions loyalty].include?(NAME)

  class Application < Rails::Application
    config.load_defaults 8.1
    config.api_only = true
    config.eager_load = true
    config.hosts.clear # Internal Kubernetes Service hostnames.
    config.logger = Logger.new($stdout)
    # This API has no cookies or sessions; use a fixed key for the disposable demo.
    config.secret_key_base = "demo-commerce-" * 8
  end
end

if Commerce::NAME == "loyalty"
  ActiveRecord::Base.establish_connection(
    adapter: "postgresql", host: ENV.fetch("DATABASE_HOST"), database: "checkout",
    username: ENV.fetch("DATABASE_USER"), password: ENV.fetch("DATABASE_PASSWORD"),
    connect_timeout: 2, checkout_timeout: 2, variables: { statement_timeout: "2000" }
  )
end
