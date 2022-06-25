/* eslint-disable no-sync */
import { describe, it, expect, afterEach, beforeEach, vi } from 'vitest';
import * as childProcess from 'child_process';
import * as path from 'path';
import * as fs from 'fs/promises';
import * as os from 'os';

describe('Linking Adrs', () => {
  const adr = path.resolve(path.dirname(__filename), '../src/index.ts');
  const command = `npx ts-node ${adr}`;

  let adrDirectory: string;
  let workDir: string;

  beforeEach(async () => {
    // @ts-ignore
    process.env.ADR_DATE = '1992-01-12';
    workDir = await fs.mkdtemp(path.join(os.tmpdir(), 'adr-'));
    adrDirectory = path.join(workDir, 'doc/adr');
  });

  afterEach(() => {
    vi.clearAllMocks();
    childProcess.execSync(`rm -rf ${workDir}`);
  });

  it('should link adrs as expected', async () => {
    childProcess.execSync(`${command} new First Record`, { cwd: workDir });
    childProcess.execSync(`${command} new Second Record`, { cwd: workDir });
    childProcess.execSync(`${command} new -q -l "1:Amends:Amended by" -l "2:Clarifies:Clarified by" Third Record`, { cwd: workDir });

    const first: string = path.join(adrDirectory, '0001-first-record.md');
    const second: string = path.join(adrDirectory, '0002-second-record.md');
    const third: string = path.join(adrDirectory, '0003-third-record.md');

    const firstContent = await fs.readFile(first, 'utf8');
    const secondContent = await fs.readFile(second, 'utf8');
    const thirdContent = await fs.readFile(third, 'utf8');

    expect(firstContent).toMatchSnapshot();
    expect(secondContent).toMatchSnapshot();
    expect(thirdContent).toMatchSnapshot();
  });
});