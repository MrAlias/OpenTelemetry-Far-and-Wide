Rails.application.routes.draw do
  get "/healthz", to: "services#health"
  get "/work", to: "services#work"
end
