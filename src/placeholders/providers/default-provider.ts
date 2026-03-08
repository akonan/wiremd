import type { PlaceholderToken } from '../../types.js';

export type RandomFn = () => number;

interface DefaultPlaceholderProviderOptions {
  random: RandomFn;
  now: Date;
}

interface UserProfile {
  name: string;
  email: string;
}

const FIRST_NAMES = [
  'Alex',
  'Jordan',
  'Taylor',
  'Morgan',
  'Casey',
  'Avery',
  'Riley',
  'Cameron',
  'Jamie',
  'Parker',
  'Harper',
  'Quinn',
  'Drew',
  'Rowan',
];

const LAST_NAMES = [
  'Johnson',
  'Smith',
  'Brown',
  'Williams',
  'Davis',
  'Miller',
  'Anderson',
  'Wilson',
  'Thomas',
  'Moore',
  'Martin',
  'Clark',
  'Hall',
  'Lewis',
];

const EMAIL_DOMAINS = [
  'example.com',
  'acme.test',
  'demo.app',
  'wiremd.dev',
];

const LOREM_WORDS = [
  'lorem',
  'ipsum',
  'dolor',
  'sit',
  'amet',
  'consectetur',
  'adipiscing',
  'elit',
  'sed',
  'do',
  'eiusmod',
  'tempor',
  'incididunt',
  'ut',
  'labore',
  'et',
  'dolore',
  'magna',
  'aliqua',
  'enim',
  'minim',
  'veniam',
  'quis',
  'nostrud',
  'exercitation',
  'ullamco',
  'laboris',
  'nisi',
  'aliquip',
  'commodo',
  'consequat',
  'duis',
  'aute',
  'irure',
  'in',
  'reprehenderit',
  'voluptate',
  'velit',
  'esse',
  'cillum',
  'fugiat',
  'nulla',
  'pariatur',
  'excepteur',
  'sint',
  'occaecat',
  'cupidatat',
  'non',
  'proident',
  'sunt',
  'culpa',
  'officia',
  'deserunt',
  'mollit',
  'anim',
  'id',
  'est',
  'laborum',
];

export class DefaultPlaceholderProvider {
  private readonly random: RandomFn;
  private readonly now: Date;
  private cachedUser: UserProfile | null;

  constructor(options: DefaultPlaceholderProviderOptions) {
    this.random = options.random;
    this.now = new Date(options.now);
    this.cachedUser = null;
  }

  resolve(token: PlaceholderToken): string {
    switch (token.kind) {
      case 'user.name':
        return this.getUser().name;

      case 'user.email':
        return this.getUser().email;

      case 'lorem':
        return this.generateLorem(token.paragraphs);

      case 'image':
        return `https://placehold.co/${token.width}x${token.height}?text=Placeholder`;

      case 'date':
        return this.generateDate();

      case 'number':
        return String(randomInt(this.random, token.min, token.max));
    }
  }

  private getUser(): UserProfile {
    if (this.cachedUser) {
      return this.cachedUser;
    }

    const firstName = pick(this.random, FIRST_NAMES);
    const lastName = pick(this.random, LAST_NAMES);
    const name = `${firstName} ${lastName}`;
    const domain = pick(this.random, EMAIL_DOMAINS);
    const email = `${slugify(firstName)}.${slugify(lastName)}@${domain}`;

    this.cachedUser = { name, email };
    return this.cachedUser;
  }

  private generateLorem(paragraphs: number): string {
    const output: string[] = [];

    for (let paragraphIndex = 0; paragraphIndex < paragraphs; paragraphIndex++) {
      const sentenceCount = randomInt(this.random, 3, 5);
      const sentences: string[] = [];

      for (let sentenceIndex = 0; sentenceIndex < sentenceCount; sentenceIndex++) {
        const wordCount = randomInt(this.random, 8, 14);
        const words: string[] = [];

        for (let wordIndex = 0; wordIndex < wordCount; wordIndex++) {
          words.push(pick(this.random, LOREM_WORDS));
        }

        const sentence = `${capitalize(words.join(' '))}.`;
        sentences.push(sentence);
      }

      output.push(sentences.join(' '));
    }

    return output.join('\n\n');
  }

  private generateDate(): string {
    const baseDateUtc = Date.UTC(
      this.now.getUTCFullYear(),
      this.now.getUTCMonth(),
      this.now.getUTCDate()
    );
    const dayOffset = randomInt(this.random, -365, 365);
    const generatedDate = new Date(baseDateUtc + dayOffset * 24 * 60 * 60 * 1000);

    return generatedDate.toISOString().slice(0, 10);
  }
}

function pick<T>(random: RandomFn, items: readonly T[]): T {
  const index = randomInt(random, 0, items.length - 1);
  return items[index];
}

function randomInt(random: RandomFn, min: number, max: number): number {
  if (max <= min) {
    return min;
  }

  return Math.floor(random() * (max - min + 1)) + min;
}

function slugify(input: string): string {
  return input.toLowerCase().replace(/[^a-z0-9]+/g, '.').replace(/^\.+|\.+$/g, '');
}

function capitalize(input: string): string {
  if (!input) {
    return input;
  }

  return input[0].toUpperCase() + input.slice(1);
}
