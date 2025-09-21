import { supabase } from '../lib/supabase'
import { useEffect, useState } from 'react'


export default function Home() {
  const { data } = supabase
    .storage
    .from('CV')
    .getPublicUrl('CV.pdf')

  return (
    <>
      <iframe
        src={data.publicUrl}
        title="CV - Paulo Macedo"
        style={{ width: '90vw', height: '85vh', marginTop: '10px', border: '1px solid #ccc' }}
      />
    </>
  );
}
