#!/usr/bin/env bash

ROOT_DIR="/mnt/volume_nyc3_01/preprocessing/"
WORKSPACE_DIR="${ROOT_DIR}tmp_workspace"
CARFILES_DIR="${ROOT_DIR}carfiles_output"
DATASETS_DIR="${ROOT_DIR}datasets"

echo "clearing workspace"
rm -rf $WORKSPACE_DIR/*
echo "clearing carfiles"
rm -rf $CARFILES_DIR/*
echo "clearing datasets"
rm -rf $DATASETS_DIR/*
echo "Done."
