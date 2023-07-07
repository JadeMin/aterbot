#!/bin/sh
export RESET = "\e[0m"
export RED = "\e[0;31m"
export YELLOW = "\e[0;33m"
export BG_BLACK = "\e[40m"

echo 
echo "${YELLOW}WARNING: Please set ${BG_BLACK}Language${RESET}${YELLOW} to ${BG_BLACK}Blank Repl${RESET}${YELLOW} before importing."
echo "Skipping compile process...${RESET}"
echo