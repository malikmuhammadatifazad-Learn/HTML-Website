import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const campaigns = await prisma.campaign.findMany();
    return NextResponse.json(campaigns);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch campaigns' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const campaign = await prisma.campaign.create({
      data: {
        name: body.name,
        platform: body.platform,
        spend: body.spend || 0,
        revenue: body.revenue || 0,
        impressions: body.impressions || 0,
        clicks: body.clicks || 0,
        status: body.status || 'Active',
        userId: 'temp-user-id',
      },
    });
    return NextResponse.json(campaign, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to create campaign' }, { status: 500 });
  }
}