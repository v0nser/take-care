import { Outlet } from 'react-router-dom'
import { Heart } from 'lucide-react'

const PublicLayout = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-gray-900 dark:to-gray-800">
      {/* <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            
          </div>
        </div>
      </header> */}
      
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  )
}

export default PublicLayout
