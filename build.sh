#!/bin/sh
cd $TRAVIS_BUILD_DIR/cloud-developer/microservices
sbt ++$TRAVIS_SCALA_VERSION package