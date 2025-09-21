import { supabase } from './lib/supabase'
import { useEffect, useState } from 'react'

export default function Home() {
  return (
    <>
      <h1>My CV</h1>
      <iframe
        src="/CV.pdf"
        title="CV PDF - Paulo Macedo"
        style={{ width: '90vw', height: '90vh', border: '1px solid #ccc' }}
      />
    </>
  );
}
