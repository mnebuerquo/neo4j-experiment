#REGISTRY="something/"
IMAGE="${REGISTRY}neo4j"

#docker pull ${registry}neo4j
docker run \
    --publish=7474:7474 --publish=7687:7687 \
    --volume=$HOME/neo4j/data:/data \
    $IMAGE
