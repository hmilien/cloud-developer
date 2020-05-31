#!/bin/sh
cd $TRAVIS_BUILD_DIR/projectcloud-developer/microservices
sbt ++$TRAVIS_SCALA_VERSION package