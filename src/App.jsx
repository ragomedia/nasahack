import { useState, useRef } from 'react'
import './App.css'

function App() {
  const [csvData, setCsvData] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const fileInputRef = useRef(null)

  const handleFileUpload = (event) => {
    const file = event.target.files[0]
    if (!file) return

    setIsLoading(true)
    
    const reader = new FileReader()
    reader.onload = (e) => {
      const text = e.target.result
      const lines = text.split('\n')
      const headers = lines[0].split(',').map(h => h.trim())
      
      const data = lines.slice(1)
        .filter(line => line.trim())
        .map(line => {
          const values = line.split(',')
          const planet = {}
          headers.forEach((header, index) => {
            planet[header] = values[index]?.trim() || ''
          })
          return planet
        })
      
      setCsvData(data)
      setIsLoading(false)
    }
    
    reader.readAsText(file)
  }

  return (
    <div className="app">
      {/* Planetas de fondo */}
      <div className="background-planets">
        <div className="planet planet-1"></div>
        <div className="planet planet-2"></div>
        <div className="planet planet-3"></div>
        <div className="planet planet-4"></div>
        <div className="planet planet-5"></div>
      </div>
      
      <div className="container">
        <header className="header">
          <h1 className="title">NASA EXOPLANET EXPLORER</h1>
          <p className="subtitle">Upload and analyze exoplanet data</p>
        </header>

        <main className="main">
          <div className="upload-section">
            <div className="upload-card">
              <h2>Upload CSV Data</h2>
              
              <input
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                ref={fileInputRef}
                style={{ display: 'none' }}
              />
              
              <button 
                className="upload-button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isLoading}
              >
                {isLoading ? 'Processing...' : 'Choose CSV File'}
              </button>
              
              {csvData.length > 0 && (
                <div className="data-info">
                  {csvData.length} exoplanets loaded
                </div>
              )}
            </div>
          </div>

          {csvData.length > 0 && (
            <div className="data-section">
              <h2>Exoplanet Data</h2>
              <div className="data-table">
                <table>
                  <thead>
                    <tr>
                      {Object.keys(csvData[0]).map(key => (
                        <th key={key}>{key}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {csvData.slice(0, 10).map((planet, index) => (
                      <tr key={index}>
                        {Object.values(planet).map((value, i) => (
                          <td key={i}>{value}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

export default App
