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

  return NextResponse.json({ success: true, likes_count: (likesRows || []).length });
}


