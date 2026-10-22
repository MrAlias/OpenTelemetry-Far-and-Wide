FROM ruby:3.3.12-slim-bookworm AS build
RUN apt-get update && apt-get install -y --no-install-recommends build-essential libpq-dev && rm -rf /var/lib/apt/lists/*
WORKDIR /app
COPY Gemfile Gemfile.lock ./
RUN bundle config set frozen true && bundle install

FROM ruby:3.3.12-slim-bookworm
RUN apt-get update && apt-get install -y --no-install-recommends libpq5 && rm -rf /var/lib/apt/lists/*
WORKDIR /app
COPY --from=build /usr/local/bundle /usr/local/bundle
COPY . .
ENV RAILS_ENV=production
USER 10001:10001
ENTRYPOINT ["bundle", "exec", "puma", "--bind", "tcp://0.0.0.0:8080", "--threads", "1:4"]
