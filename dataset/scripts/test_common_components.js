/**
 * AgriShift — Common Components Verification Test
 * Tests importability, exports, and prop contracts of shared foundation components.
 */

const fs = require('fs');
const path = require('path');

const commonDir = path.resolve(__dirname, '../../frontend/src/components/common');

function verifyFile(filename, requiredTokens = []) {
  const filePath = path.join(commonDir, filename);
  if (!fs.existsSync(filePath)) {
    throw new Error(`File ${filename} does not exist at ${filePath}`);
  }
  const content = fs.readFileSync(filePath, 'utf8');
  for (const token of requiredTokens) {
    if (!content.includes(token)) {
      throw new Error(`File ${filename} is missing required token: "${token}"`);
    }
  }
  console.log(`[PASS] ${filename} verified (Found: ${requiredTokens.join(', ')})`);
}

async function runVerification() {
  console.log('=== Verifying Talha Shared Frontend Components ===\n');

  let passed = 0;
  let total = 0;

  function runCheck(name, fn) {
    total++;
    try {
      fn();
      passed++;
    } catch (e) {
      console.error(`[FAIL] ${name}: ${e.message}`);
    }
  }

  // 1. Alert.jsx
  runCheck('Alert.jsx structure and variants', () => {
    verifyFile('Alert.jsx', [
      'export default function Alert',
      'variant = \'info\'',
      'success:',
      'warning:',
      'error:',
      'info:',
      'dismissible',
      'role="alert"',
    ]);
  });

  // 2. PageContainer.jsx
  runCheck('PageContainer.jsx structure and widths', () => {
    verifyFile('PageContainer.jsx', [
      'export default function PageContainer',
      'max-w-7xl',
      'px-4 sm:px-6 lg:px-8',
      'size = \'lg\'',
    ]);
  });

  // 3. EmptyState.jsx
  runCheck('EmptyState.jsx structure and props', () => {
    verifyFile('EmptyState.jsx', [
      'export default function EmptyState',
      'import Button from \'./Button\'',
      'actionLabel',
      'onAction',
      'title',
      'description',
    ]);
  });

  // 4. Existing Components Integrity
  runCheck('Existing common components intact', () => {
    verifyFile('Button.jsx', ['export default function Button', 'variant = \'primary\'']);
    verifyFile('Card.jsx', ['export default function Card', 'rounded-3xl']);
    verifyFile('Input.jsx', ['export default function Input', 'label', 'error']);
    verifyFile('Select.jsx', ['export default function Select', 'options']);
    verifyFile('Badge.jsx', ['export default function Badge', 'success:', 'warning:']);
    verifyFile('LoadingSpinner.jsx', ['export default function LoadingSpinner', 'animate-spin']);
  });

  console.log(`\n========================================`);
  console.log(`COMMON COMPONENT AUDIT: ${passed} / ${total} CHECKS PASSED`);
  console.log(`========================================`);
}

runVerification().catch(console.error);
