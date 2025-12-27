# 🔧 Gemini API Key Configuration & Fix Plan

## Problem Summary

You're encountering the error:
```
[GoogleGenerativeAI Error]: Error fetching from https://generativelanguage.googleapis.com/v1beta/models/text-embedding-004:embedContent: 
[400 Bad Request] API key not valid. Please pass a valid API key.
```

This error occurs **twice**, indicating a systemic issue with how the Gemini API key is being configured or validated.

---

## Root Cause Analysis

### 1. **API Key Validity Issues**

The error `[400 Bad Request] API key not valid` suggests one or more of the following:

| Issue | Likelihood | Impact |
|-------|-----------|--------|
| **API key is expired or revoked** | 🔴 High | API calls will always fail |
| **API key has insufficient permissions** | 🟡 Medium | Embedding model may not be enabled |
| **API key format is incorrect** | 🟡 Medium | Malformed key won't authenticate |
| **API key is not being read from `.env.local`** | 🟡 Medium | `undefined` passed to SDK |
| **Billing/quota issues on Google Cloud** | 🟡 Medium | Account may be suspended |
| **API key is exposed/compromised** | 🔴 High | Google may have disabled it |

### 2. **Current Configuration**

**File:** `.env.local`
```
GEMINI_API_KEY=AIzaSyAQP3ylcOh1lHydoEv4qHKCu00bpBMafm4
```

**Usage Points:**
- ✅ `lib/server/embedding.ts` - Reads from `process.env.GEMINI_API_KEY`
- ✅ `app/api/embedding/route.ts` - Calls `getEmbedding(text)`
- ✅ `verify-db.js` - Tests the API key directly
- ✅ `test-api-keys.js` - Validates API key functionality

**Potential Issues:**
- The API key in `.env.local` may be **invalid, expired, or compromised**
- Environment variable may not be loading correctly in certain contexts
- The key may not have the **Generative Language API** enabled in Google Cloud

---

## Diagnostic Steps

### Step 1: Verify API Key Format & Status

**Action:** Check if the API key is valid and properly formatted.

```bash
# Run the API key test
node test-api-keys.js
```

**Expected Output:**
```
═══ GEMINI API ═══
Key exists: ✅ Yes
Status: ✅ Working
Embedding dimensions: 768
Sample values: [0.1234, -0.5678, 0.9012]
```

**If you see:**
- ❌ `Status: ❌ Error` → API key is invalid or expired
- ❌ `Key exists: ❌ No` → Environment variable not loading

---

### Step 2: Verify Environment Variable Loading

**Action:** Check if `.env.local` is being read correctly.

```bash
# Create a test file
node -e "require('dotenv').config({ path: '.env.local' }); console.log('GEMINI_API_KEY:', process.env.GEMINI_API_KEY ? '✅ Loaded' : '❌ Not loaded')"
```

**Expected Output:**
```
GEMINI_API_KEY: ✅ Loaded
```

---

### Step 3: Test Direct API Call

**Action:** Make a direct call to Google's API to verify the key works.

```bash
# Create test-gemini-direct.js
cat > test-gemini-direct.js << 'EOF'
require('dotenv').config({ path: '.env.local' });
const { GoogleGenerativeAI } = require('@google/generative-ai');

const apiKey = process.env.GEMINI_API_KEY;
console.log('API Key (first 20 chars):', apiKey?.substring(0, 20) + '...');

if (!apiKey) {
    console.error('❌ GEMINI_API_KEY not found');
    process.exit(1);
}

const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: 'text-embedding-004' });

model.embedContent('test')
    .then(result => {
        console.log('✅ API Key is VALID');
        console.log('Embedding dimensions:', result.embedding.values.length);
    })
    .catch(error => {
        console.error('❌ API Key is INVALID');
        console.error('Error:', error.message);
        console.error('Full error:', JSON.stringify(error, null, 2));
    });
EOF

node test-gemini-direct.js
```

---

## Solution: Get a New/Valid Gemini API Key

### Option A: Create a New API Key (Recommended)

