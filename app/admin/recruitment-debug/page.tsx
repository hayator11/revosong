'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function DebugRecruitment() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('Fetching campaign_themes...');
        const { data, error } = await supabase
          .from('campaign_themes')
          .select('*')
          .limit(10);

        if (error) {
          throw error;
        }

        console.log('Data fetched:', data);
        setData(data || []);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Unknown error';
        console.error('Error:', message);
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">デバッグ: キャンペーンテーマ</h1>

      {loading && <p>読み込み中...</p>}
      {error && <p className="text-red-500">エラー: {error}</p>}

      {!loading && !error && (
        <div>
          <p className="mb-4">取得したデータ: {data.length}件</p>
          <pre className="bg-gray-100 p-4 rounded overflow-auto">
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
