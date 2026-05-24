/**
 * Analytics Integration Layer
 *
 * 複数の外部分析ツールを統一的に管理するレイヤー
 * 後から容易に追加・削除できる設計
 *
 * 対応予定サービス：
 * - Google Analytics 4
 * - Vercel Analytics
 * - Mixpanel
 * - Amplitude
 * - Hotjar
 * - カスタムイベント API
 */

// ============================================================================
// イベント型定義
// ============================================================================

export interface AnalyticsEvent {
  eventName: string;
  eventCategory: 'user' | 'playlist' | 'engagement' | 'system' | 'error';
  eventData?: Record<string, any>;
  userId?: string;
  timestamp?: Date;
}

export interface PageViewEvent extends AnalyticsEvent {
  pagePath: string;
  pageTitle?: string;
  referrer?: string;
}

export interface UserEvent extends AnalyticsEvent {
  userId: string;
  action: 'signup' | 'login' | 'logout' | 'profile_update';
}

export interface PlaylistEvent extends AnalyticsEvent {
  playlistId?: number;
  action: 'create' | 'update' | 'delete' | 'share' | 'add_item' | 'remove_item';
  itemCount?: number;
  isPublic?: boolean;
}

export interface EngagementEvent extends AnalyticsEvent {
  duration?: number; // ミリ秒
  interactionType: 'click' | 'scroll' | 'search' | 'filter' | 'play';
  componentName?: string;
}

// ============================================================================
// Analytics マネージャークラス
// ============================================================================

class AnalyticsManager {
  private enabled: boolean;
  private providers: Set<string> = new Set();

  constructor() {
    // 環境変数で有効/無効を制御
    this.enabled = process.env.NEXT_PUBLIC_ANALYTICS_ENABLED === 'true';

    // 有効な外部サービスを初期化
    if (this.enabled && typeof window !== 'undefined') {
      this.initializeProviders();
    }
  }

  /**
   * 有効な外部サービスプロバイダーを初期化
   */
  private initializeProviders(): void {
    // Google Analytics 4
    if (process.env.NEXT_PUBLIC_GA4_ID) {
      this.initGoogleAnalytics();
      this.providers.add('google-analytics');
    }

    // Vercel Analytics
    if (process.env.NEXT_PUBLIC_VERCEL_ANALYTICS === 'true') {
      this.initVercelAnalytics();
      this.providers.add('vercel-analytics');
    }

    // Mixpanel
    if (process.env.NEXT_PUBLIC_MIXPANEL_TOKEN) {
      this.initMixpanel();
      this.providers.add('mixpanel');
    }

    // Amplitude
    if (process.env.NEXT_PUBLIC_AMPLITUDE_KEY) {
      this.initAmplitude();
      this.providers.add('amplitude');
    }

    // Hotjar
    if (process.env.NEXT_PUBLIC_HOTJAR_ID) {
      this.initHotjar();
      this.providers.add('hotjar');
    }

    // カスタム分析エンドポイント
    if (process.env.NEXT_PUBLIC_CUSTOM_ANALYTICS_ENDPOINT) {
      this.providers.add('custom-analytics');
    }
  }

