import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

function MainLayout({ children, compact = false }) {
  return (
    <div className="flex bg-[#F8F7FC] min-h-screen">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <Navbar />

        <main className={compact ? "p-4" : "p-6"}>
          {children}
        </main>
      </div>
    </div>
  );
}

export default MainLayout;
