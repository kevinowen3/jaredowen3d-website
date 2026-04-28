import { writeFileSync } from 'node:fs';

const apiKey = process.env.YT_API_KEY;
const handle = process.env.YT_HANDLE;

if (!apiKey) {
  console.error('YT_API_KEY is not set. Add it to repo Settings → Secrets and variables → Actions.');
  process.exit(1);
}

const url = new URL('https://www.googleapis.com/youtube/v3/channels');
url.searchParams.set('part', 'statistics,snippet');
url.searchParams.set('forHandle', handle);
url.searchParams.set('key', apiKey);

const res = await fetch(url);
if (!res.ok) {
  console.error(`YouTube API ${res.status}:`, await res.text());
  process.exit(1);
}

const data = await res.json();
const ch = data.items?.[0];
if (!ch) {
  console.error('Channel not found in API response:', JSON.stringify(data));
  process.exit(1);
}

const out = {
  subscribers: Number(ch.statistics.subscriberCount),
  views:       Number(ch.statistics.viewCount),
  videos:      Number(ch.statistics.videoCount),
  channelStartedAt: ch.snippet.publishedAt,
  updatedAt:        new Date().toISOString(),
};

writeFileSync('stats.json', JSON.stringify(out, null, 2) + '\n');
console.log('Wrote stats.json:', out);
