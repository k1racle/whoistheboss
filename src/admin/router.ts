import { loginView } from './views/login.js';
import { dashboardView } from './views/dashboard.js';
import { entrepreneursView, entrepreneurFormView } from './views/entrepreneurs.js';
import { interviewsView, interviewFormView } from './views/interviews.js';
import { reelsView, reelFormView } from './views/reels.js';
import { articlesView, articleFormView } from './views/articles.js';
import { businessesView, businessFormView } from './views/businesses.js';
import { commentsView } from './views/comments.js';
import { shootingRequestsView } from './views/shootingRequests.js';
import { subscribersView } from './views/subscribers.js';
import { usersView, userFormView } from './views/users.js';
import { settingsView } from './views/settings.js';
import type { UserInfo } from './views/layout.js';

export interface RouteResult {
  html: string;
  init?: () => Promise<void> | void;
}

function match(path: string, pattern: string): boolean {
  const regex = new RegExp('^' + pattern.replace(/:id/g, '([^/]+)') + '$');
  return regex.test(path);
}

function param(path: string, pattern: string): string | null {
  const regex = new RegExp('^' + pattern.replace(/:id/g, '([^/]+)') + '$');
  const m = path.match(regex);
  return m ? m[1] : null;
}

export const router = {
  async resolve(path: string, user?: UserInfo | null): Promise<RouteResult> {
    if (path === '/admin/login') {
      return loginView();
    }

    if (path === '/admin' || path === '/admin/') {
      return dashboardView(user);
    }

    if (path === '/admin/entrepreneurs') return entrepreneursView(user);
    if (match(path, '/admin/entrepreneurs/new')) return entrepreneurFormView(null, user);
    if (match(path, '/admin/entrepreneurs/:id/edit')) return entrepreneurFormView(param(path, '/admin/entrepreneurs/:id/edit'), user);

    if (path === '/admin/interviews') return interviewsView(user);
    if (match(path, '/admin/interviews/new')) return interviewFormView(null, user);
    if (match(path, '/admin/interviews/:id/edit')) return interviewFormView(param(path, '/admin/interviews/:id/edit'), user);

    if (path === '/admin/reels') return reelsView(user);
    if (match(path, '/admin/reels/new')) return reelFormView(null, user);
    if (match(path, '/admin/reels/:id/edit')) return reelFormView(param(path, '/admin/reels/:id/edit'), user);

    if (path === '/admin/articles') return articlesView(user);
    if (match(path, '/admin/articles/new')) return articleFormView(null, user);
    if (match(path, '/admin/articles/:id/edit')) return articleFormView(param(path, '/admin/articles/:id/edit'), user);

    if (path === '/admin/businesses') return businessesView(user);
    if (match(path, '/admin/businesses/new')) return businessFormView(null, user);
    if (match(path, '/admin/businesses/:id/edit')) return businessFormView(param(path, '/admin/businesses/:id/edit'), user);

    if (path === '/admin/comments') return commentsView(user);
    if (path === '/admin/shooting-requests') return shootingRequestsView(user);
    if (path === '/admin/subscribers') return subscribersView(user);
    if (path === '/admin/users') return usersView(user);
    if (match(path, '/admin/users/new')) return userFormView(null, user);
    if (match(path, '/admin/users/:id/edit')) return userFormView(param(path, '/admin/users/:id/edit'), user);
    if (path === '/admin/settings') return settingsView(user);

    return dashboardView(user);
  },
};
