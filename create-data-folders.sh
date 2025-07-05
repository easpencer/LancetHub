#!/bin/bash

# Create data directory
mkdir -p data

# Ensure CSV files are properly created
echo "Creating data directory and sample data files..."

# Create symlinks to data files
ln -sf ../data/people.csv data/people.csv
ln -sf ../data/landscape.csv data/landscape.csv
ln -sf ../data/case-studies.csv data/case-studies.csv
ln -sf ../data/bibliography.csv data/bibliography.csv

echo "Data directories and symlinks created!"
