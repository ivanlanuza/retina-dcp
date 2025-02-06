import { MainSideBar } from "./MainSideBar";

export default function Layout({ children }) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <MainSideBar />
      <main className="flex-1 p-8 overflow-y-auto">{children}</main>
    </div>
  );
}
