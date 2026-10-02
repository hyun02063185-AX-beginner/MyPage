[CmdletBinding()]
param()

$ErrorActionPreference = 'Stop'
$here = Split-Path -Parent $MyInvocation.MyCommand.Path
& (Join-Path $here 'run-with-codyssey-key.ps1') -Script (Join-Path $here 'generate-r3d-architecture-candidates.mjs') -Arguments @('--next')
exit $LASTEXITCODE