1. **Go to Google AI Studio:**
   - Visit: https://makersuite.google.com/app/apikey

2. **Create a new API key:**
   - Click **"Create API Key"**
   - Select **"Create API key in new project"** or use existing project
   - Copy the generated key

3. **Update `.env.local`:**
   ```
   GEMINI_API_KEY=your_new_api_key_here
   ```

4. **Verify the key works:**
   ```bash
   node test-api-keys.js
   ```

### Option B: Use Google Cloud Console (Advanced)

If you need more control or have a Google Cloud project:

1. **Go to Google Cloud Console:**
   - Visit: https://console.cloud.google.com

2. **Enable the Generative Language API:**
   - Search for "Generative Language API"
   - Click **Enable**

3. **Create an API key:**
   - Go to **Credentials** → **Create Credentials** → **API Key**
   - Copy the key

4. **Update `.env.local`:**
   ```
   GEMINI_API_KEY=your_cloud_api_key_here
   ```

---

## Implementation Checklist

### Phase 1: Diagnosis
- [ ] Run `node test-api-keys.js` and capture output
- [ ] Run `node test-gemini-direct.js` and capture output
- [ ] Check if error occurs in development or production
- [ ] Verify `.env.local` file exists and is readable

### Phase 2: Fix
- [ ] Generate a new API key from https://makersuite.google.com/app/apikey
- [ ] Update `GEMINI_API_KEY` in `.env.local`
- [ ] Restart the development server (`npm run dev`)
- [ ] Clear any cached environment variables

### Phase 3: Validation
- [ ] Run `node test-api-keys.js` → Should show ✅ Working
- [ ] Run `npm run dev` and test the embedding endpoint
- [ ] Run `node verify-db.js` → Should generate embeddings successfully
- [ ] Test the search functionality in the UI

### Phase 4: Prevention
- [ ] Document the API key source in comments
- [ ] Set up monitoring for API key expiration
- [ ] Consider using Google Cloud's key rotation policies
- [ ] Add `.env.local` to `.gitignore` (already done ✅)

---

## Code Changes Needed (If Any)

### Current Implementation (lib/server/embedding.ts)

The current code **already has proper error handling**:

```typescript
const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured in environment variables.');
}
```

**No code changes needed** — the issue is with the API key itself, not the code.

---

## Verification Metrics

After implementing the fix, verify:

| Metric | Expected | Current |
|--------|----------|---------|
| API Key Valid | ✅ Yes | ❌ No |
| Embedding Generation | ✅ Works | ❌ Fails |
| Search Functionality | ✅ Works | ❌ Fails |
| Error Rate | 0% | 100% |

---

## Additional Considerations

### 1. **Rate Limiting**
- Gemini API has rate limits (default: 30 requests/minute)
- Current code implements client-side rate limiting
- Monitor usage in Google Cloud Console

### 2. **Quota Management**
- Check Google Cloud Console for quota usage
- Ensure billing is enabled if using free tier
- Consider upgrading if hitting limits

### 3. **Security**
- ⚠️ **NEVER commit `.env.local` to Git** (already in `.gitignore`)
- ⚠️ **NEVER share API keys in public repositories**
- Consider rotating keys periodically
- Use environment-specific keys for dev/prod

### 4. **Deployment**
- For Vercel: Add `GEMINI_API_KEY` to project environment variables
- For other platforms: Ensure the key is set in the deployment environment
- Current `vercel.json` references `${GEMINI_API_KEY}` correctly

---

## Next Steps

1. **Run diagnostics** using the test scripts above
2. **Generate a new API key** if current one is invalid
3. **Update `.env.local`** with the new key
4. **Restart the dev server** and test
5. **Report back** with the diagnostic output

---

## Support Resources

- **Google AI Studio:** https://makersuite.google.com/app/apikey
- **Google Cloud Console:** https://console.cloud.google.com
- **Generative AI SDK Docs:** https://github.com/google/generative-ai-js
- **API Error Reference:** https://ai.google.dev/docs/errors

