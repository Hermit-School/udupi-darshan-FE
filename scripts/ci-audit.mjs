import { spawnSync } from 'node:child_process';

const allowedPackage = 'picomatch';
const allowedAdvisory = 'https://github.com/advisories/GHSA-fc5q-39xc-vjpf';

function isKnownFinding(vulnerabilities) {
  const root = vulnerabilities?.[allowedPackage];
  if (root?.fixAvailable !== false || !Array.isArray(root.via) || root.via.length !== 1) return false;

  const [advisory] = root.via;
  if (advisory?.url !== allowedAdvisory || advisory.name !== allowedPackage ||
      advisory.dependency !== allowedPackage || advisory.severity !== 'high' ||
      advisory.range !== '<=4.0.7') return false;

  const entries = Object.entries(vulnerabilities).filter(([name]) => name !== allowedPackage);
  if (entries.some(([, finding]) => !Array.isArray(finding?.via) || !finding.via.length ||
      finding.via.some(cause => typeof cause !== 'string' || !Object.hasOwn(vulnerabilities, cause)))) {
    return false;
  }

  const affected = new Set([allowedPackage]);
  let previousSize;
  do {
    previousSize = affected.size;
    for (const [name, finding] of entries) {
      if (finding.via.some(cause => affected.has(cause))) affected.add(name);
    }
  } while (affected.size !== previousSize);
  return affected.size === entries.length + 1;
}

const result = spawnSync(process.execPath, [process.env.npm_execpath, 'audit', '--audit-level=low', '--json'], {
  encoding: 'utf8',
  stdio: ['ignore', 'pipe', 'inherit'],
});

let report;
try {
  report = JSON.parse(result.stdout);
} catch {
  // npm may emit non-JSON output when the audit command fails.
}

if (result.status === 0 && report?.auditReportVersion === 2 && !report.error &&
    report.vulnerabilities && Object.keys(report.vulnerabilities).length === 0) {
  console.log('npm audit found no vulnerabilities.');
} else if (result.status === 1 && report?.auditReportVersion === 2 && !report.error &&
    isKnownFinding(report.vulnerabilities)) {
  console.warn(`npm audit reported ${Object.keys(report.vulnerabilities).length} findings related to ${allowedAdvisory}.`);
  console.warn('CI is temporarily allowing this advisory while npm reports no fix for picomatch.');
} else {
  console.error(result.error ?? (result.stdout || 'npm audit did not return a valid report.'));
  process.exitCode = 1;
}
