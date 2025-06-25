// Debug authentication page
import { useState } from 'react'
import Layout from '../../components/Layout'

export default function DebugAuth() {
  const [status, setStatus] = useState('')
  const [token, setToken] = useState('')
  const [loginResult, setLoginResult] = useState('')
  
  const checkStatus = async () => {
    try {
      const res = await fetch('/api/status')
      const data = await res.json()
      setStatus(JSON.stringify(data, null, 2))
    } catch (error) {
      setStatus('Error: ' + error.message)
    }
  }
  
  const getStoredToken = () => {
    const storedToken = localStorage.getItem('adminToken')
    setToken(storedToken || 'No token found in localStorage')
  }
  
  const testLogin = async () => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: 'admin',
          password: 'admin123'
        })
      })
      const data = await res.json()
      setLoginResult(JSON.stringify({ status: res.status, data }, null, 2))
      
      if (data.token) {
        localStorage.setItem('adminToken', data.token)
        setToken(data.token)
      }
    } catch (error) {
      setLoginResult('Error: ' + error.message)
    }
  }
  
  const testVerify = async () => {
    try {
      const storedToken = localStorage.getItem('adminToken')
      if (!storedToken) {
        setLoginResult('No token in localStorage. Please login first.')
        return
      }
      
      const res = await fetch('/api/auth/verify', {
        headers: {
          'Authorization': `Bearer ${storedToken}`
        }
      })
      const data = await res.json()
      setLoginResult(JSON.stringify({ status: res.status, data }, null, 2))
    } catch (error) {
      setLoginResult('Error: ' + error.message)
    }
  }
  
  const clearToken = () => {
    localStorage.removeItem('adminToken')
    localStorage.removeItem('adminUser')
    setToken('Token cleared')
  }
  
  return (
    <Layout title="Debug Authentication">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Debug Authentication</h1>
        
        <div className="space-y-6">
          {/* API Status */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">1. Check API Status</h2>
            <button 
              onClick={checkStatus}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Check Status
            </button>
            {status && (
              <pre className="mt-4 p-4 bg-gray-100 rounded overflow-auto text-sm">
                {status}
              </pre>
            )}
          </div>
          
          {/* Local Storage Token */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">2. Check Stored Token</h2>
            <button 
              onClick={getStoredToken}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              Get Token
            </button>
            {token && (
              <pre className="mt-4 p-4 bg-gray-100 rounded overflow-auto text-sm break-all">
                {token}
              </pre>
            )}
          </div>
          
          {/* Test Login */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">3. Test Login</h2>
            <div className="space-x-4">
              <button 
                onClick={testLogin}
                className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
              >
                Test Login (admin/admin123)
              </button>
              <button 
                onClick={testVerify}
                className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
              >
                Test Verify
              </button>
              <button 
                onClick={clearToken}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Clear Token
              </button>
            </div>
            {loginResult && (
              <pre className="mt-4 p-4 bg-gray-100 rounded overflow-auto text-sm">
                {loginResult}
              </pre>
            )}
          </div>
        </div>
      </div>
    </Layout>
  )
}