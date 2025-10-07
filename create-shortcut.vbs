' Create shortcut for GameCard Forge Build System
Set WshShell = CreateObject("WScript.Shell")
Set oMyShortCut = WshShell.CreateShortcut(WshShell.SpecialFolders("Desktop") & "\GameCard Forge Builder.lnk")

' Get current script directory
strCurrentDir = Left(WScript.ScriptFullName, InStrRev(WScript.ScriptFullName, "\"))

oMyShortCut.TargetPath = strCurrentDir & "build.cmd"
oMyShortCut.WorkingDirectory = strCurrentDir
oMyShortCut.Description = "GameCard Forge Build System"
oMyShortCut.IconLocation = strCurrentDir & "assets\icon.ico"
oMyShortCut.WindowStyle = 1
oMyShortCut.Save

WScript.Echo "✅ Desktop shortcut created successfully!"
WScript.Echo "You can now use 'GameCard Forge Builder' shortcut on your desktop."