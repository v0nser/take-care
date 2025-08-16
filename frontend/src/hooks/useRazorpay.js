import { useState, useEffect } from 'react';
import { useApi } from '../contexts/ApiContext';
import toast from 'react-hot-toast';

const useRazorpay = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const { apiCall } = useApi();

  // Load Razorpay script
  useEffect(() => {
    const loadRazorpayScript = () => {
      return new Promise((resolve) => {
        if (window.Razorpay) {
          setIsScriptLoaded(true);
          resolve(true);
          return;
        }

        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.onload = () => {
          setIsScriptLoaded(true);
          resolve(true);
        };
        script.onerror = () => {
          console.error('Failed to load Razorpay script');
          resolve(false);
        };
        document.body.appendChild(script);
      });
    };

    loadRazorpayScript();
  }, []);

  // Create payment order for appointments
  const createAppointmentOrder = async (appointmentId) => {
    try {
      setIsLoading(true);
      const response = await apiCall('/payments/create-order', 'POST', {
        appointmentId
      });

      if (response.success) {
        return response.data;
      } else {
        throw new Error(response.message || 'Failed to create payment order');
      }
    } catch (error) {
      console.error('Error creating appointment payment order:', error);
      toast.error(error.message || 'Failed to create payment order');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Create payment order for diagnostic bookings
  const createDiagnosticOrder = async (bookingId) => {
    try {
      setIsLoading(true);
      const response = await apiCall('/payments/create-diagnostic-order', 'POST', {
        bookingId
      });

      if (response.success) {
        return response.data;
      } else {
        throw new Error(response.message || 'Failed to create payment order');
      }
    } catch (error) {
      console.error('Error creating diagnostic payment order:', error);
      toast.error(error.message || 'Failed to create payment order');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Verify appointment payment
  const verifyAppointmentPayment = async (paymentData) => {
    try {
      setIsLoading(true);
      const response = await apiCall('/payments/verify', 'POST', paymentData);

      if (response.success) {
        toast.success('Payment successful!');
        return response.data;
      } else {
        throw new Error(response.message || 'Payment verification failed');
      }
    } catch (error) {
      console.error('Error verifying appointment payment:', error);
      toast.error(error.message || 'Payment verification failed');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Verify diagnostic payment
  const verifyDiagnosticPayment = async (paymentData) => {
    try {
      setIsLoading(true);
      const response = await apiCall('/payments/verify-diagnostic', 'POST', paymentData);

      if (response.success) {
        toast.success('Payment successful!');
        return response.data;
      } else {
        throw new Error(response.message || 'Payment verification failed');
      }
    } catch (error) {
      console.error('Error verifying diagnostic payment:', error);
      toast.error(error.message || 'Payment verification failed');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Open checkout for an existing order
  const openExistingOrder = async ({ orderId, amount, currency, description, userDetails, verifyEndpoint }) => {
    if (!isScriptLoaded) throw new Error('Razorpay script not loaded');
    
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_YOUR_KEY_ID',
      name: 'TakeCare',
      description: description || 'Payment',
      order_id: orderId,
      prefill: {
        name: userDetails?.name || 'User',
        email: userDetails?.email || '',
        contact: userDetails?.phone || ''
      },
      theme: { color: '#3B82F6' },
      handler: async (response) => {
        try {
          console.log('Payment successful, verifying...', response);
          await apiCall(verifyEndpoint, 'POST', {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature
          });
          toast.success('Payment successful!');
          
          // Emit socket event for real-time updates
          if (window.socket) {
            window.socket.emit('payment_verified', {
              orderId: response.razorpay_order_id,
              paymentId: response.razorpay_payment_id
            });
          }
        } catch (e) {
          console.error('Payment verification failed:', e);
          toast.error('Payment verification failed. Please contact support.');
          
          // Emit error event
          if (window.socket) {
            window.socket.emit('payment_error', {
              orderId: response.razorpay_order_id,
              error: e.message
            });
          }
        }
      },
      modal: { 
        ondismiss: () => {
          toast.info('Payment cancelled');
          console.log('Payment modal dismissed');
        }
      },
      // Add retry configuration
      retry: {
        enabled: true,
        max_count: 3
      },
      // Add proper error handling
      config: {
        display: {
          blocks: {
            banks: {
              name: "Pay using HDFC Bank",
              instruments: [
                {
                  method: "card",
                  issuers: ["HDFC"]
                },
                {
                  method: "netbanking",
                  banks: ["HDFC"]
                }
              ],
              order: 1
            }
          },
          sequence: ["block.banks"],
          preferences: {
            show_default_blocks: false
          }
        }
      }
    };
    
    try {
      const rz = new window.Razorpay(options);
      rz.open();
    } catch (error) {
      console.error('Error opening Razorpay checkout:', error);
      toast.error('Failed to open payment gateway. Please try again.');
      throw error;
    }
  };

  // Process appointment payment with Razorpay checkout
  const processAppointmentPayment = async (appointmentId, userDetails) => {
    try {
      if (!isScriptLoaded) {
        throw new Error('Razorpay script not loaded');
      }

      console.log('Creating appointment payment order for:', appointmentId);
      
      // Create order
      const orderData = await createAppointmentOrder(appointmentId);
      console.log('Order created successfully:', orderData);
      
      // Configure Razorpay options
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_YOUR_KEY_ID',
        name: 'TakeCare',
        description: 'Appointment Payment',
        order_id: orderData.data.orderId,
        prefill: {
          name: userDetails.name || 'Patient',
          email: userDetails.email || '',
          contact: userDetails.phone || ''
        },
        theme: {
          color: '#3B82F6'
        },
        handler: async (response) => {
          try {
            console.log('Appointment payment successful, verifying...', response);
            // Verify payment
            await verifyAppointmentPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature
            });
            
            toast.success('Payment successful! Your appointment is confirmed.');
            
            // Emit socket event for real-time updates
            if (window.socket) {
              window.socket.emit('appointment_payment_success', {
                appointmentId,
                orderId: response.razorpay_order_id,
                paymentId: response.razorpay_payment_id
              });
            }
          } catch (error) {
            console.error('Appointment payment verification failed:', error);
            toast.error('Payment verification failed. Please contact support.');
            
            // Emit error event
            if (window.socket) {
              window.socket.emit('appointment_payment_error', {
                appointmentId,
                orderId: response.razorpay_order_id,
                error: error.message
              });
            }
          }
        },
        modal: {
          ondismiss: () => {
            toast.info('Payment cancelled');
            console.log('Appointment payment modal dismissed');
          }
        },
        // Add retry configuration
        retry: {
          enabled: true,
          max_count: 3
        }
      };

      console.log('Opening Razorpay checkout with options:', {
        orderId: orderData.data.orderId
      });

      // Open Razorpay checkout
      const razorpay = new window.Razorpay(options);
      razorpay.open();

    } catch (error) {
      console.error('Error processing appointment payment:', error);
      toast.error(error.message || 'Failed to process payment');
      throw error;
    }
  };

  // Process diagnostic payment with Razorpay checkout
  const processDiagnosticPayment = async (bookingId, userDetails) => {
    try {
      if (!isScriptLoaded) {
        throw new Error('Razorpay script not loaded');
      }

      console.log('Creating diagnostic payment order for:', bookingId);
      
      // Create order
      const orderData = await createDiagnosticOrder(bookingId);
      console.log('Diagnostic order created successfully:', orderData);
      
      // Configure Razorpay options
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_YOUR_KEY_ID',
        name: 'TakeCare',
        description: 'Diagnostic Test Payment',
        order_id: orderData.data.orderId,
        prefill: {
          name: userDetails.name || 'Patient',
          email: userDetails.email || '',
          contact: userDetails.phone || ''
        },
        theme: {
          color: '#3B82F6'
        },
        handler: async (response) => {
          try {
            console.log('Diagnostic payment successful, verifying...', response);
            // Verify payment
            await verifyDiagnosticPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature
            });
            
            toast.success('Payment successful! Your diagnostic tests are confirmed.');
            
            // Emit socket event for real-time updates
            if (window.socket) {
              window.socket.emit('diagnostic_payment_success', {
                bookingId,
                orderId: response.razorpay_order_id,
                paymentId: response.razorpay_payment_id
              });
            }
          } catch (error) {
            console.error('Diagnostic payment verification failed:', error);
            toast.error('Payment verification failed. Please contact support.');
            
            // Emit error event
            if (window.socket) {
              window.socket.emit('diagnostic_payment_error', {
                bookingId,
                orderId: response.razorpay_order_id,
                error: error.message
              });
            }
          }
        },
        modal: {
          ondismiss: () => {
            toast.info('Payment cancelled');
            console.log('Diagnostic payment modal dismissed');
          }
        },
        // Add retry configuration
        retry: {
          enabled: true,
          max_count: 3
        }
      };

      console.log('Opening Razorpay checkout for diagnostic with options:', {
        orderId: orderData.data.orderId
      });

      // Open Razorpay checkout
      const razorpay = new window.Razorpay(options);
      razorpay.open();

    } catch (error) {
      console.error('Error processing diagnostic payment:', error);
      toast.error(error.message || 'Failed to process payment');
      throw error;
    }
  };

  const resumeAppointmentPayment = async ({ orderId, amount, currency, userDetails }) => {
    return openExistingOrder({
      orderId,
      amount,
      currency,
      description: 'Appointment Payment',
      userDetails,
      verifyEndpoint: '/payments/verify'
    })
  }

  const resumeDiagnosticPayment = async ({ orderId, amount, currency, userDetails }) => {
    return openExistingOrder({
      orderId,
      amount,
      currency,
      description: 'Diagnostic Test Payment',
      userDetails,
      verifyEndpoint: '/payments/verify-diagnostic'
    })
  }

  return {
    isLoading,
    isScriptLoaded,
    processAppointmentPayment,
    processDiagnosticPayment,
    createAppointmentOrder,
    createDiagnosticOrder,
    verifyAppointmentPayment,
    verifyDiagnosticPayment,
    resumeAppointmentPayment,
    resumeDiagnosticPayment
  };
};

export default useRazorpay; 