  /**
   * Google Analytics 4 初期化
   */
  private initGoogleAnalytics(): void {
    if (typeof window === 'undefined') return;

    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA4_ID}`;
    document.head.appendChild(script);

    (window as any).dataLayer = (window as any).dataLayer || [];
    function gtag(...args: any[]) {
      (window as any).dataLayer.push(arguments);
    }
    (window as any).gtag = gtag;
    gtag('js', new Date());
    gtag('config', process.env.NEXT_PUBLIC_GA4_ID);
  }

  /**
   * Vercel Analytics 初期化
   */
  private initVercelAnalytics(): void {
    // @vercel/analytics がインストールされている場合
    try {
      // dynamic import
      if (typeof window !== 'undefined') {
        (async () => {
          try {
            const analytics = await import('@vercel/analytics/web' as any);
            if (analytics.inject) {
              analytics.inject();
            }
          } catch (error) {
            console.warn('Vercel Analytics not available');
          }
        })();
      }
    } catch (error) {
      console.warn('Vercel Analytics not available');
    }
  }

  /**
   * Mixpanel 初期化
   */
  private initMixpanel(): void {
    if (typeof window === 'undefined') return;

    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.async = true;
    script.src = 'https://cdn.mxpnl.com/libs/mixpanel-latest.min.js';
    document.head.appendChild(script);

    script.onload = () => {
      (window as any).mixpanel.init(process.env.NEXT_PUBLIC_MIXPANEL_TOKEN);
    };
  }

  /**
   * Amplitude 初期化
   */
  private initAmplitude(): void {
    if (typeof window === 'undefined') return;

    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.async = true;
    script.src = 'https://cdn.amplitude.com/libs/amplitude-8.17.0-min.js.gz';
    document.head.appendChild(script);

    script.onload = () => {
      (window as any).amplitude.getInstance().init(process.env.NEXT_PUBLIC_AMPLITUDE_KEY);
    };
  }

  /**
   * Hotjar 初期化
   */
  private initHotjar(): void {
    if (typeof window === 'undefined') return;

    (window as any).hj =
      (window as any).hj ||
      function () {
        ((window as any).hj.q = (window as any).hj.q || []).push(arguments);
      };
    (window as any)._hjSettings = {
      hjid: process.env.NEXT_PUBLIC_HOTJAR_ID,
      hjsv: 6
    };

    const script = document.createElement('script');
    script.async = true;
    script.src = `https://static.hotjar.com/c/hotjar-${process.env.NEXT_PUBLIC_HOTJAR_ID}.js`;
    document.head.appendChild(script);
  }

  /**
   * ページビューイベント送信
   */
  trackPageView(event: PageViewEvent): void {
    if (!this.enabled) return;

    // Google Analytics
    if (this.providers.has('google-analytics')) {
      (window as any).gtag?.('event', 'page_view', {
        page_path: event.pagePath,
        page_title: event.pageTitle || document.title
      });
    }

    // Vercel Analytics - 自動トラッキング
    // Mixpanel
    if (this.providers.has('mixpanel')) {
      (window as any).mixpanel?.track('Page View', {
        page_path: event.pagePath,
        page_title: event.pageTitle
      });
    }

    // Amplitude
    if (this.providers.has('amplitude')) {
      (window as any).amplitude?.getInstance().logEvent('Page View', {
        page_path: event.pagePath,
        page_title: event.pageTitle
      });
    }

    // カスタム分析
    if (this.providers.has('custom-analytics')) {
      this.sendCustomAnalytics('page_view', event);
    }
  }

  /**
   * ユーザーイベント送信
   */
  trackUserEvent(event: UserEvent): void {
    if (!this.enabled) return;

    // Google Analytics
    if (this.providers.has('google-analytics')) {
      (window as any).gtag?.('event', event.action, {
        user_id: event.userId
      });
    }

    // Mixpanel
    if (this.providers.has('mixpanel')) {
      (window as any).mixpanel?.identify(event.userId);
      (window as any).mixpanel?.track(event.action, event.eventData || {});
    }

    // Amplitude
    if (this.providers.has('amplitude')) {
      (window as any).amplitude?.getInstance().setUserId(event.userId);
      (window as any).amplitude?.getInstance().logEvent(event.action, event.eventData || {});
    }

    // カスタム分析
    if (this.providers.has('custom-analytics')) {
      this.sendCustomAnalytics('user_event', event);
    }
  }

  /**
   * プレイリストイベント送信
   */
  trackPlaylistEvent(event: PlaylistEvent): void {
    if (!this.enabled) return;

    const eventData = {
      action: event.action,
      playlist_id: event.playlistId,
      item_count: event.itemCount,
      is_public: event.isPublic,
      ...event.eventData
    };

    // Google Analytics
    if (this.providers.has('google-analytics')) {
      (window as any).gtag?.('event', `playlist_${event.action}`, eventData);
    }

    // Mixpanel
    if (this.providers.has('mixpanel')) {
      (window as any).mixpanel?.track(`Playlist ${event.action}`, eventData);
    }

    // Amplitude
    if (this.providers.has('amplitude')) {
      (window as any).amplitude?.getInstance().logEvent(`Playlist ${event.action}`, eventData);
    }

    // カスタム分析
    if (this.providers.has('custom-analytics')) {
      this.sendCustomAnalytics('playlist_event', { ...event, eventData });
    }
  }

  /**
   * エンゲージメントイベント送信
   */
  trackEngagement(event: EngagementEvent): void {
    if (!this.enabled) return;

    const eventData = {
      interaction_type: event.interactionType,
      duration: event.duration,
      component_name: event.componentName,
      ...event.eventData
    };

    // Google Analytics
    if (this.providers.has('google-analytics')) {
      (window as any).gtag?.('event', `engagement_${event.interactionType}`, eventData);
    }

    // Mixpanel
    if (this.providers.has('mixpanel')) {
      (window as any).mixpanel?.track(`Engagement: ${event.interactionType}`, eventData);
    }

    // Amplitude
    if (this.providers.has('amplitude')) {
      (window as any).amplitude?.getInstance().logEvent(`Engagement: ${event.interactionType}`, eventData);
    }

    // カスタム分析
    if (this.providers.has('custom-analytics')) {
      this.sendCustomAnalytics('engagement_event', { ...event, eventData });
    }
  }

  /**
   * エラーイベント送信
   */
  trackError(errorName: string, errorDetails: Record<string, any>): void {
    if (!this.enabled) return;

    // Google Analytics
    if (this.providers.has('google-analytics')) {
      (window as any).gtag?.('event', 'exception', {
        description: errorName,
        ...errorDetails
      });
    }

    // Mixpanel
    if (this.providers.has('mixpanel')) {
      (window as any).mixpanel?.track('Error', {
        error_name: errorName,
        ...errorDetails
      });
    }

    // Amplitude
    if (this.providers.has('amplitude')) {
      (window as any).amplitude?.getInstance().logEvent('Error', {
        error_name: errorName,
        ...errorDetails
      });
    }

    // カスタム分析
    if (this.providers.has('custom-analytics')) {
      this.sendCustomAnalytics('error_event', {
        error_name: errorName,
        ...errorDetails
      });
    }
  }

  /**
   * ユーザープロパティ設定（識別）
   */
  setUserProperties(userId: string, properties: Record<string, any>): void {
    if (!this.enabled) return;

    // Google Analytics
    if (this.providers.has('google-analytics')) {
      (window as any).gtag?.('config', process.env.NEXT_PUBLIC_GA4_ID, {
        user_id: userId,
        user_properties: properties
      });
    }

    // Mixpanel
    if (this.providers.has('mixpanel')) {
      (window as any).mixpanel?.identify(userId);
      (window as any).mixpanel?.people.set(properties);
    }

    // Amplitude
    if (this.providers.has('amplitude')) {
      (window as any).amplitude?.getInstance().setUserId(userId);
      (window as any).amplitude?.getInstance().setUserProperties(properties);
    }

    // カスタム分析
    if (this.providers.has('custom-analytics')) {
      this.sendCustomAnalytics('set_user_properties', {
        user_id: userId,
        properties
      });
    }
  }

  /**
   * カスタム分析エンドポイントにデータ送信
   */
  private sendCustomAnalytics(eventType: string, data: any): void {
    if (!process.env.NEXT_PUBLIC_CUSTOM_ANALYTICS_ENDPOINT) return;

    // 非ブロッキング送信
    navigator.sendBeacon(
      process.env.NEXT_PUBLIC_CUSTOM_ANALYTICS_ENDPOINT,
      JSON.stringify({
        event_type: eventType,
        timestamp: new Date().toISOString(),
        ...data
      })
    );
  }

  /**
   * アクティブプロバイダー一覧を取得
   */
  getActiveProviders(): string[] {
    return Array.from(this.providers);
  }

  /**
   * 分析が有効か確認
   */
  isEnabled(): boolean {
    return this.enabled;
  }
}

