# Spot Price Visualizer

## Deployment

 1. ``git clone git@github.com:garethgeorge/price-heatmap-viz.git``
 2. ``cd price-heatmap-viz && npm install``
 3. ``cd client && npm install``
 4. finally, run docker-compose up in the root of the git repository and the site will come online

## Configuration

 edit the config.js with a unique admin\_secret and postgres credentials to restrict access to your installation

## Importing Data 

Post CSV files containing new data to ``/api/admin/new_data?secret=<your secret>`` to import new spot data to the database.


