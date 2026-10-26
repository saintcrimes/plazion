param(
    [switch]$CheckOnly,
    [string]$Repository = 'https://github.com/saintcrimes/plazion.git',
    [string]$CheckoutRoot = [System.IO.Path]::GetTempPath()
)

$ErrorActionPreference = 'Stop'
$projectRoot = Split-Path -Parent $PSScriptRoot
$sourceItems = @(
    '.github', '.gitignore', '.node-version', 'README.md', 'index.html',
    'package.json', 'package-lock.json', 'vite.config.js', 'wrangler.jsonc', 'tsconfig.json', 'components.json',
    'components', 'lib',
    'src', 'public', 'tests', 'scripts', 'plazion_ru.html'
)

foreach ($item in $sourceItems) {
    if (-not (Test-Path -LiteralPath (Join-Path $projectRoot $item))) {
        throw "Required source item is missing: $item"
    }
}

if ($CheckOnly) {
    Write-Host 'Publishing source list is valid. No GitHub changes made.'
    return
}

function Invoke-ProjectGit {
    param([string[]]$GitArguments)
    & git @GitArguments
    if ($LASTEXITCODE -ne 0) {
        throw "Git failed (exit $LASTEXITCODE). Publication stopped without force-pushing."
    }
}

# Clone without selecting a branch so empty repositories and repositories
# whose default branch has another name are supported. The source folder's
# .git metadata is never used, so its ownership does not affect publishing.
$checkout = Join-Path $CheckoutRoot ('plazion-publish-' + [guid]::NewGuid().ToString('N'))
Write-Host "Preparing a checkout at $checkout"
Invoke-ProjectGit -GitArguments @('clone', '--', $Repository, $checkout)

& git -C $checkout show-ref --verify --quiet refs/remotes/origin/main
$mainStatus = $LASTEXITCODE
if ($mainStatus -eq 0) {
    Invoke-ProjectGit -GitArguments @('-C', $checkout, 'switch', 'main')
} elseif ($mainStatus -eq 1) {
    & git -C $checkout rev-parse --verify --quiet HEAD | Out-Null
    $headStatus = $LASTEXITCODE
    if ($headStatus -eq 0) {
        # Start main from the current default branch, preserving its history.
        Invoke-ProjectGit -GitArguments @('-C', $checkout, 'switch', '-c', 'main')
    } elseif ($headStatus -eq 1) {
        $remoteBranches = @(& git -C $checkout for-each-ref '--format=%(refname)' refs/remotes/origin)
        if ($LASTEXITCODE -ne 0) {
            throw 'Unable to inspect remote branches.'
        }
        $startingBranch = $remoteBranches | Where-Object { $_ -ne 'refs/remotes/origin/HEAD' } | Sort-Object | Select-Object -First 1
        if ($startingBranch) {
            # A remote can contain commits while its default HEAD is unset.
            Invoke-ProjectGit -GitArguments @('-C', $checkout, 'switch', '-c', 'main', $startingBranch)
        } else {
            # Empty remote: create an unborn main branch for the first commit.
            Invoke-ProjectGit -GitArguments @('-C', $checkout, 'symbolic-ref', 'HEAD', 'refs/heads/main')
        }
    } else {
        throw 'Unable to inspect the checkout history.'
    }
} else {
    throw 'Unable to check whether origin/main exists.'
}

foreach ($item in $sourceItems) {
    Copy-Item -LiteralPath (Join-Path $projectRoot $item) -Destination $checkout -Recurse -Force
}

Invoke-ProjectGit -GitArguments @('-C', $checkout, 'add', '--all')
& git -C $checkout diff --cached --quiet
if ($LASTEXITCODE -eq 1) {
    Invoke-ProjectGit -GitArguments @(
        '-C', $checkout,
        '-c', 'user.name=Behzod Ergashev',
        '-c', 'user.email=behzodergasov5@gmail.com',
        'commit', '-m', 'Polish PLazion website with themes, translations and B2B pricing'
    )
} elseif ($LASTEXITCODE -ne 0) {
    throw 'Unable to inspect the staged changes.'
}

Invoke-ProjectGit -GitArguments @('-C', $checkout, 'push', 'origin', 'HEAD:main')
Write-Host "PLazion source pushed to $Repository on main."
Write-Host "Checkout retained at $checkout"
