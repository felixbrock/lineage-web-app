import React, { useState, useEffect, ReactElement } from 'react';
import Message from './components/message';
import ProductDisplay from './components/product-display';
import SuccessDisplay from './components/success-display';

export default (): ReactElement => {
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(false);
  const [sessionId, setSessionId] = useState('');

  useEffect(() => {
    // Check to see if this is a redirect back from Checkout
    const query = new URLSearchParams(window.location.search);

    if (query.get('success')) {
      setSuccess(true);
      const localSessionId = query.get('session_id');
      if (!localSessionId) throw new Error('No session ID found');

      setSessionId(localSessionId);
    }

    if (query.get('canceled')) {
      setSuccess(false);
      setMessage(
        "Order canceled -- continue to shop around and checkout when you're ready."
      );
    }
  }, [sessionId]);

  if (!success && message === '') {
    return <ProductDisplay />;
  } else if (success && sessionId !== '') {
    return <SuccessDisplay sessionId={sessionId} />;
  } else {
    return <Message message={message} />;
  }
};
