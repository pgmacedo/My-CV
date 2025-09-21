import { supabase } from '../lib/supabase'
import { useEffect, useState } from 'react'

export default function Home() {
  const { data } = supabase
    .storage
    .from('CV')
    .getPublicUrl('CV.pdf')

  return (
    <>
      <h1>My CV</h1>
      <iframe
        src={data.publicUrl}
        title="CV PDF - Paulo Macedo"
        style={{ width: '90vw', height: '90vh', border: '1px solid #ccc' }}
      />
    </>
  );
}
