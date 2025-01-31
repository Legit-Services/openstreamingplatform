#!/usr/bin/env bash
echo 'Placing Configuration Files'
cp -u -p /opt/osp/installs/nginx-core/nginx.conf /usr/local/nginx/conf/
cp -u -p /opt/osp/installs/nginx-core/mime.types /usr/local/nginx/conf/
cp -u -p /opt/osp/setup/nginx/locations/* /usr/local/nginx/conf/locations
cp -u -p /opt/osp/setup/nginx/upstream/osp-docker.conf /usr/local/nginx/conf/upstream
cp -u -p /opt/osp/setup/nginx/upstream/osp-edge.conf /usr/local/nginx/conf/upstream

echo 'Setting up Directories'
mkdir -p /var/www && \
  mkdir -p /var/www/live && \
  mkdir -p /var/www/videos && \
  mkdir -p /var/www/live-adapt && \
  mkdir -p /var/www/stream-thumb && \
  mkdir -p /var/www/images  && \
  mkdir -p /var/www/keys && \
  mkdir -p /var/www/keys-adapt && \
  mkdir -p /var/www/pending && \
  mkdir -p /var/www/ingest && \
  mkdir -p /var/log/gunicorn && \
  mkdir -p /var/log/osp && \
  chown -R www-data:www-data /var/www && \
  chown -R www-data:www-data /var/log/gunicorn
echo 'Setting up OSP Configuration'

echo 'Performing DB Migrations'
cd /opt/osp

python3 flask db upgrade
cd /

echo 'Fixing OSP Permissions Post Migration'
chown -R www-data:www-data /opt/osp

export OSP_CORE_TYPE

echo "Starting OSP-$OSP_CORE_TYPE"
case "$OSP_CORE_TYPE" in
 celery) supervisord --nodaemon --configuration /opt/osp/docker-files.d/supervisord-celery.conf ;;
 beat) supervisord --nodaemon --configuration /opt/osp/docker-files.d/supervisord-celery-beat.conf ;;
 core) supervisord --nodaemon --configuration /opt/osp/docker-files.d/supervisord.conf ;;
    *) supervisord --nodaemon --configuration /opt/osp/docker-files.d/supervisord.conf ;;
esac
