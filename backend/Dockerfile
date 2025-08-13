# backend/Dockerfile
# Multi-stage: vendor -> (opcional) frontend build -> runtime
FROM composer:2 AS vendor
WORKDIR /app
COPY backend/composer.json backend/composer.lock ./
RUN composer install --no-dev --prefer-dist --no-interaction --optimize-autoloader
COPY backend /app

FROM node:18 AS nodebuild
WORKDIR /app
# Si tu frontend está en frontend/, ajusta estas líneas; si no lo quieres construir aquí, elimina esta stage
COPY frontend/package.json frontend/pnpm-lock.yaml ./
RUN npm install -g pnpm
RUN pnpm install
COPY frontend .
RUN pnpm build

FROM php:8.2-fpm

# Paquetes del sistema
RUN apt-get update && apt-get install -y \
    nginx \
    libzip-dev \
    libpng-dev \
    libonig-dev \
    zip unzip git supervisor \
  && docker-php-ext-install pdo_mysql mbstring zip exif pcntl bcmath gd

# Copiar la app (incluye vendor desde la stage 'vendor')
COPY --from=vendor /app /var/www/backend

# Copiar frontend ya compilado (si lo hicimos en nodebuild)
COPY --from=nodebuild /app/dist /var/www/backend/public

# Copiar config nginx
COPY conf/nginx/site.conf /etc/nginx/sites-available/default

# Permisos
RUN chown -R www-data:www-data /var/www/backend \
 && chmod -R 775 /var/www/backend/storage /var/www/backend/bootstrap/cache

WORKDIR /var/www/backend
EXPOSE 80

# Arranca php-fpm y nginx
CMD ["sh", "-c", "php-fpm -D && nginx -g 'daemon off;'"]
