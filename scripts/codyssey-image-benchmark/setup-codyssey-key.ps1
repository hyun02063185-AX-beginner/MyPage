[CmdletBinding()]
param()

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

$keyDirectory = Join-Path -Path $HOME -ChildPath '.config\codyssey'
$keyPath = Join-Path -Path $keyDirectory -ChildPath 'codyssey.key'
$secureKey = $null
$encryptedKey = $null

try {
  New-Item -ItemType Directory -Path $keyDirectory -Force | Out-Null
  $secureKey = Read-Host 'Codyssey API Key' -AsSecureString
  $encryptedKey = ConvertFrom-SecureString -SecureString $secureKey
  [System.IO.File]::WriteAllText($keyPath, $encryptedKey, [System.Text.UTF8Encoding]::new($false))

  $savedFile = Get-Item -LiteralPath $keyPath -ErrorAction Stop
  if ($savedFile.Length -le 0) {
    throw 'The encrypted key file was empty after writing.'
  }

  Write-Output 'Codyssey encrypted key saved.'
  Write-Output "Path: $keyPath"
}
finally {
  $encryptedKey = $null
  if ($null -ne $secureKey) {
    $secureKey.Dispose()
    $secureKey = $null
  }
}
