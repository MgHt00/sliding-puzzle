import { SELECTORS } from '../services/selectors.js';
import { showAlert, hideAlert } from '../utils/domHelpers.js';
import { ALERT } from '../constants/appConstants.js';

/**
 * Shows a confirmation alert and returns a promise that resolves with the user's choice.
 * This is ideal for situations where you need to wait for user input before proceeding,
 * such as confirming a game reset. It also handles the 'Escape' key for cancellation.
 * @param {string} [type=ALERT.TYPE_WARNING] - The type of alert to show.
 * @returns {Promise<boolean>} - A promise that resolves to `true` if confirmed, `false` if canceled.
 */
export function showConfirmationAlert(type = ALERT.TYPE_WARNING) {
  return new Promise((resolve) => {
    showAlert(type);

    const confirmBtn = SELECTORS.alertConfirmBtn();
    const cancelBtn = SELECTORS.alertCancelBtn();

    const cleanup = () => {
      confirmBtn.removeEventListener('click', handleConfirm);
      cancelBtn.removeEventListener('click', handleCancel);
      document.removeEventListener('keydown', handleEscape);
      hideAlert();
    };

    const handleConfirm = () => { cleanup(); resolve(true); };
    const handleCancel = () => { cleanup(); resolve(false); };
    const handleEscape = (event) => { if (event.key === 'Escape') { handleCancel(); } };

    confirmBtn.addEventListener('click', handleConfirm, { once: true });
    cancelBtn.addEventListener('click', handleCancel, { once: true });
    document.addEventListener('keydown', handleEscape, { once: true });
  });
}

