#!/bin/bash

# This does the exact same thing as migrate, just overrides the host to be localhost.

##############################################
# sources
##############################################

set -e
scriptName='migrateDev'
pushkin_conf_dir="$PWD"/.pushkin

source "${pushkin_conf_dir}/pushkin_config_vars.sh"
source "${pushkin_conf_dir}/bin/core.sh"
source "${pushkin_env_file}"
set +e

##############################################
# variables
# WORKING DIR: pushkin root
##############################################
set -e

log () { echo "${boldFont}${scriptName}:${normalFont} ${1}"; }
die () { echo "${boldFont}${scriptName}:${normalFont} ${1}"; exit 1; }

set +e

##############################################
# start
##############################################

export DATABASE_URL="postgres://${main_db_user}:${main_db_pass}@${localhost}/${main_db_name}"
cd "${pushkin_db_worker}"
npm run migrations

log "done"
