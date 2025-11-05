import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseClient } from '@/lib/supabaseServer';

export async function POST(_req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const supabase = getSupabaseClient();

  const { error: insertError } = await supabase.from('likes').insert({ image_id: id });
  if (insertError) {
    return NextResponse.json({ success: false, error: insertError.message }, { status: 500 });
  }

  const { data: likesRows, error: likesError } = await supabase.from('likes').select('id').eq('image_id', id);
  if (likesError) {
    return NextResponse.json({ success: true, likes_count: null }, { status: 200 });
  }

  const response = NextResponse.json({ success: true, likes_count: (likesRows || []).length });
  
  // Add CORS headers
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  return response;
}

export async function DELETE(_req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const supabase = getSupabaseClient();

  // Get the most recent like for this image
  const { data: recentLike, error: findError } = await supabase
    .from('likes')
    .select('id')
    .eq('image_id', id)
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  if (findError || !recentLike) {
    return NextResponse.json({ success: false, error: 'No like found to remove' }, { status: 404 });
  }

  // Delete the like
  const { error: deleteError } = await supabase
    .from('likes')
    .delete()
    .eq('id', recentLike.id);

  if (deleteError) {
    return NextResponse.json({ success: false, error: deleteError.message }, { status: 500 });
  }

  // Get updated likes count
  const { data: likesRows, error: likesError } = await supabase
    .from('likes')
    .select('id')
    .eq('image_id', id);

  if (likesError) {
    return NextResponse.json({ success: true, likes_count: null }, { status: 200 });
  }

  const response = NextResponse.json({ success: true, likes_count: (likesRows || []).length });
  
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


