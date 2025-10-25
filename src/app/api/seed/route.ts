import { NextResponse } from 'next/server';
import { getSupabaseClient } from '@/lib/supabaseServer';

const TOTAL_IMAGES = 200;

export async function POST() {
  const supabase = getSupabaseClient();

  const { count, error: countError } = await supabase
    .from('images')
    .select('id', { count: 'exact', head: true });

  if (countError) {
    return NextResponse.json({ error: countError.message }, { status: 500 });
  }

  if ((count || 0) >= TOTAL_IMAGES) {
    return NextResponse.json({ success: true, seeded: 0, message: 'Already seeded' });
  }

  const remaining = TOTAL_IMAGES - (count || 0);
  const rows = Array.from({ length: remaining }).map((_, i) => {
    const index = (count || 0) + i + 1;
    return { image_url: `https://picsum.photos/300?random=${index}` };
  });

  const { error: insertError } = await supabase.from('images').insert(rows);
  if (insertError) {
    return NextResponse.json({ error: insertError.message }, { status: 500 });
  }

  const response = NextResponse.json({ success: true, seeded: rows.length });
  
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


