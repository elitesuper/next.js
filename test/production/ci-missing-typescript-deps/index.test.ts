import { createNext } from 'e2e-utils'

describe('ci-missing-typescript-deps', () => {
  it('should show missing TypeScript dependencies error in CI', async () => {
    const next = await createNext({
      files: {
        'pages/index.tsx': `
          export default function Page() {
            return <p>hello world</p>
          }
        `,
      },
      env: {
        CI: '1',
      },
      skipStart: true,
      dependencies: {
        typescript: undefined,
      },
    })
    try {
      let error
      await next.start().catch((err) => {
        error = err
      })

      expect(error).toBeDefined()
      expect(next.cliOutput).toContain(
        `It looks like you're trying to use TypeScript but do not have the required package(s) installed.`
      )
      expect(next.cliOutput).toContain(`Please install`)
      expect(next.cliOutput).not.toContain('Call retries were exceeded')
      expect(next.cliOutput).not.toContain('WorkerError')
    } finally {
      await next.destroy()
    }
  })

  it('should not throw an error if beta version of @types/react and @types/react-dom is installed', async () => {
    const next = await createNext({
      files: {
        'pages/index.tsx': `
          export default function Page() {
            return <p>hello world</p>
          }
        `,
      },
      env: {
        CI: '1',
      },
      skipStart: true,
      dependencies: {
        '@types/react': 'npm:types-react@beta',
        '@types/react-dom': 'npm:types-react-dom@beta',
      },
      packageJson: {
        overrides: {
          '@types/react': 'npm:types-react@beta',
          '@types/react-dom': 'npm:types-react-dom@beta',
        },
        pnpm: {
          overrides: {
            '@types/react': 'npm:types-react@beta',
            '@types/react-dom': 'npm:types-react-dom@beta',
          },
        },
      },
    })
    try {
      const nextBuild = await next.build()
      // build doesn't fail because types/ may not be installed.
      expect(nextBuild.cliOutput.split('\n')).toEqual(
        expect.arrayContaining([
          'This may be a bug in Next.js. Please file an issue.',
          'Make sure the following type packages are installed:',
          // In cyan color but this changes between CI and local.
          // TODO: Use picocolors in tests to ensure we can test local and CI.
          expect.stringContaining('@types/react'),
        ])
      )
    } finally {
      await next.destroy()
    }
  })
})
