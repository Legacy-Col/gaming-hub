// check-files.js
// Run this from the ROOT of your gaming-hub project folder (same level as package.json):
//   node check-files.js
//
// It just checks whether each file we've built together actually exists on disk —
// it doesn't check the contents, just presence. Anything marked MISSING is why
// Vercel's build is failing (or will fail once you push).

const fs = require('fs')
const path = require('path')

const expectedFiles = [
  // ── Articles ──
  'src/hooks/useArticles.ts',
  'src/hooks/useArticle.ts',
  'src/hooks/useArticleEditor.ts',
  'src/components/editor/RichTextEditor.tsx',
  'src/components/articles/ArticleCard.tsx',
  'src/pages/ArticlesPage.tsx',
  'src/pages/ArticleDetailPage.tsx',
  'src/pages/ArticleEditorPage.tsx',

  // ── Admin: dashboard + tournaments + store + teams ──
  'src/pages/admin/AdminDashboardPage.tsx',
  'src/pages/admin/AdminTournamentsPage.tsx',
  'src/pages/admin/AdminTournamentEditorPage.tsx',
  'src/pages/admin/AdminStorePage.tsx',
  'src/pages/admin/AdminStoreEditorPage.tsx',
  'src/pages/admin/AdminTeamsPage.tsx',
  'src/hooks/useTournamentAdmin.ts',
  'src/hooks/useStoreAdmin.ts',
  'src/hooks/useTeamAdmin.ts',

  // ── Auth / Google sign-in ──
  'src/lib/authStorage.ts',

  // ── Earlier: landing page additions ──
  'src/components/Brands.tsx',
  'src/components/Countries.tsx',
  'src/components/AboutIntro.tsx',
  'src/pages/AboutPage.tsx',
]

console.log('Checking for expected files...\n')

let missing = []

for (const file of expectedFiles) {
  const fullPath = path.join(process.cwd(), file)
  const exists = fs.existsSync(fullPath)
  console.log(`${exists ? '✅' : '❌ MISSING'}  ${file}`)
  if (!exists) missing.push(file)
}

console.log('\n----------------------------------------')
if (missing.length === 0) {
  console.log('All expected files are present.')
} else {
  console.log(`${missing.length} file(s) missing:\n`)
  missing.forEach(f => console.log(`  - ${f}`))
  console.log('\nThese are the files you need to (re-)create before your next push.')
}