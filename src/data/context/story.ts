/** Small illustrative fixtures for a general-purpose coding agent, not one project story. */
export const story = {
  file: 'src/utils.ts',
  skillFile: '.agents/skills/fix-bug/SKILL.md',
  testFile: 'utils.test.ts',
  testCommand: 'npm test -- utils.test.ts',
  staleTestCommand: 'npm run test:old',
  originalCode: 'return items.length;',
  fixedCode: 'return items?.length ?? 0;',
  passedTests: 12,
  inventedFile: 'project-helper.ts',
  privateFile: '/private/secrets.env',
} as const;
