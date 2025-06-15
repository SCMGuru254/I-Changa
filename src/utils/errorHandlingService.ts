
import { useToast } from '@/hooks/use-toast';

export interface ErrorContext {
  component: string;
  action: string;
  userId?: string;
  groupId?: string;
  additionalData?: Record<string, any>;
}

export class AppError extends Error {
  public code: string;
  public context: ErrorContext;
  public timestamp: Date;
  
  constructor(message: string, code: string, context: ErrorContext) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.context = context;
    this.timestamp = new Date();
  }
}

export const errorHandlingService = {
  logError(error: Error | AppError, context?: ErrorContext) {
    const errorData = {
      message: error.message,
      name: error.name,
      stack: error.stack,
      timestamp: new Date().toISOString(),
      ...(error instanceof AppError && {
        code: error.code,
        context: error.context
      }),
      ...(context && { context })
    };
    
    console.error('Application Error:', errorData);
    
    // In production, you would send this to an error tracking service
    // like Sentry, LogRocket, or your own logging endpoint
    return errorData;
  },

  handleDatabaseError(error: any, context: ErrorContext): string {
    console.error('Database error:', error);
    this.logError(new AppError(error.message, 'DATABASE_ERROR', context));
    
    // Handle specific database errors
    if (error.code === '23505') {
      return 'This record already exists. Please try again with different information.';
    }
    
    if (error.code === '23503') {
      return 'Cannot complete this action due to related data dependencies.';
    }
    
    if (error.message?.includes('row-level security')) {
      return 'You do not have permission to perform this action.';
    }
    
    if (error.message?.includes('JWT')) {
      return 'Your session has expired. Please sign in again.';
    }
    
    return 'A database error occurred. Please try again later.';
  },

  handleNetworkError(error: any, context: ErrorContext): string {
    console.error('Network error:', error);
    this.logError(new AppError(error.message, 'NETWORK_ERROR', context));
    
    if (!navigator.onLine) {
      return 'You appear to be offline. Please check your internet connection.';
    }
    
    return 'Network error occurred. Please check your connection and try again.';
  },

  handleValidationError(errors: string[], context: ErrorContext): string {
    const error = new AppError(errors.join(', '), 'VALIDATION_ERROR', context);
    this.logError(error);
    return errors[0]; // Return first validation error
  },

  createErrorHandler(context: ErrorContext) {
    return (error: any) => {
      let message: string;
      
      if (error.name === 'ValidationError') {
        message = this.handleValidationError([error.message], context);
      } else if (error.code || error.message?.includes('supabase')) {
        message = this.handleDatabaseError(error, context);
      } else if (error.name === 'NetworkError' || !navigator.onLine) {
        message = this.handleNetworkError(error, context);
      } else {
        message = 'An unexpected error occurred. Please try again.';
        this.logError(new AppError(error.message, 'UNKNOWN_ERROR', context));
      }
      
      return message;
    };
  }
};

// Hook for consistent error handling in components
export const useErrorHandler = (context: ErrorContext) => {
  const { toast } = useToast();
  
  return {
    handleError: (error: any) => {
      const message = errorHandlingService.createErrorHandler(context)(error);
      toast({
        title: 'Error',
        description: message,
        variant: 'destructive',
      });
    },
    
    handleSuccess: (message: string) => {
      toast({
        title: 'Success',
        description: message,
      });
    }
  };
};
