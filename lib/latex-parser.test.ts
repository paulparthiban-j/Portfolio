import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import { parseLatexResume, convertToPortfolioContent } from './latex-parser';

describe('parseLatexResume - header parsing', () => {
  it('extracts name, title, location, phone, email, github, and linkedin', () => {
    const tex = String.raw`\begin{center}
{\Large \textbf{Jane Doe}} \\
Senior Engineer \\
\vspace{4pt}
Austin, Texas \textbar{} 5125551234 \textbar{} \href{mailto:jane@example.com}{jane@example.com} \textbar{} \href{https://github.com/janedoe}{github.com/janedoe} \textbar{} \href{https://www.linkedin.com/in/janedoe}{linkedin.com/in/janedoe}
\end{center}`;

    const result = parseLatexResume(tex);

    expect(result.personalInfo.name).toBe('Jane Doe');
    expect(result.personalInfo.title).toBe('Senior Engineer');
    expect(result.personalInfo.location).toBe('Austin, Texas');
    expect(result.personalInfo.phone).toBe('5125551234');
    expect(result.personalInfo.email).toBe('jane@example.com');
    expect(result.personalInfo.github).toBe('https://github.com/janedoe');
    expect(result.personalInfo.linkedin).toBe('https://www.linkedin.com/in/janedoe');
  });
});

describe('cleanLatexText (exercised indirectly via the header title line)', () => {
  it('unescapes \\&, \\%, \\#, \\_, resolves nested \\textbf{\\textit{}}, and keeps only the label of \\href{url}{label}', () => {
    // The header title line (headerLines[1]) is passed to cleanLatexText in
    // full, with no brace-limited regex extracting it first - unlike e.g.
    // the summary section (see the "known parser limitations" describe
    // block below for why that distinction matters), so it's a safe,
    // representative place to exercise cleanLatexText's full behavior.
    const tex = String.raw`\begin{center}
{\Large \textbf{Jane Doe}} \\
Engineer \& Builder \% wizard \#1 fan of snake\_case using \textbf{\textit{nested}} and \href{https://example.com}{a link} \\
\vspace{4pt}
City, Country \textbar{} 5551234567
\end{center}`;

    const result = parseLatexResume(tex);

    expect(result.personalInfo.title).toBe(
      'Engineer & Builder % wizard #1 fan of snake_case using nested and a link'
    );
    expect(result.personalInfo.title).not.toContain('example.com');
    expect(result.personalInfo.title).not.toContain('\\');
    expect(result.personalInfo.title).not.toMatch(/[{}]/);
  });
});

describe('parseLatexResume - skills', () => {
  it('de-duplicates a skill listed under two different categories', () => {
    const tex = String.raw`\section{Technical Skills}
\textbf{Languages:} JavaScript, TypeScript, Python \\
\textbf{Frontend:} React, TypeScript, CSS \\
\section{End}`;

    const result = parseLatexResume(tex);

    expect(result.skills).toEqual(['JavaScript', 'TypeScript', 'Python', 'React', 'CSS']);
    expect(result.skills.filter((s) => s === 'TypeScript')).toHaveLength(1);
  });
});

describe('parseLatexResume - experience', () => {
  it('parses 2+ companies without bleeding position/duration/bullets into each other', () => {
    const tex = String.raw`\section{Experience}

\textbf{Company One} \hfill Location One
Position One \hfill 2020 -- 2021

\resumeItemListStart
\resumeItem{Did task A at company one.}
\resumeItem{Did task B at company one.}
\resumeItemListEnd

\textbf{Company Two} \hfill Location Two
Position Two \hfill 2021 -- 2022

\resumeItemListStart
\resumeItem{Did task A at company two.}
\resumeItemListEnd

\section{End}`;

    const result = parseLatexResume(tex);

    expect(result.experience).toHaveLength(2);

    expect(result.experience[0].company).toBe('Company One');
    expect(result.experience[0].position).toBe('Position One');
    expect(result.experience[0].duration).toBe('2020 -- 2021');
    expect(result.experience[0].description).toContain('Did task A at company one.');
    expect(result.experience[0].description).toContain('Did task B at company one.');
    expect(result.experience[0].description).not.toContain('company two');

    expect(result.experience[1].company).toBe('Company Two');
    expect(result.experience[1].position).toBe('Position Two');
    expect(result.experience[1].duration).toBe('2021 -- 2022');
    expect(result.experience[1].description).toContain('Did task A at company two.');
    expect(result.experience[1].description).not.toContain('company one');
  });
});

