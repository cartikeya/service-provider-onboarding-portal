import React from "react";
import { AlertOctagon } from "lucide-react";

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error caught by ErrorBoundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl m-4 flex items-center gap-3 text-xs text-rose-800">
          <AlertOctagon className="w-5 h-5 text-rose-600 shrink-0" />
          <div>
            <span className="font-bold block">Component Error</span>
            <span>Something went wrong while rendering this section.</span>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
