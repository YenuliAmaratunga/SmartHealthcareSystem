import React from "react";

export default class ErrorBoundary extends React.Component {
  constructor(props){ super(props); this.state = { hasError:false, msg:"" }; }
  static getDerivedStateFromError(err){ return { hasError:true, msg: err?.message || "Something went wrong" }; }
  componentDidCatch(err, info){ console.error("Analytics render error:", err, info); }
  render(){
    if (this.state.hasError) {
      return (
        <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded">
          <b>Analytics error:</b> {this.state.msg}
        </div>
      );
    }
    return this.props.children;
  }
}
