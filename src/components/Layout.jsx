import { Outlet } from 'react-router-dom'
import Footer from './Footer'
import Navbar from './Navbar'
import Sidebar from './Sidebar'

function Layout() {
  return (
    <div className="app-layout">
      <Navbar />
      <div className="layout-body">
        <Sidebar />
        <main className="main-content">
          <Outlet />
        </main>
      </div>
      <Footer />
    </div>
  )
}

export default Layout