// ============================================================================
// シングルトンインスタンス
// ============================================================================

let analyticsInstance: AnalyticsManager;

export function getAnalytics(): AnalyticsManager {
  if (!analyticsInstance) {
    analyticsInstance = new AnalyticsManager();
  }
  return analyticsInstance;
}

// ============================================================================
// React Hook（useEffect で自動トラッキング）
// ============================================================================

export function usePageTracking(pagePath: string, pageTitle?: string): void {
  if (typeof window === 'undefined') return;

  React.useEffect(() => {
    const analytics = getAnalytics();
    analytics.trackPageView({
      eventName: 'page_view',
      eventCategory: 'system',
      pagePath,
      pageTitle: pageTitle || document.title
    });
  }, [pagePath, pageTitle]);
}

// React がない場合の import パス
let React: any;
try {
  React = require('react');
} catch (e) {
  // React がない環境では React Hook は使用不可
}

// ============================================================================
// 使用例
// ============================================================================

/*
// コンポーネント内での使用例

import { getAnalytics, usePageTracking } from '@/lib/analytics';

export function MyComponent() {
  // ページビュー自動トラッキング
  usePageTracking('/my-page', 'My Page Title');

  const handlePlaylistCreate = () => {
    const analytics = getAnalytics();
    analytics.trackPlaylistEvent({
      eventName: 'playlist_created',
      eventCategory: 'playlist',
      action: 'create',
      playlistId: 123,
      itemCount: 0,
      isPublic: false
    });
  };

  const handleUserLogin = (userId: string) => {
    const analytics = getAnalytics();
    analytics.trackUserEvent({
      eventName: 'user_login',
      eventCategory: 'user',
      userId,
      action: 'login'
    });

    analytics.setUserProperties(userId, {
      signup_date: new Date().toISOString(),
      plan: 'free'
    });
  };

  return (
    <button onClick={handlePlaylistCreate}>
      Create Playlist
    </button>
  );
}
*/
