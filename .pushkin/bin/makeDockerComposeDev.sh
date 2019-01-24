#!/bin/bash

##############################################
# sources
##############################################

set -e
pushkin_conf_dir="$PWD"/.pushkin

source "${pushkin_conf_dir}/pushkin_config_vars.sh"
source "${pushkin_conf_dir}/bin/core.sh"
source "${pushkin_conf_dir}/bin/util/isQuiz.sh"
source "${pushkin_env_file}"
set +e

##############################################
# variables
# WORKING DIR: pushkin root
##############################################
set -e

log () { echo "${boldFont}makeDockerCompose:${normalFont} ${1}"; }
die () { log "${1}"; exit 1; }

env_file="${pushkin_env_file}"
dc_file="${pushkin_docker_compose_file}"
dc_file_dev="${pushkin_docker_compose_file_dev}"
dc_noDep_file="${pushkin_docker_compose_noDep_file}"

user_quizzes="${pushkin_user_quizzes}"
set +e

##############################################
# start
##############################################

log "creating copy with .new suffix"
if [ ! -f "${dc_file_dev}" ]; then
	die "docker compose dev file not found! looking for: ${dc_file_dev}"
fi
cp "${dc_file_dev}" "${dc_file_dev}".new

log "appending quiz-compose appendages"
sed -i.sedBak '/^#@AUTOAPPENDBELOWTHISLINE$/,$d' "${dc_file_dev}".new
echo '#@AUTOAPPENDBELOWTHISLINE' >> "${dc_file_dev}".new

for qPath in "${user_quizzes}"/*; do
	if ! isQuiz "${qPath}"; then continue; fi

	qName=$(basename "$qPath")
	if [ -f "$qPath/worker/docker_compose_appendage.yml" ]; then
		cat "${qPath}/worker/docker_compose_appendage.yml" >> "${dc_file_dev}".new
	fi
done


log "making no-env dependency file"
set -a
. "${env_file}"
. "${pushkin_conf_dir}/pushkin_config_vars.sh"
set +a
cat "${dc_file_dev}".new | envsubst > "${dc_noDep_file}"

rm "${dc_file_dev}".new
rm "${dc_file_dev}".new.sedBak

log "done"
