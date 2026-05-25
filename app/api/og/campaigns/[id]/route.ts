import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import * as fs from 'fs';
import * as path from 'path';

// Helper to fetch image from URL and return as Buffer
async function fetchImageBuffer(imageUrl: string | null): Promise<Buffer | null> {
  if (!imageUrl) return null;

  try {
    const response = await fetch(imageUrl);
    if (!response.ok) return null;
    return Buffer.from(await response.arrayBuffer());
  } catch (err) {
    console.error('Error fetching image:', err);
    return null;
  }
}

// GET /api/og/campaigns/[id] - Serve OGP image (cached or generated on demand)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const resolvedParams = await params;
  try {
    const campaignId = parseInt(resolvedParams.id);

    // Check if cached image exists
    const ogpFileName = `campaign-${campaignId}-award.png`;
    const ogpFilePath = path.join(process.cwd(), 'public', 'ogp', 'campaigns', ogpFileName);

    if (fs.existsSync(ogpFilePath)) {
      const imageBuffer = fs.readFileSync(ogpFilePath);
      return new NextResponse(imageBuffer, {
        headers: {
          'Content-Type': 'image/png',
          'Cache-Control': 'public, max-age=86400', // Cache for 24 hours
        },
      });
    }

    // If no cached image, generate on demand
    // Fetch campaign and award data
    const { data: campaign } = await supabase
      .from('campaigns')
      .select('id, title, awarded_submission_id, theme_proposer_comment, theme_id')
      .eq('id', campaignId)
      .single();

    if (!campaign || !campaign.awarded_submission_id) {
      return new NextResponse('Campaign award not found', { status: 404 });
    }

    // Fetch theme data
    const { data: theme } = await supabase
      .from('campaign_themes')
      .select('id, title, submitted_by')
      .eq('id', campaign.theme_id)
      .single();

    // Fetch submission and track data
    const { data: submission } = await supabase
      .from('campaign_submissions')
      .select('track_id')
      .eq('id', campaign.awarded_submission_id)
      .single();

    if (!submission) {
      return new NextResponse('Submission not found', { status: 404 });
    }

    // Fetch track data
    const { data: track } = await supabase
      .from('tracks')
      .select('title, artist_name, photo_url')
      .eq('id', submission.track_id)
      .single();

    // Fetch proposer profile
    const { data: proposerProfile } = await supabase
      .from('profiles')
      .select('username, avatar_url')
      .eq('id', theme?.submitted_by || '')
      .single();

    // Generate image using sharp
    const sharp = require('sharp');

    const width = 1200;
    const height = 630;

    // Create base gradient using SVG
    const backgroundSvgBuffer = Buffer.from(`
      <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#ec4899;stop-opacity:1" />
            <stop offset="50%" style="stop-color:#a855f7;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#3b82f6;stop-opacity:1" />
          </linearGradient>
        </defs>
        <rect width="${width}" height="${height}" fill="url(#grad)"/>
      </svg>
    `);

    let imageBuffer = await sharp(backgroundSvgBuffer, { density: 200 }).png().toBuffer();
    let composites: Array<any> = [];

    // Add thumbnail
    if (track?.photo_url) {
      const thumbnailBuffer = await fetchImageBuffer(track.photo_url);
      if (thumbnailBuffer) {
        try {
          const resizedThumbnail = await sharp(thumbnailBuffer)
            .resize(250, 250, { fit: 'cover' })
            .png()
            .toBuffer();

          composites.push({
            input: resizedThumbnail,
            top: 150,
            left: Math.floor((width - 250) / 2),
          });
        } catch (err) {
          console.warn('Error processing thumbnail:', err);
        }
      }
    }

    if (composites.length > 0) {
      imageBuffer = await sharp(imageBuffer)
        .composite(composites)
        .png()
        .toBuffer();
    }

    // Add text overlay
    const textSvgBuffer = Buffer.from(`
      <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="2" dy="2" stdDeviation="3" flood-opacity="0.3"/>
          </filter>
        </defs>

        <rect x="0" y="0" width="${width}" height="120" fill="rgba(0,0,0,0.3)"/>
        <text x="${width / 2}" y="60"
          font-family="Arial, sans-serif" font-size="48" font-weight="bold"
          fill="white" text-anchor="middle" filter="url(#shadow)">
          ${escapeXml(campaign.title)}
        </text>

        <rect x="0" y="${height - 100}" width="${width}" height="100" fill="rgba(0,0,0,0.4)"/>
        <text x="30" y="${height - 70}"
          font-family="Arial, sans-serif" font-size="16"
          fill="rgba(255,255,255,0.8)" filter="url(#shadow)">
          応援ソング提案者
        </text>
        <text x="30" y="${height - 30}"
          font-family="Arial, sans-serif" font-size="28" font-weight="bold"
          fill="white" filter="url(#shadow)">
          ${escapeXml(proposerProfile?.username || theme?.submitted_by?.substring(0, 8) || 'Anonymous')}
        </text>
        <text x="${width - 40}" y="${height - 20}"
          font-family="Arial, sans-serif" font-size="14"
          fill="rgba(255,255,255,0.8)" text-anchor="end" filter="url(#shadow)">
          REVOSONG
        </text>
      </svg>
    `);

    imageBuffer = await sharp(imageBuffer)
      .composite([
        {
          input: textSvgBuffer,
          top: 0,
          left: 0,
        }
      ])
      .png()
      .toBuffer();

    // Try to save for caching
    try {
      const ogpDir = path.join(process.cwd(), 'public', 'ogp', 'campaigns');
      if (!fs.existsSync(ogpDir)) {
        fs.mkdirSync(ogpDir, { recursive: true });
      }
      fs.writeFileSync(ogpFilePath, imageBuffer);
    } catch (writeErr) {
      console.warn('Could not cache OGP image:', writeErr);
    }

    return new NextResponse(imageBuffer, {
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'public, max-age=86400',
      },
    });
  } catch (err) {
    console.error('Error generating OGP image:', err);
    return new NextResponse('Error generating image', { status: 500 });
  }
}

function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
    .substring(0, 100);
}
