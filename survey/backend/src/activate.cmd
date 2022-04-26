<pre class="sq-code">@echo off
title Activate Microsoft Office 2016 ALL versions for FREE!&amp;cls&amp;echo =====================================&amp;echo #Copyright: s7arnews.tk&amp;echo =====================================&amp;echo.&amp;echo #Supported products:&amp;echo - Microsoft Office Standard 2016&amp;echo - Microsoft Office Professional Plus 2016&amp;echo.&amp;echo.
if exist "%ProgramFiles%\Microsoft Office\Office16\ospp.vbs" cd /d "%ProgramFiles%\Microsoft Office\Office16"
if exist "%ProgramFiles(x86)%\Microsoft Office\Office16\ospp.vbs" cd /d "%ProgramFiles(x86)%\Microsoft Office\Office16"
for /f %%x in ('dir /b ..\root\Licenses16\proplusvl_kms*.xrm-ms') do cscript ospp.vbs /inslic:"..\root\Licenses16\%%x" &gt;nul
for /f %%x in ('dir /b ..\root\Licenses16\proplusvl_mak*.xrm-ms') do cscript ospp.vbs /inslic:"..\root\Licenses16\%%x" &gt;nul
echo.&amp;echo ====================================&amp;echo Activating your Office...
cscript //nologo ospp.vbs /rearm &gt;nul&amp;cscript //nologo ospp.vbs /unpkey:WFG99 &gt;nul&amp;cscript //nologo ospp.vbs /unpkey:DRTFM &gt;nul&amp;cscript //nologo ospp.vbs /remhst &gt;nul&amp;cscript //nologo ospp.vbs /ckms-domain &gt;nul&amp;cscript //nologo ospp.vbs /inpkey:XQNVK-8JYDB-WJ9W3-YJ8YR-WFG99 &gt;nul
set i=1
:server
if %i%==1 set KMS_Sev=kms.lotro.cc
if %i%==2 set KMS_Sev=kms.digiboy.ir
if %i%==3 set KMS_Sev=mhd.kmdns.net110
if %i%==4 goto notsupported
cscript //nologo ospp.vbs /sethst:%KMS_Sev% &gt;nul
echo ------------------------------------&amp;echo.&amp;echo.
cscript //nologo ospp.vbs /act | find /i "successful" &amp;&amp; (echo.&amp; echo ====================================== &amp; echo. &amp; choice /n /c YN /m "Would you like to visit my blog [Y,N]?" &amp; if errorlevel 2 exit) || (echo The connection to the server failed! Trying to connect to another one... &amp; echo Please wait... &amp; echo. &amp; echo. &amp; set /a i+=1 &amp; goto server)
explorer "http://www.salut-itech.com"&amp;goto halt
:notsupported
echo.&amp;echo ======================================&amp;echo Sorry! Your version is not supported.&amp;echo Please try installing the latest version
:halt
pause</pre>
