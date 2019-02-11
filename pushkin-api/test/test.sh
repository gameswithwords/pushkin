trap 'kill $(jobs -p)' EXIT
echo "STARTING"
cd worker
./start.sh&
echo "STARTED WORKER"
cd ..
#rabbitmq-server&
#echo "STARTED RABBITMQ"
while ! nc -z localhost 5672; do sleep 3; done&
echo "RABBITMQ LOADED"
node testAPI.js&
echo "STARTED testAPI.js"
wait
