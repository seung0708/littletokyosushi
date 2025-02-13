export const retryWithBackoff = async ( fn: () => Promise<any>, maxRetries: number = 3, baseDelay: number = 1000 ) => {
    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        return await fn();
      } catch (error) {
        if (attempt === maxRetries - 1) throw error;
        const delay = baseDelay * Math.pow(2, attempt); // Exponential backoff
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  };

export const retryOperation = async <T>( operation: () => Promise<T>, maxRetries: number = 3, baseDelay: number = 1000 ): Promise<T> => {
    let lastError: any;
    
    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error: any) {
        lastError = error;
        
        // Don't retry if it's a validation error
        if (error.type === 'StripeInvalidRequestError') throw error;
        
        if (attempt === maxRetries - 1) throw lastError;
        
        const delay = baseDelay * Math.pow(2, attempt);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
    throw lastError;
  };