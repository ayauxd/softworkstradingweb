import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import PrivacyPolicyPage from '../../../client/src/pages/PrivacyPolicyPage';
import TermsOfServicePage from '../../../client/src/pages/TermsOfServicePage';
import CookiePolicyPage from '../../../client/src/pages/CookiePolicyPage';
import { HelmetProvider } from 'react-helmet-async';
import { BrowserRouter } from 'react-router-dom';

// Mock fetch
global.fetch = vi.fn();

// Mock for useTheme hook
vi.mock('@/hooks/use-theme-toggle', () => ({
  useTheme: () => ({ theme: 'light', setTheme: vi.fn() })
}));

// Mock for wouter's Link component
vi.mock('wouter', () => ({
  Link: ({ children, to }: { children: React.ReactNode, to: string }) => (
    <a href={to}>{children}</a>
  ),
  useLocation: () => ['/', vi.fn()]
}));

describe('Policy Pages', () => {
  beforeEach(() => {
    // Reset mocks
    vi.resetAllMocks();
    
    // Mock successful fetch response
    (global.fetch as any).mockResolvedValue({
      text: () => Promise.resolve(`
        <article class="policy-content">
          <h1>Policy Title</h1>
          <p class="last-updated">Last Updated: May 6, 2025</p>
          <div class="policy-content">Test policy content</div>
        </article>
      `)
    });
  });

  it('renders PrivacyPolicyPage with correct title', async () => {
    render(
      <HelmetProvider>
        <PrivacyPolicyPage />
      </HelmetProvider>
    );
    
    // Check for loading spinner first
    expect(screen.getByRole('status')).toBeInTheDocument();
    
    // Wait for content to load
    const content = await screen.findByText('Test policy content');
    expect(content).toBeInTheDocument();
    
    // Verify that the fetch was called with the correct URL
    expect(global.fetch).toHaveBeenCalledWith('/policies/privacy-policy.html');
  });

  it('renders TermsOfServicePage with correct title', async () => {
    render(
      <HelmetProvider>
        <TermsOfServicePage />
      </HelmetProvider>
    );
    
    // Check for loading spinner first
    expect(screen.getByRole('status')).toBeInTheDocument();
    
    // Wait for content to load
    const content = await screen.findByText('Test policy content');
    expect(content).toBeInTheDocument();
    
    // Verify that the fetch was called with the correct URL
    expect(global.fetch).toHaveBeenCalledWith('/policies/terms-of-service.html');
  });

  it('renders CookiePolicyPage with correct title', async () => {
    render(
      <HelmetProvider>
        <CookiePolicyPage />
      </HelmetProvider>
    );
    
    // Check for loading spinner first
    expect(screen.getByRole('status')).toBeInTheDocument();
    
    // Wait for content to load
    const content = await screen.findByText('Test policy content');
    expect(content).toBeInTheDocument();
    
    // Verify that the fetch was called with the correct URL
    expect(global.fetch).toHaveBeenCalledWith('/policies/cookie-policy.html');
  });

  it('handles fetch errors gracefully', async () => {
    // Mock failed fetch
    (global.fetch as any).mockRejectedValue(new Error('Failed to fetch'));
    
    render(
      <HelmetProvider>
        <PrivacyPolicyPage />
      </HelmetProvider>
    );
    
    // Check for loading spinner first
    expect(screen.getByRole('status')).toBeInTheDocument();
    
    // Should display error message
    const errorContent = await screen.findByText('Unable to load policy content.');
    expect(errorContent).toBeInTheDocument();
  });
});