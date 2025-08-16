source "https://rubygems.org"

# Jekyll and Cloudflare Pages compatibility
gem "jekyll", "~> 4.3.0"
gem "webrick", "~> 1.7"

# Jekyll plugins for Cloudflare Pages
group :jekyll_plugins do
  gem "jekyll-feed", "~> 0.17"
  gem "jekyll-seo-tag", "~> 2.8"
  gem "jekyll-sitemap", "~> 1.4"
  gem "jekyll-paginate", "~> 1.1"
  gem "jekyll-archives", "~> 2.2"
end

# Windows and JRuby compatibility
platforms :mingw, :x64_mingw, :mswin, :jruby do
  gem "tzinfo", ">= 1"
  gem "tzinfo-data"
end

# Performance optimization for Windows
gem "wdm", "~> 0.1.1", :platforms => [:mingw, :x64_mingw, :mswin]

# Lock http_parser.rb for JRuby compatibility
gem "http_parser.rb", "~> 0.6.0", :platforms => [:jruby]
