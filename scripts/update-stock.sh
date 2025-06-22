#!/bin/bash

# Configuración de logging
LOG_FILE="/var/log/update-stock.log"
DATE=$(date '+%Y-%m-%d %H:%M:%S')

# Función para logging con timestamp
log() {
    echo "[$DATE] $1" | tee -a "$LOG_FILE"
}

# Cambiar al directorio del script
cd /root/fmr-site

log "=== Initializing stock update ==="

# read .env file and get the STOCK_LIST_SOURCE value
STOCK_LIST=$(grep '^STOCK_LIST=' .env | cut -d '=' -f2-)
STOCK_LIST_UTF8=$(grep '^STOCK_LIST_UTF8=' .env | cut -d '=' -f2-)

log "Source file: $STOCK_LIST"
log "Destinatary file: $STOCK_LIST_UTF8"

# Convert the $STOCK_LIST_SOURCE file from windows-1252 to utf-8
if [ ! -f $STOCK_LIST ]; then
  log "ERROR: $STOCK_LIST file not found!"
  exit 1
fi

log "Converting file from windows-1252 to utf-8..."
iconv -f windows-1252 -t utf-8 $STOCK_LIST > $STOCK_LIST_UTF8

# Check if the conversion was successful
if [ $? -ne 0 ]; then
  log "ERROR: Failed to convert $STOCK_LIST to UTF-8."
  exit 1
fi
log "Successfully converted $STOCK_LIST to UTF-8 and saved to $STOCK_LIST_UTF8."

# Run the stock:update command
log "Running stock update command..."
/root/.nvm/versions/node/v21.7.3/bin/node ace stock:update >> "$LOG_FILE" 2>&1

# Check if the command was successful
if [ $? -ne 0 ]; then
  log "ERROR: Failed to update stock."
  exit 1
fi
log "Stock updated successfully."
log "=== Update completed ==="
log ""
