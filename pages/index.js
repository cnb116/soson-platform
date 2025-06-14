import { useState } from 'react';

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [proposal, setProposal] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setProposal('');

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
        throw new Error(data.message || '제안서 생성에 실패했습니다.');
      }

      setProposal(data.proposal);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(proposal);
      alert('제안서가 클립보드에 복사되었습니다.');
    } catch (err) {
      alert('복사에 실패했습니다.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              소내손 공동구매 플랫폼
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              누구나 쉽게, 빠르게 공동구매를 시작할 수 있습니다.
            </p>
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                공동구매 제안서를 자동으로 만들어보세요!
              </h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="product" className="block text-sm font-medium text-gray-700 mb-2">
                    제품명
                  </label>
                  <input
                    type="text"
                    id="product"
                    name="product"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="target" className="block text-sm font-medium text-gray-700 mb-2">
                    대상 고객
                  </label>
                  <textarea
                    id="target"
                    name="target"
                    rows="4"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="goal" className="block text-sm font-medium text-gray-700 mb-2">
                    판매 목표 수량
                  </label>
                  <input
                    type="number"
                    id="goal"
                    name="goal"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition duration-300 disabled:opacity-50"
                >
                  {loading ? '제안서 생성 중...' : '제안서 생성'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Output Section */}
      {(proposal || error) && (
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto">
              <div className="bg-gray-50 rounded-xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">제안서 미리보기</h2>
                {error ? (
                  <div className="bg-red-50 p-4 rounded-lg border border-red-200 text-red-700">
                    {error}
                  </div>
                ) : (
                  <>
                    <div className="bg-white p-6 rounded-lg border border-gray-200 mb-4 min-h-[200px] text-sm whitespace-pre-wrap font-mono">
                      {proposal}
                    </div>
                    <button
                      onClick={copyToClipboard}
                      className="w-full bg-gray-100 text-gray-800 px-6 py-3 rounded-lg font-medium hover:bg-gray-200 transition duration-300"
                    >
                      복사하기
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <p className="text-center mb-8">
              © 2025 소내손 공동구매 플랫폼. 모두의 성장 파트너
            </p>
            <div className="flex flex-wrap justify-center gap-6">
              <a href="#" className="text-gray-400 hover:text-white transition duration-300">
                Notion 템플릿
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition duration-300">
                브랜드 제안서
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition duration-300">
                DM 자동화
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
} 