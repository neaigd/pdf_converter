import React from 'react';
import './App.css';
import ConversionForm from './components/ConversionForm';

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">PDF Converter</h1>
          <p className="mt-1 text-sm text-gray-500">
            Converta arquivos PDF para vários formatos mantendo a formatação original
          </p>
        </div>
      </header>
      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="bg-white shadow rounded-lg p-6">
              <ConversionForm />
            </div>
          </div>
        </div>
      </main>
      <footer className="bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-500">
            &copy; {new Date().getFullYear()} PDF Converter. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
