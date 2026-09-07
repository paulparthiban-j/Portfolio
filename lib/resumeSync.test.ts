import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import path from 'path';
import type { PortfolioContent } from '@/types/portfolio';

// Mock fs so createBackup does no real filesystem I/O. Both the default
// export (`import fs from 'fs'`, what resumeSync.ts uses) and the named
// exports are backed by the same vi.fn() instances, so assertions work
// regardless of which import shape is in play.
vi.mock('fs', () => {
  const existsSync = vi.fn();
  const mkdirSync = vi.fn();
  const writeFileSync = vi.fn();
  return {
    existsSync,
    mkdirSync,
    writeFileSync,
    default: { existsSync, mkdirSync, writeFileSync },
  };
});

import fs from 'fs';
import { createBackup, mergePortfolioData } from './resumeSync';

// A realistic, fully-populated current PortfolioContent fixture, standing
// in for real admin-curated data. mergePortfolioData's tests build newData
// variants from this and check what does/doesn't survive the merge.
const currentFixture: PortfolioContent = {
  name: 'Current Name',
  title: 'Current Title',
  subtitle: 'Current Subtitle',
  description: 'Current description',
  email: 'current@example.com',
  phone: '111-111-1111',
  location: 'Current City, Current Country',
  github: 'https://github.com/current',
  linkedin: 'https://linkedin.com/in/current',
  twitter: 'https://twitter.com/current',
  website: 'https://current.dev',
  skills: ['CurrentSkillA', 'CurrentSkillB'],
  projects: [
    { title: 'Current Project', description: 'desc', tech: 'tech', link: '', github: '', impact: [] },
  ],
  experience: [
    { company: 'Current Co', position: 'Dev', duration: '2020-2021', description: 'did stuff' },
  ],
  education: [{ institution: 'Current University', degree: 'BSc', year: '2019' }],
  stats: [{ number: 5, label: 'Years', suffix: '+' }],
  theme: {
    primaryColor: '#123456',
    primaryGradient: 'linear-gradient(current)',
    accent: '#abcdef',
    bg: '#ffffff',
    mode: 'dark',
  },
  projectsTitle: 'My Projects',
  skillsTitle: 'My Skills',
  experienceTitle: 'My Experience',
  educationTitle: 'My Education',
  aboutTitle: 'About Me',
  customSections: [{ title: 'Custom', content: 'Custom content' }],
  resumeUrl: '/resume.pdf',
  testimonials: [{ name: 'Jane', role: 'Manager', text: 'Great work' }],
  certifications: [{ name: 'Cert A', issuer: 'Issuer A', year: '2022' }],
  currentWork: 'Working on X',
  boldStatement: 'I build things.',
};

