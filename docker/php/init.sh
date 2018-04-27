#!/usr/bin/env bash

cd /webroot/wizard && php /usr/bin/composer install

cp .env.docker .env
php /webroot/wizard/artisan migrate --force
php /webroot/wizard/artisan storage:link