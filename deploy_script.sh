#!/bin/bash

DRY_RUN=$1

echo "Pulling latest code from repository..."
# Skip actual git pull in dry run
# [ "$DRY_RUN" != "true" ] && 
# git pull origin main
git pull https://$1:$2@github.com/amanmyrats/babajangurlusyk $3

cd /home/ubuntu/babajangurlusyk/backend

echo "Installing dependencies..."
# Skip actual installation in dry run
# [ "$DRY_RUN" != "true" ] && 
./venv/bin/pip3 install -r requirements.txt

echo "Running migrations..."
# Skip actual migrations in dry run
# [ "$DRY_RUN" != "true" ] && 
./venv/bin/python3.11 manage.py migrate

echo "Collect static files"
# Skip collectstatic in dry run
# [ "$DRY_RUN" != "true" ] && 
./venv/bin/python3.11 manage.py collectstatic --no-input

echo "Reloading the daemon..."
sudo systemctl daemon-reload

echo "Restarting the Gunicorn server..."
# Skip actual restart in dry run
# [ "$DRY_RUN" != "true" ] && 
sudo systemctl restart babajangurlusyk.gunicorn

# echo "Restarting the celery..."
# sudo systemctl restart babajangurlusyk.celery

# echo "Restarting the celery.beat..."
# sudo systemctl restart babajangurlusyk.celery.beat

echo "Deployment complete."
