'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import TossPaymentWidget from '@/components/TossPaymentWidget';
import PayPalPaymentButton from '@/components/PayPalPaymentButton';

type PaymentMethod = 'toss' | 'paypal';
type ShippingType = 'domestic' | 'international';

const SHIPPING_COSTS = {
  domestic: 3000,
  international: 15000,
};

// Country codes for international shipping
const COUNTRIES = [
  { code: 'US', name: 'United States' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'CA', name: 'Canada' },
  { code: 'AU', name: 'Australia' },
  { code: 'JP', name: 'Japan' },
  { code: 'CN', name: 'China' },
  { code: 'DE', name: 'Germany' },
  { code: 'FR', name: 'France' },
  { code: 'IT', name: 'Italy' },
  { code: 'ES', name: 'Spain' },
  { code: 'NL', name: 'Netherlands' },
  { code: 'SE', name: 'Sweden' },
  { code: 'NO', name: 'Norway' },
  { code: 'DK', name: 'Denmark' },
  { code: 'FI', name: 'Finland' },
  { code: 'CH', name: 'Switzerland' },
  { code: 'AT', name: 'Austria' },
  { code: 'BE', name: 'Belgium' },
  { code: 'NZ', name: 'New Zealand' },
  { code: 'SG', name: 'Singapore' },
  { code: 'HK', name: 'Hong Kong' },
  { code: 'TW', name: 'Taiwan' },
  { code: 'TH', name: 'Thailand' },
  { code: 'VN', name: 'Vietnam' },
  { code: 'MY', name: 'Malaysia' },
  { code: 'PH', name: 'Philippines' },
  { code: 'ID', name: 'Indonesia' },
  { code: 'IN', name: 'India' },
  { code: 'BR', name: 'Brazil' },
  { code: 'MX', name: 'Mexico' },
  { code: 'RU', name: 'Russia' },
  { code: 'PL', name: 'Poland' },
  { code: 'CZ', name: 'Czech Republic' },
  { code: 'HU', name: 'Hungary' },
  { code: 'GR', name: 'Greece' },
  { code: 'PT', name: 'Portugal' },
  { code: 'IE', name: 'Ireland' },
  { code: 'ZA', name: 'South Africa' },
  { code: 'AE', name: 'United Arab Emirates' },
  { code: 'SA', name: 'Saudi Arabia' },
];