describe('createBackup', () => {
  beforeEach(() => {
    vi.mocked(fs.existsSync).mockReset();
    vi.mocked(fs.mkdirSync).mockReset();
    vi.mocked(fs.writeFileSync).mockReset();
    vi.spyOn(Date, 'now').mockReturnValue(1700000000000);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('creates the data directory when it does not already exist', () => {
    vi.mocked(fs.existsSync).mockReturnValue(false);

    createBackup(currentFixture);

    expect(fs.mkdirSync).toHaveBeenCalledWith(path.join(process.cwd(), 'data'), { recursive: true });
  });

  it('does not create the data directory when it already exists', () => {
    vi.mocked(fs.existsSync).mockReturnValue(true);

    createBackup(currentFixture);

    expect(fs.mkdirSync).not.toHaveBeenCalled();
  });

  it('writes a timestamped JSON backup and returns the path it wrote to', () => {
    vi.mocked(fs.existsSync).mockReturnValue(true);

    const result = createBackup(currentFixture);
    const expectedPath = path.join(process.cwd(), 'data', 'portfolio.backup.1700000000000.json');

    expect(result).toBe(expectedPath);
    expect(fs.writeFileSync).toHaveBeenCalledWith(
      expectedPath,
      JSON.stringify(currentFixture, null, 2),
      'utf-8'
    );
  });

  it('performs no real filesystem I/O (fs is fully mocked)', () => {
    vi.mocked(fs.existsSync).mockReturnValue(false);

    createBackup(currentFixture);

    expect(fs.existsSync).toHaveBeenCalledTimes(1);
    expect(fs.mkdirSync).toHaveBeenCalledTimes(1);
    expect(fs.writeFileSync).toHaveBeenCalledTimes(1);
  });
});

describe('mergePortfolioData', () => {
  it('overwrites resume-derived fields when newData provides truthy values', () => {
    const newData: Partial<PortfolioContent> = {
      name: 'New Name',
      title: 'New Title',
      subtitle: 'New Subtitle',
      description: 'New description',
      email: 'new@example.com',
      phone: '222-222-2222',
      location: 'New City, New Country',
      github: 'https://github.com/newuser',
      linkedin: 'https://linkedin.com/in/newuser',
      skills: ['NewSkillA'],
      projects: [{ title: 'New Project', description: 'x', tech: 'y', link: '', github: '', impact: [] }],
      experience: [{ company: 'New Co', position: 'Lead', duration: '2022-2023', description: 'new stuff' }],
      education: [{ institution: 'New University', degree: 'MSc', year: '2023' }],
      certifications: [{ name: 'New Cert', issuer: 'New Issuer', year: '2024' }],
    };

    const result = mergePortfolioData(currentFixture, newData);

    expect(result.name).toBe('New Name');
    expect(result.title).toBe('New Title');
    expect(result.subtitle).toBe('New Subtitle');
    expect(result.description).toBe('New description');
    expect(result.email).toBe('new@example.com');
    expect(result.phone).toBe('222-222-2222');
    expect(result.location).toBe('New City, New Country');
    expect(result.github).toBe('https://github.com/newuser');
    expect(result.linkedin).toBe('https://linkedin.com/in/newuser');
    expect(result.skills).toEqual(newData.skills);
    expect(result.projects).toEqual(newData.projects);
    expect(result.experience).toEqual(newData.experience);
    expect(result.education).toEqual(newData.education);
    expect(result.certifications).toEqual(newData.certifications);
  });

  it('preserves current values for string and array fields when newData omits them entirely', () => {
    const result = mergePortfolioData(currentFixture, {});

    expect(result.name).toBe(currentFixture.name);
    expect(result.title).toBe(currentFixture.title);
    expect(result.subtitle).toBe(currentFixture.subtitle);
    expect(result.description).toBe(currentFixture.description);
    expect(result.email).toBe(currentFixture.email);
    expect(result.phone).toBe(currentFixture.phone);
    expect(result.location).toBe(currentFixture.location);
    expect(result.github).toBe(currentFixture.github);
    expect(result.linkedin).toBe(currentFixture.linkedin);
    expect(result.skills).toEqual(currentFixture.skills);
    expect(result.projects).toEqual(currentFixture.projects);
    expect(result.experience).toEqual(currentFixture.experience);
    expect(result.education).toEqual(currentFixture.education);
    expect(result.certifications).toEqual(currentFixture.certifications);
  });

  it('preserves current string values when newData provides empty strings rather than omitting the keys', () => {
    const newData: Partial<PortfolioContent> = {
      name: '',
      title: '',
      subtitle: '',
      description: '',
      email: '',
      phone: '',
      location: '',
      github: '',
      linkedin: '',
    };

    const result = mergePortfolioData(currentFixture, newData);

    expect(result.name).toBe(currentFixture.name);
    expect(result.title).toBe(currentFixture.title);
    expect(result.subtitle).toBe(currentFixture.subtitle);
    expect(result.description).toBe(currentFixture.description);
    expect(result.email).toBe(currentFixture.email);
    expect(result.phone).toBe(currentFixture.phone);
    expect(result.location).toBe(currentFixture.location);
    expect(result.github).toBe(currentFixture.github);
    expect(result.linkedin).toBe(currentFixture.linkedin);
  });

  it('documents a nuance: an explicit empty array DOES overwrite current array fields, unlike an empty string', () => {
    // mergePortfolioData guards each array field with `newData.X && {X: ...}`.
    // In JS, `[]` is truthy (only `0, '', null, undefined, NaN, false` are
    // falsy), so an *empty array* passes the truthy check and the spread
    // fires - current data is overwritten with `[]`, not preserved. This
    // differs from the string fields above, where `''` is falsy and IS
    // skipped. A caller must omit these keys (or send `undefined`), not
    // send `[]`, to preserve the current skills/projects/experience/
    // education/certifications.
    const newData: Partial<PortfolioContent> = {
      skills: [],
      projects: [],
      experience: [],
      education: [],
      certifications: [],
    };

    const result = mergePortfolioData(currentFixture, newData);

    expect(result.skills).toEqual([]);
    expect(result.projects).toEqual([]);
    expect(result.experience).toEqual([]);
    expect(result.education).toEqual([]);
    expect(result.certifications).toEqual([]);
  });

  it('overwrites twitter/website even with empty strings, since those two fields are gated by an undefined-check rather than a truthy-check', () => {
    const result = mergePortfolioData(currentFixture, { twitter: '', website: '' });

    expect(result.twitter).toBe('');
    expect(result.website).toBe('');
  });

  it('preserves twitter/website when they are omitted from newData', () => {
    const result = mergePortfolioData(currentFixture, {});

    expect(result.twitter).toBe(currentFixture.twitter);
    expect(result.website).toBe(currentFixture.website);
  });

  it('never lets resume data overwrite theme, stats, testimonials, or custom sections @critical', () => {
    const newData: Partial<PortfolioContent> = {
      theme: {
        primaryColor: '#000000',
        primaryGradient: 'injected-gradient',
        accent: '#000000',
        bg: '#000000',
        mode: 'light',
      },
      stats: [{ number: 999, label: 'Injected Stat', suffix: '' }],
      testimonials: [{ name: 'Injected', role: 'Injected', text: 'Injected testimonial' }],
      customSections: [{ title: 'Injected Section', content: 'Injected content' }],
      boldStatement: 'Injected statement',
      currentWork: 'Injected current work',
      resumeUrl: '/injected.pdf',
      projectsTitle: 'Injected Projects',
      skillsTitle: 'Injected Skills',
      experienceTitle: 'Injected Experience',
      educationTitle: 'Injected Education',
      aboutTitle: 'Injected About',
    };

    const result = mergePortfolioData(currentFixture, newData);

    expect(result.theme).toEqual(currentFixture.theme);
    expect(result.stats).toEqual(currentFixture.stats);
    expect(result.testimonials).toEqual(currentFixture.testimonials);
    expect(result.customSections).toEqual(currentFixture.customSections);
    expect(result.boldStatement).toBe(currentFixture.boldStatement);
    expect(result.currentWork).toBe(currentFixture.currentWork);
    expect(result.resumeUrl).toBe(currentFixture.resumeUrl);
    expect(result.projectsTitle).toBe(currentFixture.projectsTitle);
    expect(result.skillsTitle).toBe(currentFixture.skillsTitle);
    expect(result.experienceTitle).toBe(currentFixture.experienceTitle);
    expect(result.educationTitle).toBe(currentFixture.educationTitle);
    expect(result.aboutTitle).toBe(currentFixture.aboutTitle);

    // None of the injected values should have made it through anywhere.
    expect(result.theme.primaryColor).not.toBe('#000000');
    expect(result.boldStatement).not.toBe('Injected statement');
    expect(JSON.stringify(result)).not.toContain('Injected');
  });
});
