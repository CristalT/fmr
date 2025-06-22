#!/bin/bash

#BACKUP_DIR="backup_$(date +%Y%m%d_%H%M%S)"

# Create backup directory
#if [ -d "app" ]; then
#	mv app $BACKUP_DIR
#	echo "Backup created: $BACKUP_DIR"
#fi

mkdir -p fmr-site

echo "Descomprimiendo imagen ..."
SOURCE_IMAGE=/home/sammy/ftp/files/build.tar.gz

tar -xzf $SOURCE_IMAGE -C fmr-site/

rm $SOURCE_IMAGE

echo "Copiando variables de entorno ..."
cp /root/.env fmr-site/.env
cp /root/.env fmr-site/build/.env

echo "Archivos listos ..."
ls -la fmr-site/

echo "Instalando dependencias de desarrollo ..."
cd fmr-site
/root/.nvm/versions/node/v21.7.3/bin/pnpm i

echo "Instalando dependencias productivas ..."
cd build
/root/.nvm/versions/node/v21.7.3/bin/pnpm i --prod

echo "Reiniciando servicio ..."
/root/.nvm/versions/node/v21.7.3/bin/pm2 stop fmr-site
/root/.nvm/versions/node/v21.7.3/bin/pm2 start ./bin/server.js -n fmr-site

echo "Deploy finalizado!"
