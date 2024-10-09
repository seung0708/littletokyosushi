import React from 'react'

const DashboardPage: React.FC = () => {
    return(
        <section>
             <h1 className="text-2xl font-semibold text-gray-700">Dashboard</h1>
      <div className="mt-6 flex items-center justify-center h-64 border-2 border-dashed border-gray-300 rounded-lg">
        <p className="text-gray-500">No products yet.</p>
      </div>
        </section>
    )
}

export default DashboardPage