interface JusoResult {
  roadAddr: string;
  jibunAddr: string;
  zipNo: string;
  bdNm: string;
}

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getTotal } = useCart();
  const { user } = useAuth();
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('toss');
  const [step, setStep] = useState<'info' | 'payment'>('info');
  const [shippingType, setShippingType] = useState<ShippingType>('domestic');

  // Generate unique order ID: ORD-YYYYMMDD-XXXXXX
  const [orderId] = useState(() => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `ORD-${year}${month}${day}-${random}`;
  });

  // Generate order name from cart items
  const orderName = useMemo(() => {
    if (items.length === 0) return '';
    if (items.length === 1) return items[0].product.name;
    return `${items[0].product.name} 외 ${items.length - 1}건`;
  }, [items]);

  // Get base URL for payment callbacks (must be state to update after hydration)
  const [baseUrl, setBaseUrl] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setBaseUrl(window.location.origin);
    }
  }, []);

  // JUSO API states
  const [addressSearchKeyword, setAddressSearchKeyword] = useState('');
  const [addressResults, setAddressResults] = useState<JusoResult[]>([]);
  const [isSearchingAddress, setIsSearchingAddress] = useState(false);
  const [showAddressResults, setShowAddressResults] = useState(false);

  // Domestic shipping info
  const [shippingInfo, setShippingInfo] = useState({
    name: '',
    email: user?.email || '',
    phone: '',
    address: '',
    addressDetail: '',
    zipCode: '',
  });

  // International shipping info
  const [internationalShippingInfo, setInternationalShippingInfo] = useState({
    name: '',
    email: user?.email || '',
    phone: '',
    postalCode: '',
    country: '',
    state: '',
    province: '',
    addressLine1: '',
    addressLine2: '',
  });

  useEffect(() => {
    if (user?.email) {
      setShippingInfo(prev => ({ ...prev, email: user.email }));
      setInternationalShippingInfo(prev => ({ ...prev, email: user.email }));
    }
  }, [user]);

  // Scroll to top when step changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [step]);

  // JUSO API search function
  const searchAddress = useCallback(async (keyword: string) => {
    if (!keyword || keyword.length < 2) {
      setAddressResults([]);
      return;
    }

    setIsSearchingAddress(true);
    try {
      // JUSO API endpoint - you need to register and get your own API key at https://www.juso.go.kr
      const confmKey = process.env.NEXT_PUBLIC_JUSO_API_KEY || '';
      const response = await fetch(
        `https://business.juso.go.kr/addrlink/addrLinkApi.do?confmKey=${confmKey}&currentPage=1&countPerPage=10&keyword=${encodeURIComponent(keyword)}&resultType=json`
      );
      const data = await response.json();

      if (data.results?.juso) {
        setAddressResults(data.results.juso);
        setShowAddressResults(true);
      } else {
        setAddressResults([]);
      }
    } catch (error) {
      console.error('Address search error:', error);
      setAddressResults([]);
    } finally {
      setIsSearchingAddress(false);
    }
  }, []);

  // Debounced address search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (addressSearchKeyword) {
        searchAddress(addressSearchKeyword);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [addressSearchKeyword, searchAddress]);

  // Handle selecting an address from JUSO results
  const handleSelectAddress = (juso: JusoResult) => {
    setShippingInfo(prev => ({
      ...prev,
      zipCode: juso.zipNo,
      address: juso.roadAddr,
    }));
    setShowAddressResults(false);
    setAddressSearchKeyword('');
    setAddressResults([]);
  };

  // Calculate totals (must be before early return to maintain hook order)
  const subtotal = getTotal();
  const shippingCost = SHIPPING_COSTS[shippingType];
  const shipping = shippingType === 'domestic' && subtotal > 50000 ? 0 : shippingCost;
  const total = subtotal + shipping;

  // Create order before payment
  const createOrder = useCallback(async () => {
    try {
      const currentShippingInfo = shippingType === 'domestic' ? shippingInfo : internationalShippingInfo;

      const orderData = {
        orderId,
        orderName,
        total,
        paymentMethod,
        customerName: currentShippingInfo.name,
        customerEmail: currentShippingInfo.email,
        customerPhone: shippingType === 'domestic' ? shippingInfo.phone : internationalShippingInfo.phone,
        shippingStreet: shippingType === 'domestic'
          ? `${shippingInfo.address} ${shippingInfo.addressDetail}`.trim()
          : `${internationalShippingInfo.addressLine1} ${internationalShippingInfo.addressLine2}`.trim(),
        shippingCity: shippingType === 'domestic' ? '' : internationalShippingInfo.province,
        shippingState: shippingType === 'domestic' ? '' : internationalShippingInfo.state,
        shippingZipCode: shippingType === 'domestic' ? shippingInfo.zipCode : internationalShippingInfo.postalCode,
        shippingCountry: shippingType === 'domestic' ? 'KR' : internationalShippingInfo.country,
        items: items.map(item => ({
          productId: item.product.id,
          variantId: item.variant?.id,
          quantity: item.quantity,
          priceAtTime: item.product.price,
          size: item.variant?.size,
        })),
      };

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to create order');
      }

      // Don't clear cart here - it will be cleared after payment redirect
      // Clearing cart now would cause a re-render that interrupts the payment flow
      return true;
    } catch (error) {
      console.error('Order creation error:', error);
      alert('주문 생성에 실패했습니다. 다시 시도해주세요.');
      return false;
    }
  }, [orderId, orderName, total, paymentMethod, shippingType, shippingInfo, internationalShippingInfo, items]);

  // Early return for empty cart
  if (items.length === 0) {
    return (
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">장바구니가 비어있습니다</h1>
          <p className="text-gray-600 mb-8">결제하기 전에 상품을 담아주세요.</p>
          <Link href="/search">
            <Button size="lg">상품 둘러보기</Button>
          </Link>
        </div>
      </div>
    );
  }

  const handleSubmitInfo = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields based on shipping type
    if (shippingType === 'domestic') {
      const { name, email, phone, address, zipCode } = shippingInfo;
      if (!name.trim() || !email.trim() || !phone.trim() || !address.trim() || !zipCode.trim()) {
        alert('모든 필수 항목을 입력해주세요.');
        return;
      }
    } else {
      const { name, email, phone, country, postalCode, state, province, addressLine1 } = internationalShippingInfo;
      if (!name.trim() || !email.trim() || !phone.trim() || !country || !postalCode.trim() || !state.trim() || !province.trim() || !addressLine1.trim()) {
        alert('Please fill in all required fields.');
        return;
      }
    }

    setStep('payment');
  };

  return (
    <div className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-medium ${step === 'info' ? 'bg-indigo-600 text-white' : 'bg-indigo-100 text-indigo-600'}`}>
              1
            </div>
            <span className="ml-2 font-medium text-gray-900">배송정보</span>
          </div>
          <div className="w-16 h-0.5 bg-gray-200 mx-4" />
          <div className="flex items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-medium ${step === 'payment' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
              2
            </div>
            <span className={`ml-2 font-medium ${step === 'payment' ? 'text-gray-900' : 'text-gray-500'}`}>결제</span>
          </div>
        </div>

        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
          {/* Main Content */}
          <div className="lg:col-span-7">
            {step === 'info' && (
              <form onSubmit={handleSubmitInfo}>
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">주문자 정보</h2>
                  <div className="space-y-4">
                    <Input
                      label={shippingType === 'domestic' ? '이름' : 'Name'}
                      value={shippingType === 'domestic' ? shippingInfo.name : internationalShippingInfo.name}
                      onChange={(e) => {
                        if (shippingType === 'domestic') {
                          setShippingInfo({ ...shippingInfo, name: e.target.value });
                        } else {
                          setInternationalShippingInfo({ ...internationalShippingInfo, name: e.target.value });
                        }
                      }}
                      required
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input
                        label={shippingType === 'domestic' ? '이메일' : 'Email'}
                        type="email"
                        value={shippingType === 'domestic' ? shippingInfo.email : internationalShippingInfo.email}
                        onChange={(e) => {
                          if (shippingType === 'domestic') {
                            setShippingInfo({ ...shippingInfo, email: e.target.value });
                          } else {
                            setInternationalShippingInfo({ ...internationalShippingInfo, email: e.target.value });
                          }
                        }}
                        required
                      />
                      <Input
                        label={shippingType === 'domestic' ? '연락처' : 'Phone'}
                        type="tel"
                        placeholder={shippingType === 'domestic' ? '01012341234' : '12345678900'}
                        value={shippingType === 'domestic' ? shippingInfo.phone : internationalShippingInfo.phone}
                        onChange={(e) => {
                          const numericValue = e.target.value.replace(/[^0-9]/g, '');
                          if (shippingType === 'domestic') {
                            setShippingInfo({ ...shippingInfo, phone: numericValue });
                          } else {
                            setInternationalShippingInfo({ ...internationalShippingInfo, phone: numericValue });
                          }
                        }}
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">배송 방법</h2>
                  <div className="grid grid-cols-2 gap-3 mb-6">
                    <label
                      className={`flex flex-col items-center p-4 border-2 rounded-xl cursor-pointer transition-all ${
                        shippingType === 'domestic'
                          ? 'border-indigo-600 bg-indigo-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="shippingType"
                        checked={shippingType === 'domestic'}
                        onChange={() => setShippingType('domestic')}
                        className="sr-only"
                      />
                      <span className="font-medium text-gray-900">국내배송</span>
                      <span className="text-sm text-gray-500 mt-1">3,000원</span>
                      {/* {shippingType === 'domestic' && subtotal > 50000 && (
                        <span className="text-xs text-green-600 mt-1">5만원 이상 무료</span>
                      )} */}
                    </label>
                    <label
                      className={`flex flex-col items-center p-4 border-2 rounded-xl cursor-pointer transition-all ${
                        shippingType === 'international'
                          ? 'border-indigo-600 bg-indigo-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="shippingType"
                        checked={shippingType === 'international'}
                        onChange={() => setShippingType('international')}
                        className="sr-only"
                      />
                      <span className="font-medium text-gray-900">해외배송</span>
                      <span className="text-sm text-gray-500 mt-1">15,000원</span>
                    </label>
                  </div>

                  <h2 className="text-lg font-semibold text-gray-900 mb-4">배송지 정보</h2>

                  {shippingType === 'domestic' ? (
                    <div className="space-y-4">
                      <div className="relative">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          주소 검색
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={addressSearchKeyword}
                            onChange={(e) => setAddressSearchKeyword(e.target.value)}
                            placeholder="도로명, 건물명 또는 지번으로 검색"
                            className="flex-1 px-4 py-2.5 text-gray-900 bg-white border border-gray-300 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent placeholder:text-gray-400"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => searchAddress(addressSearchKeyword)}
                            disabled={isSearchingAddress}
                          >
                            {isSearchingAddress ? '검색중...' : '검색'}
                          </Button>
                        </div>

                        {showAddressResults && addressResults.length > 0 && (
                          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                            {addressResults.map((juso, index) => (
                              <button
                                key={index}
                                type="button"
                                onClick={() => handleSelectAddress(juso)}
                                className="w-full px-4 py-3 text-left hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                              >
                                <p className="text-sm font-medium text-gray-900">{juso.roadAddr}</p>
                                <p className="text-xs text-gray-500">[{juso.zipNo}] {juso.jibunAddr}</p>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Input
                          label="우편번호"
                          value={shippingInfo.zipCode}
                          onChange={(e) => setShippingInfo({ ...shippingInfo, zipCode: e.target.value })}
                          placeholder="12345"
                          required
                          readOnly
                        />
                        <div className="md:col-span-2">
                          <Input
                            label="주소"
                            value={shippingInfo.address}
                            onChange={(e) => setShippingInfo({ ...shippingInfo, address: e.target.value })}
                            placeholder="주소 검색을 이용해주세요"
                            required
                            readOnly
                          />
                        </div>
                      </div>
                      <Input
                        label="상세주소"
                        value={shippingInfo.addressDetail}
                        onChange={(e) => setShippingInfo({ ...shippingInfo, addressDetail: e.target.value })}
                        placeholder="아파트명, 동/호수"
                      />
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Country <span className="text-red-500">*</span>
                          </label>
                          <select
                            value={internationalShippingInfo.country}
                            onChange={(e) => setInternationalShippingInfo({ ...internationalShippingInfo, country: e.target.value })}
                            required
                            className="w-full px-4 py-2.5 text-gray-900 bg-white border border-gray-300 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          >
                            <option value="">Select a country</option>
                            {COUNTRIES.map((country) => (
                              <option key={country.code} value={country.code}>
                                {country.name} ({country.code})
                              </option>
                            ))}
                          </select>
                        </div>
                        <Input
                          label="Postal Code"
                          value={internationalShippingInfo.postalCode}
                          onChange={(e) => setInternationalShippingInfo({ ...internationalShippingInfo, postalCode: e.target.value })}
                          placeholder="Enter postal code"
                          required
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                          label="State"
                          value={internationalShippingInfo.state}
                          onChange={(e) => setInternationalShippingInfo({ ...internationalShippingInfo, state: e.target.value })}
                          placeholder="Enter state"
                          required
                        />
                        <Input
                          label="Province / City"
                          value={internationalShippingInfo.province}
                          onChange={(e) => setInternationalShippingInfo({ ...internationalShippingInfo, province: e.target.value })}
                          placeholder="Enter province or city"
                          required
                        />
                      </div>
                      <Input
                        label="Address Line 1"
                        value={internationalShippingInfo.addressLine1}
                        onChange={(e) => setInternationalShippingInfo({ ...internationalShippingInfo, addressLine1: e.target.value })}
                        placeholder="Street address, P.O. box"
                        required
                      />
                      <Input
                        label="Address Line 2 (Optional)"
                        value={internationalShippingInfo.addressLine2}
                        onChange={(e) => setInternationalShippingInfo({ ...internationalShippingInfo, addressLine2: e.target.value })}
                        placeholder="Apartment, suite, unit, building, floor, etc."
                      />
                    </div>
                  )}
                </div>

                <Button type="submit" size="lg" className="w-full">
                  결제하기
                </Button>
              </form>
            )}

            {step === 'payment' && (
              <div>
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">결제 수단</h2>

                  {/* Payment Method Selection */}
                  <div className="space-y-3">
                    {/* Toss Payments */}
                    <label
                      className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all ${paymentMethod === 'toss' ? 'border-indigo-600 bg-indigo-50' : 'border-gray-200 hover:border-gray-300'}`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        checked={paymentMethod === 'toss'}
                        onChange={() => setPaymentMethod('toss')}
                        className="sr-only"
                      />
                      <div className="w-12 h-8 bg-blue-500 rounded flex items-center justify-center mr-4">
                        <span className="text-white font-bold text-xs">Toss</span>
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">토스페이먼츠</p>
                        <p className="text-sm text-gray-500">토스로 빠르고 안전하게 결제</p>
                      </div>
                      {paymentMethod === 'toss' && (
                        <svg className="w-6 h-6 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      )}
                    </label>

                    {/* PayPal */}
                    <label
                      className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all ${paymentMethod === 'paypal' ? 'border-indigo-600 bg-indigo-50' : 'border-gray-200 hover:border-gray-300'}`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        checked={paymentMethod === 'paypal'}
                        onChange={() => setPaymentMethod('paypal')}
                        className="sr-only"
                      />
                      <div className="w-12 h-8 bg-blue-600 rounded flex items-center justify-center mr-4">
                        <span className="text-white font-bold text-xs">PP</span>
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">PayPal</p>
                        <p className="text-sm text-gray-500">페이팔로 안전하게 결제</p>
                      </div>
                      {paymentMethod === 'paypal' && (
                        <svg className="w-6 h-6 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      )}
                    </label>
                  </div>
                </div>

                {/* Payment Widget Area */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
                  {paymentMethod === 'toss' ? (
                    <div>
                      <h3 className="font-medium text-gray-900 mb-4">토스페이먼츠</h3>
                      {baseUrl ? (
                        <TossPaymentWidget
                          amount={total}
                          orderId={orderId}
                          orderName={orderName}
                          customerEmail={shippingType === 'domestic' ? shippingInfo.email : internationalShippingInfo.email}
                          customerName={shippingType === 'domestic' ? shippingInfo.name : internationalShippingInfo.name}
                          customerMobilePhone={shippingType === 'domestic' ? shippingInfo.phone : internationalShippingInfo.phone}
                          successUrl={`${baseUrl}/checkout/success`}
                          failUrl={`${baseUrl}/checkout/fail`}
                          onReady={() => console.log('Toss Payment widget ready')}
                          onError={(error) => console.error('Toss Payment error:', error)}
                          onBeforePaymentRequest={async () => {
                            // Create order in database before payment redirect
                            const success = await createOrder();
                            if (!success) {
                              throw new Error('Order creation failed');
                            }
                          }}
                        />
                      ) : (
                        <div className="flex items-center justify-center py-8">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                          <span className="ml-3 text-gray-600">결제 위젯 로딩 중...</span>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div>
                      <h3 className="font-medium text-gray-900 mb-4">PayPal</h3>
                      <PayPalPaymentButton
                        amount={total}
                        orderId={orderId}
                        orderName={orderName}
                        onBeforeCreateOrder={createOrder}
                        onSuccess={(details) => {
                          console.log('PayPal payment success:', details);
                          // Redirect to unified success page
                          router.push(`/checkout/success?paymentMethod=paypal&orderId=${orderId}`);
                        }}
                        onError={(error) => {
                          console.error('PayPal payment error:', error);
                          alert('결제 처리 중 오류가 발생했습니다. 다시 시도해주세요.');
                        }}
                        onCancel={() => {
                          console.log('PayPal payment cancelled');
                        }}
                      />
                    </div>
                  )}
                </div>

                {/* Back button */}
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => setStep('info')}
                  className="w-full mt-4"
                >
                  이전으로 돌아가기
                </Button>
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-5 mt-8 lg:mt-0">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-24">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">주문 요약</h2>

              {/* Cart Items */}
              <div className="space-y-4 mb-6 max-h-64 overflow-y-auto">
                {items.map(item => {
                  const itemKey = item.variant ? `${item.product.id}-${item.variant.id}` : item.product.id;
                  return (
                    <div key={itemKey} className="flex gap-3">
                      <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                        <Image
                          src={item.product.images[0]}
                          alt={item.product.name}
                          width={64}
                          height={64}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {item.product.name}
                        </p>
                        {item.variant && (
                          <p className="text-xs text-gray-600">사이즈: {item.variant.size}</p>
                        )}
                        <p className="text-sm text-gray-500">수량: {item.quantity}</p>
                      </div>
                      <p className="text-sm font-medium text-gray-900">
                        {(item.product.price * item.quantity).toLocaleString()}원
                      </p>
                    </div>
                  );
                })}
              </div>

              <div className="border-t border-gray-200 pt-4 space-y-3">
                <div className="flex justify-between text-gray-600">
                  <span>상품금액</span>
                  <span>{subtotal.toLocaleString()}원</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>
                    배송비
                    <span className="text-xs text-gray-500 ml-1">
                      ({shippingType === 'domestic' ? '국내' : '해외'})
                    </span>
                  </span>
                  <span>
                    {shipping === 0 ? (
                      <span className="text-green-600">무료</span>
                    ) : (
                      `${shipping.toLocaleString()}원`
                    )}
                  </span>
                </div>
                <div className="border-t border-gray-200 pt-3 flex justify-between font-semibold text-gray-900 text-lg">
                  <span>총 결제금액</span>
                  <span>{total.toLocaleString()}원</span>
                </div>
              </div>

              {/* Security Badge */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex items-center justify-center gap-2 text-gray-500">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <span className="text-sm">SSL 보안 암호화</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
