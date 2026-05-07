export default function DashboardShell({ title, subtitle, children }) {
  return (
    // Outer container with white background, rounded corners, shadow, padding, and border
    <div className="bg-white rounded-[2.5rem] shadow-sm p-8 border border-slate-100">
      
      {/* Header section: renders only if 'title' is provided */}
      {title && (
        <header className="mb-8">
          {/* Main title */}
          <h2 className="text-3xl font-black text-slate-900 tracking-tighter">
            {title}
          </h2>

          {/* Optional subtitle */}
          {subtitle && (
            <p className="text-slate-500 font-medium">
              {subtitle}
            </p>
          )}
        </header>
      )}

      {/* Render the main content passed as children */}
      {children}
    </div>
  );
}