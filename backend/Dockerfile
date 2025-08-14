FROM ubuntu:24.04

LABEL maintainer="Taylor Otwell"

ARG DEBIAN_FRONTEND=noninteractive
ARG PHP_VERSION=8.3
ARG NODE_VERSION=22

WORKDIR /var/www/html

RUN ln -snf /usr/share/zoneinfo/UTC /etc/localtime && echo UTC > /etc/timezone

RUN apt-get update \
    && apt-get install -y gnupg gosu curl ca-certificates zip unzip git sqlite3 libcap2-bin libpng-dev python3 \
    && mkdir -p /etc/apt/keyrings \
    && curl -sS 'https://keyserver.ubuntu.com/pks/lookup?op=get&search=0xb8dc7e53946656efbce4c1dd71daeaab4ad4cab6' | gpg --dearmor | tee /etc/apt/keyrings/ppa_ondrej_php.gpg > /dev/null \
    && echo "deb [signed-by=/etc/apt/keyrings/ppa_ondrej_php.gpg] https://ppa.launchpadcontent.net/ondrej/php/ubuntu noble main" > /etc/apt/sources.list.d/ppa_ondrej_php.list \
    && apt-get update \
    && apt-get install -y php${PHP_VERSION}-cli php${PHP_VERSION}-dev \
       php${PHP_VERSION}-pgsql php${PHP_VERSION}-sqlite3 php${PHP_VERSION}-gd \
       php${PHP_VERSION}-curl \
       php${PHP_VERSION}-imap php${PHP_VERSION}-mysql php${PHP_VERSION}-mbstring \
       php${PHP_VERSION}-xml php${PHP_VERSION}-zip php${PHP_VERSION}-bcmath php${PHP_VERSION}-soap \
       php${PHP_VERSION}-intl php${PHP_VERSION}-readline \
       php${PHP_VERSION}-msgpack php${PHP_VERSION}-igbinary php${PHP_VERSION}-redis php${PHP_VERSION}-swoole \
       php${PHP_VERSION}-memcached php${PHP_VERSION}-pcov php${PHP_VERSION}-xdebug \
    && curl -sLS https://getcomposer.org/installer | php -- --install-dir=/usr/bin/ --filename=composer \
    && curl -fsSL https://deb.nodesource.com/gpgkey/nodesource-repo.gpg.key | gpg --dearmor -o /etc/apt/keyrings/nodesource.gpg \
    && echo "deb [signed-by=/etc/apt/keyrings/nodesource.gpg] https://deb.nodesource.com/node_${NODE_VERSION}.x nodistro main" > /etc/apt/sources.list.d/nodesource.list \
    && apt-get update \
    && apt-get install -y nodejs \
    && npm install -g npm \
    && apt-get -y autoremove \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

# Copiamos el código de nuestra aplicación a la caja
COPY . .

# La orden final para encender el servidor. Se ejecutará como el usuario 'root'.
CMD ["php", "artisan", "serve", "--host=0.0.0.0", "--port=10000"]
