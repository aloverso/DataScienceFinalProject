#!/bin/bash
for i in `seq 41 50`;
do
	# you're gonna have to change this if you run it and you're not anne
	cd /media/anne/LACIE\ SHARE/DataScienceFinalProject
	rsync -avz --delete --delete-excluded --exclude **/text-versions/ govtrack.us::govtrackdata/congress/$i .
done