import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseClient } from '@/lib/supabaseServer';

type CommentBody = {
  commenter_name?: string;
  comment?: string;
};

export async function POST(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const supabase = getSupabaseClient();

  let payload: CommentBody = {};
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const commenterName = (payload.commenter_name || '').trim();
  const commentText = (payload.comment || '').trim();

  if (!commenterName || !commentText) {
    return NextResponse.json({ error: 'commenter_name and comment are required' }, { status: 400 });
  }

  const { error: insertError } = await supabase.from('comments').insert({
    image_id: id,
    commenter_name: commenterName,
    comment: commentText,
  });

  if (insertError) {
    return NextResponse.json({ success: false, error: insertError.message }, { status: 500 });
  }

  const response = NextResponse.json({
    success: true,
    image_id: id,
    comment: { commenter_name: commenterName, comment: commentText },
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


