import React from "react";

interface ToolbarProps {
  children: React.ReactNode;
}

/**
 * Toolbar wrapper. Uses onMouseDown + preventDefault to prevent the editor
 * from losing focus when toolbar buttons are clicked.
 */
export function Toolbar({ children }: ToolbarProps) {
  return (
    <div
      className="sre-toolbar"
      onMouseDown={(e) => e.preventDefault()}
    >
      {children}
    </div>
  );
}
