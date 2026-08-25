@echo off
rem AnantaSutra daily SEO + GEO automation — runs Claude Code headless
cd /d "c:\Users\duneja8515\Desktop\bhavya\prsnl\Portfolio"
echo. >> "temp\seo-pipeline\run-log.txt"
echo ===== RUN %date% %time% ===== >> "temp\seo-pipeline\run-log.txt"
call "%APPDATA%\npm\claude.cmd" -p --dangerously-skip-permissions < "temp\seo-pipeline\daily-seo-prompt.md" >> "temp\seo-pipeline\run-log.txt" 2>&1
echo ----- GSC pull ----- >> "temp\seo-pipeline\run-log.txt"
"C:\Users\duneja8515\AppData\Local\Programs\Python\Python312\python.exe" "temp\seo-pipeline\gsc_pull.py" >> "temp\seo-pipeline\run-log.txt" 2>&1
echo ----- push to admin (Supabase) ----- >> "temp\seo-pipeline\run-log.txt"
"C:\Users\duneja8515\AppData\Local\Programs\Python\Python312\python.exe" "temp\seo-pipeline\push_seo_to_db.py" >> "temp\seo-pipeline\run-log.txt" 2>&1
echo ===== END %date% %time% (exit %errorlevel%) ===== >> "temp\seo-pipeline\run-log.txt"
