import { writeFileSync } from 'node:fs';

const apiKey = process.env.YT_API_KEY;
const handle = process.env.YT_HANDLE;
const count  = Number(process.env.YT_VIDEO_COUNT || 3);

// Drop anything <= 180s — YouTube's current Shorts cap. Jared's animations are
// all multi-minute long-form, so this filter never risks dropping real content.
const SHORTS_MAX_SECONDS = 180;

// Fetch a wider pool than we need so the Shorts filter has headroom. 20 covers
// a channel that interleaves several Shorts between long-form uploads.
const POOL_SIZE = 20;

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

// Step 2 — pull the most recent POOL_SIZE items from that playlist (already in reverse-chronological order).
const plUrl = new URL('https://www.googleapis.com/youtube/v3/playlistItems');
plUrl.searchParams.set('part', 'snippet');
plUrl.searchParams.set('playlistId', uploadsPlaylistId);
plUrl.searchParams.set('maxResults', String(POOL_SIZE));
plUrl.searchParams.set('key', apiKey);

const plRes = await fetch(plUrl);
if (!plRes.ok) {
  console.error(`YouTube playlistItems.list ${plRes.status}:`, await plRes.text());
  process.exit(1);
}
const plData = await plRes.json();
const candidates = (plData.items || []).map(item => ({
  id:          item.snippet.resourceId.videoId,
  title:       item.snippet.title,
  publishedAt: item.snippet.publishedAt,
}));

if (!candidates.length) {
  console.error('No videos returned from playlist:', JSON.stringify(plData));
  process.exit(1);
}

// Step 3 — batch-fetch durations for the candidate pool so we can filter Shorts.
const vUrl = new URL('https://www.googleapis.com/youtube/v3/videos');
vUrl.searchParams.set('part', 'contentDetails');
vUrl.searchParams.set('id', candidates.map(c => c.id).join(','));
vUrl.searchParams.set('key', apiKey);

const vRes = await fetch(vUrl);
if (!vRes.ok) {
  console.error(`YouTube videos.list ${vRes.status}:`, await vRes.text());
  process.exit(1);
}
const vData = await vRes.json();
const durationById = new Map(
  (vData.items || []).map(item => [item.id, parseIsoDuration(item.contentDetails.duration)])
);

// Drop Shorts and anything we couldn't get a duration for, then take the top N.
const videos = candidates
  .filter(c => {
    const seconds = durationById.get(c.id);
    if (seconds == null) {
      console.warn(`No duration for ${c.id} — dropping from results.`);
      return false;
    }
    if (seconds <= SHORTS_MAX_SECONDS) {
      console.log(`Filtered Short: ${c.id} (${seconds}s) — "${c.title}"`);
      return false;
    }
    return true;
  })
  .slice(0, count);

if (videos.length < count) {
  console.warn(`Only ${videos.length}/${count} long-form videos found in the most recent ${POOL_SIZE} uploads.`);
}
if (!videos.length) {
  console.error('No long-form videos in the candidate pool — refusing to write empty videos.json.');
  process.exit(1);
}

const out = {
  videos,
  updatedAt: new Date().toISOString(),
};

writeFileSync('videos.json', JSON.stringify(out, null, 2) + '\n');
console.log('Wrote videos.json:', out);

// ISO 8601 duration → seconds. YouTube's API always emits the PT...H...M...S form.
function parseIsoDuration(iso) {
  const m = /^PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/.exec(iso || '');
  if (!m) return null;
  const [, h, min, s] = m;
  return (Number(h) || 0) * 3600 + (Number(min) || 0) * 60 + (Number(s) || 0);
}
