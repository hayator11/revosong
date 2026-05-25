'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

interface ThemeApplication {
  id: number;
  title: string;
  description: string;
  application_type: '自薦' | '他薦';
  support_type?: string;
  target_audience?: string;
  votes_count: number;
  status: string;
  created_at: string;
  submitter: {
    username: string;
    email: string;
  };
}

interface SyncStatus {
  synced_count: number;
  skipped_count: number;
  error_count: number;
  errors?: string[];
  message: string;
}

export default function RecruitmentDashboard() {
  const [applications, setApplications] = useState<ThemeApplication[]>([]);
  const [syncStatus, setSyncStatus] = useState<SyncStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [setting, setSetting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | '自薦' | '他薦'>('all');

  // Fetch pending applications
  const fetchApplications = async () => {
    try {
      setLoading(true);
      const { data, error: fetchError } = await supabase
        .from('campaign_themes')
        .select('*')
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;

      // Map data to match interface
      const mappedData = (data || []).map((item: any) => ({
        id: item.id,
        title: item.title,
        description: item.description,
        application_type: item.application_type || '未選択',
        support_type: item.support_type,
        target_audience: item.target_audience,
        votes_count: item.votes_count || 0,
        status: item.status,
        created_at: item.created_at,
        submitter: {
          username: item.applicant_name || '不明',
          email: item.applicant_email || '不明'
        }
      }));

      setApplications(mappedData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch applications');
    } finally {
      setLoading(false);
    }
  };

  // Sync from Google Sheet
  const syncGoogleSheet = async () => {
    try {
      setSyncing(true);
      setError(null);

      const response = await fetch('/api/admin/recruitment/sync-google-sheet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Sync failed');
      }

      const result: SyncStatus = await response.json();
      setSyncStatus(result);

      // Refresh applications list
      await fetchApplications();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sync failed');
    } finally {
      setSyncing(false);
    }
  };

  // Approve application
  const approveApplication = async (id: number) => {
    try {
      const response = await fetch(`/api/admin/recruitment/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'approved' }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Approve error:', errorData);
        throw new Error(errorData.error || `Failed to approve (${response.status})`);
      }

      // Refresh list
      await fetchApplications();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to approve';
      console.error('Approval error:', message);
      setError(message);
    }
  };

  // Reject application
  const rejectApplication = async (id: number) => {
    try {
      const response = await fetch(`/api/admin/recruitment/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'rejected' }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Reject error:', errorData);
        throw new Error(errorData.error || `Failed to reject (${response.status})`);
      }

      // Refresh list
      await fetchApplications();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to reject';
      console.error('Rejection error:', message);
      setError(message);
    }
  };

  // Setup Google Form with questions
  const setupGoogleForm = async () => {
    try {
      setSetting(true);
      setError(null);

      const response = await fetch('/api/admin/setup-google-form-questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to setup Google Form');
      }

      const result = await response.json();
      alert('✓ Google Form を自動設定しました！\n\n' + result.questions.join('\n'));
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to setup Google Form';
      console.error('Setup error:', message);
      setError(message);
    } finally {
      setSetting(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const filteredApplications = applications.filter(
    (app) => filter === 'all' || app.application_type === filter
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6" suppressHydrationWarning>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">キャンペーンテーマ申請管理</h1>
          <p className="text-gray-600">Google Formから送信されたテーマ申請を管理します</p>
        </div>

        {/* Navigation */}
        <div className="mb-6">
          <Link
            href="/admin"
            className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4"
          >
            ← 管理画面に戻る
          </Link>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            <p className="font-semibold">エラー</p>
            <p className="text-sm">{error}</p>
          </div>
        )}

        {/* Sync Status */}
        {syncStatus && (
          <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
            <p className="font-semibold">{syncStatus.message}</p>
            <ul className="text-sm mt-2">
              <li>✓ 追加: {syncStatus.synced_count}</li>
              <li>⊘ スキップ: {syncStatus.skipped_count}</li>
              {syncStatus.error_count > 0 && <li>✗ エラー: {syncStatus.error_count}</li>}
            </ul>
            {syncStatus.errors && syncStatus.errors.length > 0 && (
              <div className="mt-3 pt-3 border-t border-green-400">
                <p className="text-xs font-semibold mb-2">エラー詳細:</p>
                <ul className="text-xs space-y-1">
                  {syncStatus.errors.slice(0, 5).map((err, idx) => (
                    <li key={idx}>• {err}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Setup and Sync Buttons */}
        <div className="mb-8 flex gap-4">
          <button
            onClick={setupGoogleForm}
            disabled={setting}
            suppressHydrationWarning
            className="px-6 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 disabled:bg-gray-400"
          >
            {setting ? '設定中...' : 'Google Formを自動設定'}
          </button>
          <button
            onClick={syncGoogleSheet}
            disabled={syncing}
            suppressHydrationWarning
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400"
          >
            {syncing ? '同期中...' : 'Google Formから同期'}
          </button>
          <button
            onClick={fetchApplications}
            disabled={loading}
            suppressHydrationWarning
            className="px-6 py-3 bg-gray-600 text-white rounded-lg font-semibold hover:bg-gray-700 disabled:bg-gray-400"
          >
            {loading ? '読み込み中...' : '更新'}
          </button>
        </div>

        {/* Filter */}
        <div className="mb-6 flex gap-2">
          <button
            onClick={() => setFilter('all')}
            suppressHydrationWarning
            className={`px-4 py-2 rounded font-semibold ${
              filter === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
            }`}
          >
            全て ({applications.length})
          </button>
          <button
            onClick={() => setFilter('自薦')}
            suppressHydrationWarning
            className={`px-4 py-2 rounded font-semibold ${
              filter === '自薦'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
            }`}
          >
            自薦 ({applications.filter((a) => a.application_type === '自薦').length})
          </button>
          <button
            onClick={() => setFilter('他薦')}
            suppressHydrationWarning
            className={`px-4 py-2 rounded font-semibold ${
              filter === '他薦'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
            }`}
          >
            他薦 ({applications.filter((a) => a.application_type === '他薦').length})
          </button>
        </div>

        {/* Applications List */}
        <div className="space-y-4">
          {filteredApplications.length === 0 ? (
            <div className="p-8 text-center bg-white rounded-lg border border-gray-200">
              <p className="text-gray-600">審査待ちの申請はありません</p>
            </div>
          ) : (
            filteredApplications.map((app) => (
              <div
                key={app.id}
                className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-1">{app.title}</h3>
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 rounded">
                        {app.application_type}
                      </span>
                      <span>{app.submitter?.username}</span>
                      <span>{new Date(app.created_at).toLocaleDateString('ja-JP')}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => approveApplication(app.id)}
                      suppressHydrationWarning
                      className="px-4 py-2 bg-green-600 text-white rounded font-semibold hover:bg-green-700"
                    >
                      承認
                    </button>
                    <button
                      onClick={() => rejectApplication(app.id)}
                      suppressHydrationWarning
                      className="px-4 py-2 bg-red-600 text-white rounded font-semibold hover:bg-red-700"
                    >
                      却下
                    </button>
                  </div>
                </div>

                {/* Description */}
                <p className="text-gray-700 mb-4 leading-relaxed">{app.description}</p>

                {/* Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  {app.support_type && (
                    <div>
                      <p className="font-semibold text-gray-600">応援内容</p>
                      <p className="text-gray-800">{app.support_type}</p>
                    </div>
                  )}
                  {app.target_audience && (
                    <div>
                      <p className="font-semibold text-gray-600">対象</p>
                      <p className="text-gray-800">{app.target_audience}</p>
                    </div>
                  )}
                  {app.submitter?.email && (
                    <div>
                      <p className="font-semibold text-gray-600">メール</p>
                      <p className="text-gray-800 truncate">{app.submitter.email}</p>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
