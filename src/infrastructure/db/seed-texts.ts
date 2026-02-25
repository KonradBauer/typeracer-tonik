import { getPayload } from 'payload'
import config from '@payload-config'

const passages = [
  {
    content:
      'The quick brown fox jumps over the lazy dog. This sentence contains every letter of the alphabet and has been used for typing practice for decades.',
    source: 'Traditional typing exercise',
    author: 'Unknown',
    difficulty: 'easy' as const,
  },
  {
    content:
      'To be or not to be, that is the question. Whether it is nobler in the mind to suffer the slings and arrows of outrageous fortune, or to take arms against a sea of troubles.',
    source: 'Hamlet',
    author: 'William Shakespeare',
    difficulty: 'easy' as const,
  },
  {
    content:
      'It was the best of times, it was the worst of times, it was the age of wisdom, it was the age of foolishness, it was the epoch of belief, it was the epoch of incredulity.',
    source: 'A Tale of Two Cities',
    author: 'Charles Dickens',
    difficulty: 'medium' as const,
  },
  {
    content:
      'In the beginning the Universe was created. This has made a lot of people very angry and been widely regarded as a bad move. Many were increasingly of the opinion that they had all made a big mistake.',
    source: 'The Restaurant at the End of the Universe',
    author: 'Douglas Adams',
    difficulty: 'medium' as const,
  },
  {
    content:
      'Any sufficiently advanced technology is indistinguishable from magic. The only way of discovering the limits of the possible is to venture a little way past them into the impossible.',
    source: 'Profiles of the Future',
    author: 'Arthur C. Clarke',
    difficulty: 'medium' as const,
  },
  {
    content:
      'I have not failed. I have just found ten thousand ways that will not work. Many of life\'s failures are people who did not realize how close they were to success when they gave up.',
    source: 'Interview',
    author: 'Thomas Edison',
    difficulty: 'medium' as const,
  },
  {
    content:
      'The most merciful thing in the world, I think, is the inability of the human mind to correlate all its contents. We live on a placid island of ignorance in the midst of black seas of infinity.',
    source: 'The Call of Cthulhu',
    author: 'H.P. Lovecraft',
    difficulty: 'hard' as const,
  },
  {
    content:
      'It is a truth universally acknowledged, that a single man in possession of a good fortune, must be in want of a wife. However little known the feelings or views of such a man may be on his first entering a neighbourhood.',
    source: 'Pride and Prejudice',
    author: 'Jane Austen',
    difficulty: 'hard' as const,
  },
  {
    content:
      'Far out in the uncharted backwaters of the unfashionable end of the western spiral arm of the Galaxy lies a small unregarded yellow sun. Orbiting this at a distance of roughly ninety-two million miles is an utterly insignificant little blue green planet.',
    source: 'The Hitchhiker\'s Guide to the Galaxy',
    author: 'Douglas Adams',
    difficulty: 'hard' as const,
  },
  {
    content:
      'The only way to do great work is to love what you do. If you have not found it yet, keep looking. Do not settle. As with all matters of the heart, you will know when you find it.',
    source: 'Stanford Commencement Address',
    author: 'Steve Jobs',
    difficulty: 'easy' as const,
  },
]

export async function seedTexts() {
  const payload = await getPayload({ config })

  const existing = await payload.find({ collection: 'texts', limit: 1 })
  if (existing.docs.length > 0) {
    console.log('Texts already seeded, skipping.')
    return
  }

  for (const passage of passages) {
    await payload.create({
      collection: 'texts',
      data: {
        content: passage.content,
        source: passage.source,
        author: passage.author,
        difficulty: passage.difficulty,
        language: 'en',
      },
    })
  }

  console.log(`Seeded ${passages.length} text passages.`)
}
