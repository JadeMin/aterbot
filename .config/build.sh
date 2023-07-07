#!/bin/sh
DIR="$(dirname "$0")"

. $DIR/coloring.sh



clear
echo "${YELLOW}WARNING: Please set ${BG_BLACK} Language ${RESET}${YELLOW} to ${BG_BLACK} Blank Repl ${RESET}${YELLOW} before importing.${RESET}"
echo "Skipping compile process..."
echo