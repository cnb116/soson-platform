document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('proposal-form');
    const outputSection = document.getElementById('output-section');
    const proposalOutput = document.getElementById('proposal-output');
    const resultBox = document.getElementById('resultBox');
    const copyButton = document.getElementById('copy-button');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // 폼 데이터 수집
        const product = document.getElementById('product-name').value;
        const target = document.getElementById('target-customers').value;
        const goal = document.getElementById('sales-target').value;

        // 로딩 상태 표시
        proposalOutput.textContent = '제안서를 생성하는 중입니다...';
        resultBox.classList.add('hidden');
        outputSection.classList.remove('hidden');

        try {
            const response = await fetch("http://localhost:3000/generate-proposal", {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify({ product, target, goal })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || '서버 응답 오류');
            }

            const data = await response.json();
            proposalOutput.textContent = data.proposal;
            
            // 성공 메시지 표시
            resultBox.textContent = '제안서가 성공적으로 생성되었습니다.';
            resultBox.classList.remove('hidden');
            
            // 스크롤 이동
            outputSection.scrollIntoView({ behavior: 'smooth' });
        } catch (error) {
            console.error('Error:', error);
            proposalOutput.textContent = '';
            resultBox.textContent = `오류가 발생했습니다: ${error.message}`;
            resultBox.classList.remove('hidden');
        }
    });

    copyButton.addEventListener('click', () => {
        const text = proposalOutput.textContent;
        navigator.clipboard.writeText(text).then(() => {
            const originalText = copyButton.textContent;
            copyButton.textContent = '복사 완료!';
            resultBox.textContent = '제안서가 클립보드에 복사되었습니다.';
            resultBox.classList.remove('hidden');
            setTimeout(() => {
                copyButton.textContent = originalText;
                resultBox.classList.add('hidden');
            }, 2000);
        }).catch(err => {
            console.error('복사 실패:', err);
            resultBox.textContent = '텍스트 복사에 실패했습니다.';
            resultBox.classList.remove('hidden');
        });
    });
}); 