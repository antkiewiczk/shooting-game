import { Component, type ReactNode } from "react";

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback: (error: Error, retry: () => void) => ReactNode;
  onRetry?: () => void;
}

export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  retry = () => {
    this.setState({ hasError: false, error: null });
    this.props.onRetry?.();
  };

  render() {
    if (this.state.hasError && this.state.error) {
      return this.props.fallback(this.state.error, this.retry);
    }
    return this.props.children;
  }
}

export const ErrorFallback = ({
  error,
  retry,
}: {
  error: Error;
  retry: () => void;
}) => {
  return (
    <div className="rounded-xl border border-red-900/50 bg-red-950/20 p-8 text-center">
      <p className="text-lg font-medium text-red-400">
        Failed to load leaderboard
      </p>
      <p className="mt-2 text-sm text-zinc-500">{error.message}</p>
      <button
        onClick={retry}
        className="mt-4 rounded-lg bg-zinc-800 px-4 py-2 text-sm font-medium text-zinc-300 transition-colors hover:bg-zinc-700"
      >
        Try again
      </button>
    </div>
  );
};
