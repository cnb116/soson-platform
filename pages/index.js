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
    <body className="bg-gray-100 min-h-screen font-sans">
      <div className="max-w-2xl mx-auto p-6">
        {/* Header */}
        <header className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">소내손 공동구매 플랫폼</h1>
          <p className="text-gray-500 mt-2">누구나 쉽게, 빠르게 공동구매를 시작할 수 있습니다.</p>
        </header>

        {/* Form Card */}
        <div className="bg-white shadow-md rounded-xl p-6 space-y-4">
          <h2 className="text-xl font-semibold text-gray-700">공동구매 제안서를 자동으로 만들어보세요!</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              id="product"
              name="product"
              placeholder="제품명"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <textarea
              id="target"
              name="target"
              rows="3"
              placeholder="대상 고객"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <input
              type="number"
              id="goal"
              name="goal"
              placeholder="판매 목표 수량"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition disabled:opacity-50"
            >
              {loading ? '제안서 생성 중...' : '제안서 생성'}
            </button>
          </form>
        </div>

        {/* Output Section */}
        {(proposal || error) && (
          <div className="mt-8 bg-white shadow-md rounded-xl p-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">제안서 미리보기</h2>
            {error ? (
              <div className="bg-red-50 p-4 rounded-lg border border-red-200 text-red-700">
                {error}
              </div>
            ) : (
              <>
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-4 min-h-[200px] text-sm whitespace-pre-wrap font-mono">
                  {proposal}
                </div>
                <button
                  onClick={copyToClipboard}
                  className="w-full bg-gray-100 text-gray-800 py-2 rounded-md hover:bg-gray-200 transition"
                >
                  복사하기
                </button>
              </>
            )}
          </div>
        )}

        {/* Footer */}
        <footer className="text-center mt-8 text-sm text-gray-500">
          <p>© 2025 소내손 공동구매 플랫폼. 모두의 성장 파트너</p>
          <div className="mt-2 space-x-4">
            <a href="#" className="text-blue-500 hover:underline">Notion 템플릿</a>
            <a href="#" className="text-blue-500 hover:underline">브랜드 제안서</a>
            <a href="#" className="text-blue-500 hover:underline">DM 자동화</a>
          </div>
        </footer>
      </div>
    </body>
  );
} 