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

export async function OPTIONS() {
  const response = new NextResponse(null, { status: 200 });
  
  // Add CORS headers for preflight requests
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  return response;
}


