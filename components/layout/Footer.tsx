export function Footer() {
  return (
    <footer className="bg-gray-100 text-gray-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* 사업자 정보 */}
          <div>
            <h3 className="text-gray-900 font-semibold mb-4">사업자 정보</h3>
            <ul className="space-y-1 text-sm">
              <li>상호명: 피스코프</li>
              <li>주소지: 서울특별시 마포구 세터산 4길 2, b102호</li>
              <li>전화번호: 010-2087-0621</li>
              <li>사업자등록번호: 118-08-15095</li>
              <li>대표자 이름: 김현준</li>
              <li>개인정보 책임자: 김현준</li>
              <li>통신판매업신고번호: 2021-서울마포-1399</li>
            </ul>
          </div>

          {/* BANK INFO */}
          <div>
            <h3 className="text-gray-900 font-semibold mb-4">BANK INFO</h3>
            <ul className="space-y-1 text-sm">
              <li>우리은행</li>
              <li>1005904144208</li>
              <li>예금주: 피스코프</li>
            </ul>
          </div>

          {/* 고객 지원 */}
          <div>
            <h3 className="text-gray-900 font-semibold mb-4">고객 지원</h3>
            <ul className="space-y-1 text-sm">
              <li>운영시간: 평일 10:00 ~ 18:00</li>
              <li>점심시간: 12:00 ~ 13:00</li>
              <li>주말/공휴일 휴무</li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
