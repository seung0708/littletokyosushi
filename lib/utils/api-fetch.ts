import { APIError } from './api-error';

interface FetchOptions extends RequestInit {
  timeout?: number;
  retries?: number;
  retryDelay?: number;
}

export async function fetchWithTimeout(
  url: string,
  options: FetchOptions = {}
): Promise<Response> {
  const {
    timeout = 8000, // 8 second timeout by default
    retries = 3,    // 3 retries by default
    retryDelay = 1000, // 1 second delay between retries
    ...fetchOptions
  } = options;

  let lastError: Error;
  
  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);

      const response = await fetch(url, {
        ...fetchOptions,
        signal: controller.signal
      });

      clearTimeout(timeoutId);
      return response;
    } catch (error) {
      lastError = error as Error;
      
      // Don't retry if it's a user abort
      if (error instanceof Error && error.name === 'AbortError' && options.signal?.aborted) {
        throw error;
      }

      // Last attempt, throw the error
      if (attempt === retries - 1) {
        throw new APIError(
          `Failed after ${retries} attempts: ${lastError.message}`,
          503 // Service Unavailable
        );
      }

      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, retryDelay));
    }
  }

  throw lastError;
}

export async function apiRequest<T>(
  url: string,
  options: FetchOptions = {}
): Promise<T> {
  try {
    const response = await fetchWithTimeout(url, options);
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new APIError(
        error.message || 'An unexpected error occurred',
        response.status
      );
    }

    return response.json();
  } catch (error) {
    if (error instanceof APIError) {
      throw error;
    }
    
    throw new APIError(
      error instanceof Error ? error.message : 'Network request failed',
      503
    );
  }
}
