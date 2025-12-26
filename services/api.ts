/**
 * API Service for Letsfit Backend
 * Base URL: https://letsfit-5xya.vercel.app
 */

const BASE_URL = 'https://letsfit-5xya.vercel.app';

interface APIResponse<T = unknown> {
  ok: boolean;
  error?: string;
  message?: string;
  data?: T;
}

interface RequestOTPResponse {
  ok: boolean;
  message?: string;
  error?: string;
}

interface VerifyOTPResponse {
  ok: boolean;
  message?: string;
  phoneNumber?: string;
  error?: string;
}

interface AuthMeResponse {
  ok: boolean;
  authenticated: boolean;
  phoneNumber?: string;
  error?: string;
}

interface RegisterUserData {
  digits_phone: string;
  name: string;
  user_height: string;
  user_weight: string;
  user_body_pain: string[];
  email?: string;
}

interface RegisterUserResponse {
  ok: boolean;
  user_id?: number;
  message?: string;
  error?: string;
  success?: boolean;
  isExistingUser?: boolean; // true if status was 409
}

interface UpdateUserData {
  name?: string;
  user_height?: string;
  user_weight?: string;
  user_body_pain?: string[];
  email?: string;
}

interface UpdateUserResponse {
  success: boolean;
  message?: string;
  error?: string;
  code?: string;
}

/**
 * Request OTP - Sends a 5-digit code to the user's phone via SMS
 */
export async function requestOTP(phoneNumber: string): Promise<RequestOTPResponse> {
  console.log('📤 [API] requestOTP called');
  console.log('   Phone:', phoneNumber);
  console.log('   URL:', `${BASE_URL}/api/auth/request-otp`);
  
  try {
    const response = await fetch(`${BASE_URL}/api/auth/request-otp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ phoneNumber }),
    });

    console.log('📥 [API] requestOTP response status:', response.status);
    const data = await response.json();
    console.log('📥 [API] requestOTP response data:', JSON.stringify(data, null, 2));
    
    return data;
  } catch (error) {
    console.error('❌ [API] Error requesting OTP:', error);
    return {
      ok: false,
      error: 'خطا در ارتباط با سرور',
    };
  }
}

/**
 * Verify OTP - Verifies the OTP code and creates a session
 */
export async function verifyOTP(
  phoneNumber: string,
  otp: string
): Promise<VerifyOTPResponse> {
  console.log('📤 [API] verifyOTP called');
  console.log('   Phone:', phoneNumber);
  console.log('   OTP:', otp);
  console.log('   URL:', `${BASE_URL}/api/auth/verify-otp`);
  
  try {
    const response = await fetch(`${BASE_URL}/api/auth/verify-otp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ phoneNumber, otp }),
    });

    console.log('📥 [API] verifyOTP response status:', response.status);
    const data = await response.json();
    console.log('📥 [API] verifyOTP response data:', JSON.stringify(data, null, 2));
    
    return data;
  } catch (error) {
    console.error('❌ [API] Error verifying OTP:', error);
    return {
      ok: false,
      error: 'خطا در تایید کد',
    };
  }
}

/**
 * Get current authenticated user
 */
