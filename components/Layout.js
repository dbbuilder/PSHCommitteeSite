import Head from 'next/head'
import { useRouter } from 'next/router'
import Header from './Header'
import AdminHeader from './AdminHeader'
import Footer from './Footer'

export default function Layout({ children, title = 'PSH Advisory Committee' }) {
  const router = useRouter()
  const isAdminPage = router.pathname.startsWith('/admin') && router.pathname !== '/admin/login'
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Head>
        <title>{`${title} | Washington State PSH Advisory Committee`}</title>
        <meta name="description" content="Washington State Permanent Supportive Housing Advisory Committee - Providing guidance and recommendations on permanent supportive housing programs" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      {isAdminPage ? <AdminHeader /> : <Header />}
      
      <main className="flex-grow">
        {children}
      </main>
      
      <Footer />
    </div>
  )
}