describe('parseLatexResume - projects', () => {
  it('parses a project title, tech line, and splits the first bullet as description vs. the rest as impact', () => {
    const tex = String.raw`\section{Projects}
\textbf{Cool App}
\textit{React, Node.js}
\resumeItemListStart
\resumeItem{Built the first thing.}
\resumeItem{Built the second thing.}
\resumeItem{Built the third thing.}
\resumeItemListEnd
\section{End}`;

    const result = parseLatexResume(tex);

    expect(result.projects).toHaveLength(1);
    expect(result.projects[0].title).toBe('Cool App');
    expect(result.projects[0].tech).toBe('React, Node.js');
    expect(result.projects[0].description).toBe('Built the first thing.');
    expect(result.projects[0].impact).toEqual(['Built the second thing.', 'Built the third thing.']);
  });
});

describe('parseLatexResume - education', () => {
  it('extracts GPA when present and omits it when absent', () => {
    const tex = String.raw`\section{Education}
\textbf{Master of Science} — University A \hfill 2020
GPA: 8.0

\textbf{Bachelor of Science} — University B \hfill 2018
\section{End}`;

    const result = parseLatexResume(tex);

    expect(result.education).toHaveLength(2);
    expect(result.education[0]).toEqual({
      degree: 'Master of Science',
      institution: 'University A',
      year: '2020',
      gpa: '8.0',
    });
    expect(result.education[1].gpa).toBeUndefined();
    expect(result.education[1]).toEqual({
      degree: 'Bachelor of Science',
      institution: 'University B',
      year: '2018',
      gpa: undefined,
    });
  });
});

describe('parseLatexResume - certifications', () => {
  it('splits name/issuer/year on the em-dash, and falls back to name-only when no em-dash is present', () => {
    const tex = String.raw`\section{Certifications}
\resumeItemListStart
\resumeItem{AWS Certified Developer — Amazon — 2023}
\resumeItem{Full-Stack Bootcamp Certificate}
\resumeItemListEnd
\section{End}`;

    const result = parseLatexResume(tex);

    expect(result.certifications).toHaveLength(2);
    expect(result.certifications[0]).toEqual({
      name: 'AWS Certified Developer',
      issuer: 'Amazon',
      year: '2023',
    });
    expect(result.certifications[1]).toEqual({
      name: 'Full-Stack Bootcamp Certificate',
      issuer: '',
      year: '',
    });
  });
});

describe('parseLatexResume - no sections present', () => {
  it('returns empty strings/arrays and does not throw when given an empty document', () => {
    expect(() => parseLatexResume('')).not.toThrow();

    const result = parseLatexResume('');

    expect(result.personalInfo).toEqual({
      name: '',
      title: '',
      email: '',
      phone: '',
      location: '',
      github: '',
      linkedin: '',
    });
    expect(result.summary).toBe('');
    expect(result.skills).toEqual([]);
    expect(result.experience).toEqual([]);
    expect(result.projects).toEqual([]);
    expect(result.education).toEqual([]);
    expect(result.certifications).toEqual([]);
  });
});

