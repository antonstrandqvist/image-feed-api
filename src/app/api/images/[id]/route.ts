import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseClient } from '@/lib/supabaseServer';

export async function GET(_req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const supabase = getSupabaseClient();

  const { data: image, error: imageError } = await supabase
    .from('images')
    .select('id, image_url')
    .eq('id', id)
    .single();

  if (imageError) {
    return NextResponse.json({ error: 'Image not found' }, { status: 404 });
  }

  const [{ data: likesRows, error: likesError }, { data: comments, error: commentsError }] = await Promise.all([
    supabase.from('likes').select('id').eq('image_id', id),
    supabase.from('comments').select('commenter_name, comment').eq('image_id', id).order('created_at', { ascending: true }),
  ]);

  if (likesError || commentsError) {
    const message = likesError?.message || commentsError?.message || 'Failed to load image details';
    return NextResponse.json({ error: message }, { status: 500 });
  }

  const response = NextResponse.json({
    id: image.id,
    image_url: image.image_url,
    likes_count: (likesRows || []).length,
    comments: comments || [],
  });
  
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


