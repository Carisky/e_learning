FROM php:8.1-apache

RUN apt-get update && apt-get install -y unzip git libpq-dev \
    && docker-php-ext-install pdo pdo_pgsql

# Включаем mod_rewrite
RUN a2enmod rewrite

# Меняем DocumentRoot на /var/www/html/public
ENV APACHE_DOCUMENT_ROOT=/var/www/html/public
RUN sed -ri 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/sites-available/000-default.conf \
 && sed -ri 's!/var/www/!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/apache2.conf

WORKDIR /var/www/html
COPY . /var/www/html

# Если нужен composer внутри образа:
# COPY --from=composer:2 /usr/bin/composer /usr/bin/composer
# RUN composer install --no-interaction --no-plugins --no-scripts --prefer-dist

EXPOSE 80
