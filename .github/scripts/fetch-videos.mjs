import { writeFileSync } from 'node:fs';

const apiKey = process.env.YT_API_KEY;
const handle = process.env.YT_HANDLE;
const count  = Number(process.env.YT_VIDEO_COUNT || 3);

if (!apiKey) {
  console.error('YT_API_KEY is not set. Add it to repo Settings → Secrets and variables → Actions.');
  process.exit(1);
}

// Step 1 — resolve channel handle to its "uploads" playlist ID.
const chUrl = new URL('https://www.googleapis.com/youtube/v3/channels');
chUrl.searchParams.set('part', 'contentDetails');
chUrl.searchParams.set('forHandle', handle);
chUrl.searchParams.set('key', apiKey);

const chRes = await fetch(chUrl);
if (!chRes.ok) {
  console.error(`YouTube channels.list ${chRes.status}:`, await chRes.text());
  process.exit(1);
}
const chData = await chRes.json();
const uploadsPlaylistId = chData.items?.[0]?.contentDetails?.relatedPlaylists?.uploads;
if (!uploadsPlaylistId) {
  console.error('Uploads playlist not found in channel response:', JSON.stringify(chData));
  process.exit(1);
}

// Step 2 — pull the most recent N items from that playlist (already in reverse-chronological order).
const plUrl = new URL('https://www.googleapis.com/youtube/v3/playlistItems');
plUrl.searchParams.set('part', 'snippet');
plUrl.searchParams.set('playlistId', uploadsPlaylistId);
plUrl.searchParams.set('maxResults', String(count));
plUrl.searchParams.set('key', apiKey);

const plRes = await fetch(plUrl);
if (!plRes.ok) {
  console.error(`YouTube playlistItems.list ${plRes.status}:`, await plRes.text());
  process.exit(1);
}
const plData = await plRes.json();

const videos = (plData.items || []).map(item => ({
  id:          item.snippet.resourceId.videoId,
  title:       item.snippet.title,
  publishedAt: item.snippet.publishedAt,
}));

if (!videos.length) {
  console.error('No videos returned from playlist:', JSON.stringify(plData));
  process.exit(1);
}

const out = {
  videos,
  updatedAt: new Date().toISOString(),
};

writeFileSync('videos.json', JSON.stringify(out, null, 2) + '\n');
console.log('Wrote videos.json:', out);
