import 'dotenv/config'
import { seedTexts } from '../src/infrastructure/db/seed-texts'

async function main() {
  console.log('Seeding database...')
  await seedTexts()
  console.log('Done.')
  process.exit(0)
}

main().catch((err) => {
  console.error('Seed failed:', err)
  process.exit(1)
})
