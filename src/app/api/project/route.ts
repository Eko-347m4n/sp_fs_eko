import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../api/auth/[...nextauth]/route';
import prisma from '@/lib/prisma';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const userEmail = session.user?.email;
  if (!userEmail) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const projects = await prisma.project.findMany({
    where: {
      owner: {
        email: userEmail,
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return NextResponse.json(projects);
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const userEmail = session.user?.email;
  if (!userEmail) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const { title } = body;

  if (!title || typeof title !== 'string') {
    return NextResponse.json({ error: 'Invalid title' }, { status: 400 });
  }

  // Find user by email
  const user = await prisma.user.findUnique({
    where: { email: userEmail },
  });

  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  const newProject = await prisma.project.create({
    data: {
      title,
      ownerId: user.id,
    },
  });

  return NextResponse.json(newProject, { status: 201 });
}

export async function PUT(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const userEmail = session.user?.email;
  if (!userEmail) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const { id, title } = body;

  if (!id || typeof id !== 'string' || !title || typeof title !== 'string') {
    return NextResponse.json({ error: 'Invalid data' }, { status: 400 });
  }

  // Verify project ownership
  const project = await prisma.project.findUnique({
    where: { id },
    include: { owner: true },
  });

  if (!project || project.owner.email !== userEmail) {
    return NextResponse.json({ error: 'Project not found or unauthorized' }, { status: 404 });
  }

  const updatedProject = await prisma.project.update({
    where: { id },
    data: { title },
  });

  return NextResponse.json(updatedProject);
}

export async function DELETE(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const userEmail = session.user?.email;
  if (!userEmail) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'Project id is required' }, { status: 400 });
  }

  // Verify project ownership
  const project = await prisma.project.findUnique({
    where: { id },
    include: { owner: true },
  });

  if (!project || project.owner.email !== userEmail) {
    return NextResponse.json({ error: 'Project not found or unauthorized' }, { status: 404 });
  }

  await prisma.project.delete({
    where: { id },
  });

  return NextResponse.json({ message: 'Project deleted' });
}
