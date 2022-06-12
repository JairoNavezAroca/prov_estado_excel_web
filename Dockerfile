FROM php:8.0-apache

RUN a2enmod rewrite

EXPOSE 80

WORKDIR /var/www/html