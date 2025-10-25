import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;
const supabase = createClient(supabaseUrl, supabaseKey);

const PAGE_SIZE = 10;
const MAX_PAGES = 20;

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const pageParam = Number(searchParams.get('page') || '1');
  const page = Number.isFinite(pageParam) && pageParam > 0 ? pageParam : 1;

  if (page > MAX_PAGES) {
    return NextResponse.json({ error: 'Page not found' }, { status: 404 });
  }

  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  const { data: images, error: imagesError } = await supabase
    .from('images')
    .select('id, image_url')
    .order('created_at', { ascending: true })
    .range(from, to);

  if (imagesError) {
    return NextResponse.json({ error: imagesError.message }, { status: 500 });
  }

  const imageIds = images?.map((img: any) => img.id) || [];

  const [{ data: likesAgg, error: likesError }, { data: comments, error: commentsError }] = await Promise.all([
    supabase
      .from('likes')
      .select('image_id, count:id', { count: 'exact', head: false })
      .in('image_id', imageIds),
    supabase
      .from('comments')
      .select('image_id, commenter_name, comment')
      .in('image_id', imageIds)
  ]);

  if (likesError || commentsError) {
    const message = likesError?.message || commentsError?.message || 'Failed to load aggregates';
    return NextResponse.json({ error: message }, { status: 500 });
  }

  const likesCountByImage: Record<string, number> = {};
  for (const row of likesAgg || []) {
    const key = (row as any).image_id as string;
    likesCountByImage[key] = (likesCountByImage[key] || 0) + 1;
  }

  const commentsByImage: Record<string, Array<{ commenter_name: string; comment: string }>> = {};
  for (const row of comments || []) {
    const key = (row as any).image_id as string;
    (commentsByImage[key] = commentsByImage[key] || []).push({
      commenter_name: (row as any).commenter_name,
      comment: (row as any).comment,
    });
  }

  const responseData = (images || []).map((img: any) => ({
    id: img.id,
    image_url: img.image_url,
    likes_count: likesCountByImage[img.id] || 0,
    comments: commentsByImage[img.id] || [],
  }));

  const response = NextResponse.json({ page, total_pages: MAX_PAGES, data: responseData });
  
  // Add CORS headers
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  return response;
}

export async function OPTIONS() {
  const response = new NextResponse(null, { status: 200 });
  
  // Add CORS headers for preflight requests
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  return response;
}

