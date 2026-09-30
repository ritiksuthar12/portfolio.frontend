import emailjs from '@emailjs/browser';

const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID || '';
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || '';
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || '';

/**
 * Check whether EmailJS has been configured with valid keys
 */
export const isEmailJsConfigured = () => {
  return Boolean(
    SERVICE_ID &&
    TEMPLATE_ID &&
    PUBLIC_KEY &&
    SERVICE_ID !== 'your_service_id' &&
    TEMPLATE_ID !== 'your_template_id' &&
    PUBLIC_KEY !== 'your_public_key'
  );
};

/**
 * Send an email directly to ritiksuthar989@gmail.com via EmailJS
 * @param {Object} data - { name, email, subject, message }
 * @returns {Promise<{ success: boolean, result?: any, error?: string, notConfigured?: boolean }>}
 */
export const sendViaEmailJs = async (data) => {
  if (!isEmailJsConfigured()) {
    console.info(
      'ℹ️ [EmailJS] Keys not configured in client/.env. Add VITE_EMAILJS_SERVICE_ID, VITE_EMAILJS_TEMPLATE_ID, and VITE_EMAILJS_PUBLIC_KEY.'
    );
    return {
      success: false,
      notConfigured: true,
      error: 'EmailJS credentials are not configured yet in client/.env'
    };
  }

  const templateParams = {
    name: data.name,
    from_name: data.name,
    email: data.email,
    from_email: data.email,
    reply_to: data.email,
    subject: data.subject || `New Portfolio Contact Message from ${data.name}`,
    message: data.message,
    to_name: 'Ritik Suthar',
    to_email: 'ritiksuthar989@gmail.com'
  };

  try {
    const result = await emailjs.send(
      SERVICE_ID,
      TEMPLATE_ID,
      templateParams,
      {
        publicKey: PUBLIC_KEY
      }
    );

    return {
      success: true,
      result
    };
  } catch (err) {
    console.error('❌ [EmailJS] Failed to deliver email:', err);
    return {
      success: false,
      error: err?.text || err?.message || 'EmailJS sending failed'
    };
  }
};
