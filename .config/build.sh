#!/bin/sh
DIR="$(dirname "$0")"

. $DIR/coloring.sh



clear
echo $YELLOW
echo "WARNING: Please set ${BG_BLACK} Language ${RESET}${YELLOW} to ${BG_BLACK} Blank Repl ${RESET}${YELLOW} before importing."
echo "WARNING: Skipping compile process..."
echo $RESET