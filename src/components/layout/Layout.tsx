
import { ReactNode } from "react";
import Sidebar from "./Sidebar";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-ice-50 to-snow-50">
      <Sidebar />
      <main className="flex-1 overflow-x-hidden">
        <div className="page-container">
          <div className="page-transition">{children}</div>
        </div>
      </main>
    </div>
  );
};

export default Layout;
