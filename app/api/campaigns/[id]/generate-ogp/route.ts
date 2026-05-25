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

// Helper to get user profile for theme proposer
async function getUserProfile(userId: string): Promise<{ username: string; avatar_url: string | null } | null> {
  const { data } = await supabase
    .from('profiles')
    .select('username, avatar_url')
    .eq('id', userId)
    .single();

  return data;
}

// POST /api/campaigns/[id]/generate-ogp - Generate OGP image for campaign award
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const resolvedParams = await params;
  try {
    const campaignId = parseInt(resolvedParams.id);
    const body = await request.json();
    const { submission_id } = body;

    if (!submission_id) {
      return NextResponse.json(
        { error: 'Submission ID is required' },
        { status: 400 }
      );
    }

    // Fetch campaign and award data
    const { data: campaign } = await supabase
      .from('campaigns')
      .select('id, title, awarded_submission_id, theme_proposer_comment, theme_id')
      .eq('id', campaignId)
      .single();

    if (!campaign || campaign.awarded_submission_id !== submission_id) {
      return NextResponse.json(
        { error: 'Award not found' },
        { status: 404 }
      );
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
      .eq('id', submission_id)
      .single();

    if (!submission) {
      return NextResponse.json(
        { error: 'Submission not found' },
        { status: 404 }
      );
    }

    // Fetch track data
    const { data: track } = await supabase
      .from('tracks')
      .select('title, artist_name, photo_url, external_url')
      .eq('id', submission.track_id)
      .single();

    // Fetch theme proposer profile
    const proposerProfile = await getUserProfile(theme?.submitted_by || '');

    // Generate OGP image using sharp
    try {
      const sharp = require('sharp');

      // Image dimensions (standard OG image size)
      const width = 1200;
      const height = 630;

      // Create base image with solid color, then apply gradient via SVG overlay
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

      // Start with gradient background using SVG
      let imageBuffer = await sharp(backgroundSvgBuffer, { density: 200 }).png().toBuffer();
      let composites: Array<any> = [];

      // Add track thumbnail if available
      if (track?.photo_url) {
        const thumbnailBuffer = await fetchImageBuffer(track.photo_url);
        if (thumbnailBuffer) {
          try {
            // Resize thumbnail
            const resizedThumbnail = await sharp(thumbnailBuffer)
              .resize(250, 250, { fit: 'cover' })
              .png()
              .toBuffer();

            // Center horizontally, position vertically
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

      // Composite thumbnail onto background
      if (composites.length > 0) {
        imageBuffer = await sharp(imageBuffer)
          .composite(composites)
          .png()
          .toBuffer();
      }

      // Add text overlay (title and proposer)
      const textSvgBuffer = Buffer.from(`
        <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
              <feDropShadow dx="2" dy="2" stdDeviation="3" flood-opacity="0.3"/>
            </filter>
          </defs>

          <!-- Top title section -->
          <rect x="0" y="0" width="${width}" height="120" fill="rgba(0,0,0,0.3)"/>

          <!-- Campaign title -->
          <text x="${width / 2}" y="60"
            font-family="Arial, sans-serif" font-size="48" font-weight="bold"
            fill="white" text-anchor="middle" filter="url(#shadow)">
            ${escapeXml(campaign.title)}
          </text>

          <!-- Bottom proposer section -->
          <rect x="0" y="${height - 100}" width="${width}" height="100" fill="rgba(0,0,0,0.4)"/>

          <!-- Proposer label -->
          <text x="30" y="${height - 70}"
            font-family="Arial, sans-serif" font-size="16"
            fill="rgba(255,255,255,0.8)" filter="url(#shadow)">
            応援ソング提案者
          </text>

          <!-- Proposer name -->
          <text x="30" y="${height - 30}"
            font-family="Arial, sans-serif" font-size="28" font-weight="bold"
            fill="white" filter="url(#shadow)">
            ${escapeXml(proposerProfile?.username || theme?.submitted_by?.substring(0, 8) || 'Anonymous')}
          </text>

          <!-- REVOSONG badge -->
          <text x="${width - 40}" y="${height - 20}"
            font-family="Arial, sans-serif" font-size="14"
            fill="rgba(255,255,255,0.8)" text-anchor="end" filter="url(#shadow)">
            REVOSONG
          </text>
        </svg>
      `);

      // Composite text layer
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

      // Ensure directory exists
      const ogpDir = path.join(process.cwd(), 'public', 'ogp', 'campaigns');
      if (!fs.existsSync(ogpDir)) {
        fs.mkdirSync(ogpDir, { recursive: true });
      }

      // Save image file
      const ogpFileName = `campaign-${campaignId}-award.png`;
      const ogpFilePath = path.join(ogpDir, ogpFileName);
      fs.writeFileSync(ogpFilePath, imageBuffer);

      // Store OGP URL in campaign
      const ogpUrl = `/ogp/campaigns/${ogpFileName}`;
      const { error } = await supabase
        .from('campaigns')
        .update({
          ogp_image_url: ogpUrl,
        })
        .eq('id', campaignId);

      if (error) {
        console.error('Error saving OGP URL:', error);
        // Don't fail completely if saving fails
      }

      return NextResponse.json({
        ogp_image_url: ogpUrl,
        ogp_filename: ogpFileName,
        ogp_data: {
          campaign_title: campaign.title,
          campaign_id: campaignId,
          theme_title: theme?.title,
          theme_proposer: proposerProfile?.username || theme?.submitted_by?.substring(0, 8),
          track_title: track?.title,
          artist_name: track?.artist_name,
          thumbnail_url: track?.photo_url,
          comment: campaign.theme_proposer_comment,
        },
      });
    } catch (sharpErr) {
      console.error('Error generating OGP image:', sharpErr);

      // Fallback: Return placeholder URL if image generation fails
      const fallbackUrl = `/api/og/campaigns/${campaignId}`;

      // Still try to update database with fallback URL
      await supabase
        .from('campaigns')
        .update({
          ogp_image_url: fallbackUrl,
        })
        .eq('id', campaignId);

      return NextResponse.json({
        ogp_image_url: fallbackUrl,
        ogp_filename: `campaign-${campaignId}-award.png`,
        warning: 'OGP image generation failed, using fallback URL',
      });
    }
  } catch (err) {
    console.error('Unexpected error in POST campaigns/[id]/generate-ogp:', err);
    return NextResponse.json(
      { error: 'Unexpected error' },
      { status: 500 }
    );
  }
}

// Helper function to escape XML characters in SVG text
function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
    .substring(0, 100); // Limit text length
}
