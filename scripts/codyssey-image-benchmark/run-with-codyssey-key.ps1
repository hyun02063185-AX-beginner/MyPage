[CmdletBinding()]
param(
  [Parameter(Mandatory = $true)]
  [ValidateNotNullOrEmpty()]
  [string]$Script,

  [Parameter(ValueFromRemainingArguments = $true)]
  [string[]]$Arguments
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

$keyPath = Join-Path -Path (Join-Path -Path $HOME -ChildPath '.config\codyssey') -ChildPath 'codyssey.key'
if (-not (Test-Path -LiteralPath $keyPath -PathType Leaf)) {
  [Console]::Error.WriteLine('Codyssey encrypted key not found.')
  [Console]::Error.WriteLine('Run setup-codyssey-key.ps1 first.')
  exit 1
}

if (-not (Test-Path -LiteralPath $Script -PathType Leaf)) {
  [Console]::Error.WriteLine('Codyssey Node script not found.')
  exit 1
}

$resolvedScript = (Resolve-Path -LiteralPath $Script -ErrorAction Stop).Path
$hadPreviousKey = Test-Path Env:CODYSSEY_API_KEY
$previousKey = if ($hadPreviousKey) { [Environment]::GetEnvironmentVariable('CODYSSEY_API_KEY', 'Process') } else { $null }
$encryptedKey = $null
$secureKey = $null
$bstr = [IntPtr]::Zero
$plainKey = $null
$exitCode = 1

try {
  $encryptedKey = [System.IO.File]::ReadAllText($keyPath).Trim()
  if ([string]::IsNullOrWhiteSpace($encryptedKey)) {
    throw 'The encrypted key file is empty.'
  }

  $secureKey = ConvertTo-SecureString -String $encryptedKey
  $bstr = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($secureKey)
  $plainKey = [Runtime.InteropServices.Marshal]::PtrToStringBSTR($bstr)
  if ([string]::IsNullOrWhiteSpace($plainKey)) {
    throw 'The decrypted key was empty.'
  }

  [Environment]::SetEnvironmentVariable('CODYSSEY_API_KEY', $plainKey, 'Process')
  & node $resolvedScript @Arguments
  $exitCode = if ($null -eq $LASTEXITCODE) { 1 } else { [int]$LASTEXITCODE }
}
catch {
  [Console]::Error.WriteLine('Codyssey wrapper failed without invoking a usable child process.')
  $exitCode = 1
}
finally {
  if ($bstr -ne [IntPtr]::Zero) {
    [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($bstr)
    $bstr = [IntPtr]::Zero
  }
  $plainKey = $null
  $encryptedKey = $null
  if ($null -ne $secureKey) {
    $secureKey.Dispose()
    $secureKey = $null
  }
  if ($hadPreviousKey) {
    [Environment]::SetEnvironmentVariable('CODYSSEY_API_KEY', $previousKey, 'Process')
  }
  else {
    [Environment]::SetEnvironmentVariable('CODYSSEY_API_KEY', $null, 'Process')
  }
  $previousKey = $null
}

exit $exitCode