export async function getMe(sessionToken?: string): Promise<AuthMeResponse> {
  try {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (sessionToken) {
      headers['Authorization'] = `Bearer ${sessionToken}`;
    }

    const response = await fetch(`${BASE_URL}/api/auth/me`, {
      method: 'GET',
      headers,
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error getting user:', error);
    return {
      ok: false,
      authenticated: false,
      error: 'خطا در دریافت اطلاعات کاربر',
    };
  }
}

/**
 * Logout - Clears the session
 */
export async function logout(): Promise<APIResponse> {
  try {
    const response = await fetch(`${BASE_URL}/api/auth/logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error logging out:', error);
    return {
      ok: false,
      error: 'خطا در خروج از حساب',
    };
  }
}

/**
 * Check if user exists by attempting registration with minimal data
 * Returns user_id if exists (409) or newly created (201)
 */
export async function checkUserExists(phoneNumber: string): Promise<RegisterUserResponse> {
  console.log('📤 [API] checkUserExists called');
  console.log('   Phone:', phoneNumber);
  
  // Use temporary/default values for initial registration check
  // Note: Letsfit API might require at least one pain value, so we use a default
  const minimalData = {
    digits_phone: phoneNumber,
    name: 'کاربر جدید', // Temporary name
    user_height: '170', // Temporary height
    user_weight: '70', // Temporary weight
    user_body_pain: ['درد گردن'], // Default pain value (will be updated later)
  };
  
  console.log('   Minimal data:', JSON.stringify(minimalData, null, 2));
  console.log('   URL:', `${BASE_URL}/api/users/register`);
  
  try {
    const response = await fetch(`${BASE_URL}/api/users/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(minimalData),
    });

    console.log('📥 [API] checkUserExists response status:', response.status);
    const data = await response.json();
    console.log('📥 [API] checkUserExists response data:', JSON.stringify(data, null, 2));

    // Handle 409 Conflict - User already exists
    if (response.status === 409) {
      console.log('ℹ️  [API] User already exists (409)');
      return {
        ...data,
        ok: true,
        isExistingUser: true,
      };
    }

    // Handle 201 Created - New user
    if (response.status === 201) {
      console.log('✨ [API] New user created (201)');
      return {
        ...data,
        ok: true,
        isExistingUser: false,
      };
    }

    // Handle 400 Bad Request - check if user_id exists (might be validation error but user exists)
    if (response.status === 400 && data.user_id) {
      console.log('ℹ️  [API] Got 400 but user_id exists - treating as existing user');
      return {
        ...data,
        ok: true,
        isExistingUser: true,
      };
    }

    // Handle other errors
    console.log('⚠️  [API] Unexpected response status:', response.status);
    return {
      ok: false,
      error: data.message || 'خطا در بررسی کاربر',
      code: data.code,
      ...data,
    };
  } catch (error) {
    console.error('❌ [API] Error checking user:', error);
    return {
      ok: false,
      error: 'خطا در بررسی کاربر',
    };
  }
}

/**
 * Register user with Letsfit API (full data)
 */
export async function registerUser(
  userData: RegisterUserData
): Promise<RegisterUserResponse> {
  console.log('📤 [API] registerUser called');
  console.log('   User data:', JSON.stringify(userData, null, 2));
  console.log('   URL:', `${BASE_URL}/api/users/register`);
  
  try {
    const response = await fetch(`${BASE_URL}/api/users/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    console.log('📥 [API] registerUser response status:', response.status);
    const data = await response.json();
    console.log('📥 [API] registerUser response data:', JSON.stringify(data, null, 2));

    // Handle 409 Conflict - User already exists
    if (response.status === 409) {
      console.log('ℹ️  [API] User already exists (409)');
      return {
        ...data,
        ok: true,
        isExistingUser: true,
      };
    }

    // Handle 201 Created - New user
    if (response.status === 201) {
      console.log('✨ [API] New user created (201)');
      return {
        ...data,
        ok: true,
        isExistingUser: false,
      };
    }

    return data;
  } catch (error) {
    console.error('❌ [API] Error registering user:', error);
    return {
      ok: false,
      error: 'خطا در ثبت نام',
    };
  }
}

/**
 * Update user profile with Letsfit API
 */
export async function updateUser(
  userId: number,
  userData: UpdateUserData
): Promise<UpdateUserResponse> {
  console.log('📤 [API] updateUser called');
  console.log('   User ID:', userId);
  console.log('   Update data:', JSON.stringify(userData, null, 2));
  console.log('   URL:', `${BASE_URL}/api/users/${userId}/edit`);
  
  try {
    const response = await fetch(`${BASE_URL}/api/users/${userId}/edit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    console.log('📥 [API] updateUser response status:', response.status);
    const data = await response.json();
    console.log('📥 [API] updateUser response data:', JSON.stringify(data, null, 2));

    if (!response.ok) {
      return {
        success: false,
        error: data.message || 'خطا در بروزرسانی پروفایل',
        code: data.code,
      };
    }

    return data;
  } catch (error) {
    console.error('❌ [API] Error updating user:', error);
    return {
      success: false,
      error: 'خطا در بروزرسانی پروفایل',
    };
  }
}

/**
 * Pain value mapping for API
 */
export const ALLOWED_PAIN_VALUES = [
  'درد گردن',
  'درد کتف',
  'کمردرد (سیاتیک)',
  'زانو درد',
  'درد مچ',
] as const;

/**
 * Convert pain values string to API format
 */
export function mapPainValuesToAPI(painValues: string): string[] {
  if (!painValues || painValues.trim() === '') {
    return [];
  }

  const values = painValues
    .split(',')
    .map((v) => v.trim())
    .filter(Boolean);

  return values.filter((value) =>
    ALLOWED_PAIN_VALUES.includes(value as (typeof ALLOWED_PAIN_VALUES)[number])
  );
}

