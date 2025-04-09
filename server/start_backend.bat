@echo off
chcp 65001
echo Démarrage du serveur backend...
cd %~dp0
npx tsx src/index.ts
pause 