describe('regression: escaped \\% no longer truncates the rest of the line', () => {
  // lib/latex-parser.ts previously stripped LaTeX comments with /%.*$/gm,
  // which also matched an *escaped* \% (a literal percent sign in LaTeX),
  // deleting the remainder of that line. It's now /(?<!\\)%.*$/gm, so an
  // escaped % is no longer treated as a comment. These two tests pin that
  // fix using the exact kind of content that originally exposed the bug
  // (see ai-native-resume.tex, and the golden-fixture test below).

  it('does not truncate the Summary at an escaped 40\\%, and unescapes it to 40%', () => {
    const tex = String.raw`\section{Summary}
\small{
Improved workflows (40\% efficiency improvement) across teams.
}`;

    const result = parseLatexResume(tex);

    expect(result.summary).not.toMatch(/\(40\s*$/);
    expect(result.summary).toContain('40%');
    expect(result.summary).toBe('Improved workflows (40% efficiency improvement) across teams.');
  });

  it('does not drop an Experience bullet containing an escaped 40\\% (which previously lost its closing brace)', () => {
    const tex = String.raw`\section{Experience}

\textbf{Acme Corp} \hfill Remote

Engineer \hfill 2020 -- 2022

\resumeItemListStart
\resumeItem{Improved deployment speed by 40\% across all teams.}
\resumeItemListEnd

\section{End}`;

    const result = parseLatexResume(tex);

    expect(result.experience).toHaveLength(1);
    expect(result.experience[0].description).toBe('Improved deployment speed by 40% across all teams.');
  });
});

describe('convertToPortfolioContent', () => {
  it('maps parsed resume data onto the Partial<PortfolioContent> shape', () => {
    const tex = String.raw`\begin{center}
{\Large \textbf{Sam Rivera}} \\
Product Engineer \\
\vspace{4pt}
Denver, Colorado \textbar{} 3035551212 \textbar{} \href{mailto:sam@example.com}{sam@example.com} \textbar{} \href{https://github.com/samrivera}{github.com/samrivera} \textbar{} \href{https://www.linkedin.com/in/samrivera}{linkedin.com/in/samrivera}
\end{center}

\section{Summary}
\small{
Builds delightful products end to end.
}`;

    const parsed = parseLatexResume(tex);
    const portfolio = convertToPortfolioContent(parsed);

    expect(portfolio.name).toBe('Sam Rivera');
    expect(portfolio.title).toBe('Product Engineer');
    expect(portfolio.subtitle).toBe('');
    expect(portfolio.description).toBe('Builds delightful products end to end.');
    expect(portfolio.email).toBe('sam@example.com');
    expect(portfolio.phone).toBe('3035551212');
    expect(portfolio.location).toBe('Denver, Colorado');
    expect(portfolio.github).toBe('https://github.com/samrivera');
    expect(portfolio.linkedin).toBe('https://www.linkedin.com/in/samrivera');
    expect(portfolio.skills).toEqual([]);
    expect(portfolio.experience).toEqual([]);
    expect(portfolio.projects).toEqual([]);
    expect(portfolio.education).toEqual([]);
    expect(portfolio.certifications).toEqual([]);
  });
});

describe('golden fixture: ai-native-resume.tex (the real file that exposed the comment-stripping bug)', () => {
  const fixturePath = path.join(process.cwd(), 'ai-native-resume.tex');
  const latexContent = fs.readFileSync(fixturePath, 'utf-8');
  const parsedData = parseLatexResume(latexContent);
  const portfolio = convertToPortfolioContent(parsedData);

  it('extracts a non-empty name and title', () => {
    expect(portfolio.name).toBeTruthy();
    expect(portfolio.title).toBeTruthy();
  });

  it('parses the Summary in full, without truncating at the escaped 40%', () => {
    expect(portfolio.description).toContain('40%');
    // This text comes well after the "(40\% efficiency improvement)" clause
    // in the source paragraph - its presence proves the parse continued to
    // the end of the paragraph instead of stopping at the percent sign.
    expect(portfolio.description).toContain('handled high-volume transactions (1K+ daily)');
    expect(portfolio.description).toContain('production troubleshooting');
  });

  it('keeps the P2P project bullets containing 40% and 25% present and intact', () => {
    // Note: these percentage bullets live under the "P2P" entry in the
    // Projects section of the real file, not under Experience.
    const p2p = portfolio.projects?.find((p) => p.title.includes('P2P'));
    expect(p2p).toBeTruthy();

    expect(p2p!.impact).toContain(
      'Automated purchase workflows (SIR/SOR, GRN, invoicing), reducing manual processing time by 40% through workflow optimization.'
    );
    expect(p2p!.impact).toContain(
      'Developed real-time inventory tracking and supplier management improving data accuracy by 25% with optimized database operations.'
    );
  });

  it('parses all project entries, with no duplicates', () => {
    // The source .tex file used to have the "Personal Portfolio Website"
    // block twice (a data issue in the file, not a parser bug - the parser
    // still has no de-duplication logic). That duplicate has since been
    // removed from ai-native-resume.tex, so this now just confirms a clean
    // one-entry-per-project parse.
    expect(portfolio.projects).toHaveLength(7);
    const portfolioSiteEntries = portfolio.projects?.filter((p) => p.title === 'Personal Portfolio Website');
    expect(portfolioSiteEntries).toHaveLength(1);
  });

  it('parses certifications even though Certifications is the last section with no following \\section @critical', () => {
    // Regression test: parseCertifications' section-boundary regex used to
    // require a literal trailing "\section" to close its capture. Since
    // Certifications is the last section before \end{document} in this real
    // resume, nothing followed it, the regex never matched, and both real
    // certifications were silently dropped. The boundary regex now also
    // accepts \end{document} or end-of-string as a valid closing point.
    expect(portfolio.certifications).toEqual([
      { name: 'Full-Stack Development Internship', issuer: 'AK Infopark', year: '' },
      { name: 'NPTEL', issuer: 'Python for Data Science and Programming in Java', year: '' },
    ]);
  });
});

describe('parser bugs found while writing this suite, fixed alongside the comment-stripping bug', () => {
  it('cleanLatexText: a trailing LaTeX line-break backslash (\\\\) no longer corrupts into a literal backslash-dollar', () => {
    // Regression test: cleanLatexText used to contain .replace(/\\$/g, '$').
    // The intent (matching the \&, \%, \#, \_ rules right above it) was to
    // unescape a literal LaTeX `\$` into `$`. But `$` in a regex (unescaped)
    // means "end of string", not a literal dollar sign - so this rule
    // actually matched "a backslash at the very end of the string" and
    // replaced it with '$'. Any cleaned text ending in the LaTeX line-break
    // marker \\ (extremely common - e.g. the last skill in a Technical
    // Skills category line, or an education year) lost its backslash and
    // gained a stray literal '$'. Now fixed to /\\\$/g, which only matches
    // an actually-escaped dollar sign.
    const tex = String.raw`\section{Technical Skills}
\textbf{Languages:} JavaScript, TypeScript \\
\section{End}`;

    const result = parseLatexResume(tex);

    expect(result.skills).toEqual(['JavaScript', 'TypeScript']);
  });

  it('a \\resumeItem bullet containing a nested braced command is no longer truncated at the nested closing brace @critical', () => {
    // Regression test: the bullet regex /\\resumeItem\{([^}]+)\}/ used to use
    // [^}]+, which stops at the FIRST '}' - including one belonging to a
    // nested command like \textbf{...} inside the bullet, silently dropping
    // everything after it. This affected most bullets in the real resume
    // that bold a key term mid-sentence. Now greedy (.+), so it captures
    // through to the LAST '}' on the line instead.
    const tex = String.raw`\section{Experience}

\textbf{Acme Corp} \hfill Remote
Engineer \hfill 2020 -- 2022

\resumeItemListStart
\resumeItem{Improved throughput using \textbf{Redis} and cut latency by half.}
\resumeItemListEnd

\section{End}`;

    const result = parseLatexResume(tex);

    expect(result.experience[0].description).toBe('Improved throughput using Redis and cut latency by half.');
  });
});
