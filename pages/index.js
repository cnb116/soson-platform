import { useState } from 'react';
import Head from 'next/head';
import { motion } from 'framer-motion';

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [proposal, setProposal] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const formData = {
      product: e.target.product.value,
      target: e.target.target.value,
      goal: e.target.goal.value,
    };

    try {
      const response = await fetch('/api/generate-proposal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || '제안서 생성 중 오류가 발생했습니다.');
      }

      setProposal(data.proposal);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>소내손 공동구매 플랫폼</title>
        <meta name="description" content="누구나 쉽게, 빠르게 공동구매를 시작할 수 있습니다." />
        <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;700&display=swap" rel="stylesheet" />
      </Head>

      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">소내손 공동구매 플랫폼</h1>
              <p className="mt-2 text-sm text-gray-600">누구나 쉽게, 빠르게 공동구매를 시작할 수 있습니다.</p>
            </div>
            <div className="space-x-4">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                제안서 만들기
              </button>
              <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition">
                진행중인 공동구매 보기
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Form Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-8"
        >
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">
            공동구매 제안서를 자동으로 만들어보세요!
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="product" className="block text-sm font-medium text-gray-700">
                제품명
              </label>
              <input
                type="text"
                id="product"
                name="product"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="target" className="block text-sm font-medium text-gray-700">
                대상 고객
              </label>
              <textarea
                id="target"
                name="target"
                rows="3"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="goal" className="block text-sm font-medium text-gray-700">
                판매 목표 수량
              </label>
              <input
                type="number"
                id="goal"
                name="goal"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {isLoading ? (
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                '제안서 생성'
              )}
            </button>
          </form>
        </motion.div>

        {/* Result Section */}
        {error && (
          <div className="mt-8 max-w-2xl mx-auto bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {proposal && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-8"
          >
            <h3 className="text-xl font-semibold text-gray-900 mb-4">생성된 제안서</h3>
            <div className="bg-gray-50 rounded-lg p-4 whitespace-pre-wrap font-mono text-sm">
              {proposal}
            </div>
            <button
              onClick={() => navigator.clipboard.writeText(proposal)}
              className="mt-4 w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              복사하기
            </button>
          </motion.div>
        )}

        {/* Automation Flow Section */}
        <div className="mt-16">
          <h2 className="text-2xl font-semibold text-gray-900 mb-8 text-center">
            자동화 연동 흐름
          </h2>
          <img
            src="/images/automation-flow.png"
            alt="자동화 연동 흐름도"
            className="w-full rounded-lg shadow-lg"
          />
        </div>

        {/* Links Section */}
        <div className="mt-16 text-center space-y-4">
          <h2 className="text-2xl font-semibold text-gray-900">유용한 링크</h2>
          <div className="flex justify-center space-x-8">
            <a href="#" className="text-blue-600 hover:text-blue-800">Notion 템플릿</a>
            <a href="#" className="text-blue-600 hover:text-blue-800">브랜드 제안서</a>
            <a href="#" className="text-blue-600 hover:text-blue-800">DM 자동화</a>
          </div>
        </div>
      </main>

      <footer className="bg-white border-t mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-center text-gray-500">
            © 2025 소내손 공동구매 플랫폼. 모두의 성장 파트너
          </p>
        </div>
      </footer>
    </div>
  );
} 