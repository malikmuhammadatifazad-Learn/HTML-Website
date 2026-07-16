import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

type RouteContext = {
  params: Promise<{
    id: string
  }>
}

export async function DELETE(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const { id } = await context.params;
    console.log('Deleting campaign with ID:', id);

    const existing = await prisma.campaign.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json({ error: 'Campaign not found' }, { status: 404 });
    }

    await prisma.campaign.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Deleted' }, { status: 200 });
  } catch (error) {
    console.error('Delete error:', error);
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const { id } = await context.params;
    const body = await request.json();

    const existing = await prisma.campaign.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json({ error: 'Campaign not found' }, { status: 404 });
    }

    const campaign = await prisma.campaign.update({
      where: { id },
      data: {
        name: body.name,
        platform: body.platform,
        spend: body.spend || 0,
        revenue: body.revenue || 0,
        impressions: body.impressions || 0,
        clicks: body.clicks || 0,
        status: body.status || 'Active',
      },
    });

    return NextResponse.json(campaign);
  } catch (error) {
    console.error('Update error:', error);
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 });
  }
}