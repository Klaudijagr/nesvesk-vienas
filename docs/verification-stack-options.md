# Identity Verification Stack Options

Two implementation paths for a Lithuania-based couchsurfing platform using Bun/Node.js.

---

## Option 1: Complete Open Source (Self-Hosted)

Full control, zero per-verification costs, runs on Mac or small server.

### Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| **API Server** | Bun | File uploads, orchestration, user-facing endpoints |
| **Face Recognition** | DeepFace (Python) | Face matching + liveness detection |
| **OCR** | docTR (Python) | Extract text from ID documents |
| **MRZ Parsing** | PassportEye (Python) | Read machine-readable zone on IDs/passports |
| **Image Processing** | sharp (Node) + OpenCV (Python) | Resize, deskew, preprocess |

### Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Bun API Server (:3000)                   │
│         Handles uploads, orchestrates microservices         │
└─────────────────────────────────────────────────────────────┘
                              │
           ┌──────────────────┼──────────────────┐
           ▼                  ▼                  ▼
   ┌──────────────┐   ┌──────────────┐   ┌──────────────┐
   │ Face Service │   │ OCR Service  │   │ MRZ Service  │
   │ Python/Flask │   │ Python/Fast  │   │   Python     │
   │   :5001      │   │   :5002      │   │   :5003      │
   └──────────────┘   └──────────────┘   └──────────────┘
           │                  │                  │
           ▼                  ▼                  ▼
      DeepFace +           docTR            PassportEye
      ArcFace model                         + mrz lib
```

### What Each Service Does

**Face Service (DeepFace)**
- Liveness detection (anti-spoofing) on selfie
- Face extraction from ID photo
- Face matching: selfie vs ID photo
- Returns: `verified: bool`, `distance: float`, `is_real: bool`

**OCR Service (docTR)**
- Text extraction from ID document images
- Handles Lithuanian, English, and other EU languages
- Returns: extracted fields as JSON

**MRZ Service (PassportEye)**
- Locates MRZ zone in ID/passport images
- Parses standardized fields: name, DOB, nationality, doc number, expiry
- Validates checksums
- Returns: parsed identity data with confidence score

### Verification Flow

```
1. User uploads: ID photo + selfie
                    │
2. Bun validates file types/sizes
                    │
3. MRZ Service → extracts identity data from ID
                    │
4. Face Service → checks selfie liveness (anti_spoofing=True)
                    │
           ┌────────┴────────┐
           │ Liveness FAIL   │ → Reject, ask for new selfie
           └─────────────────┘
                    │
5. Face Service → matches selfie to ID photo
                    │
           ┌────────┴────────┐
           │ Match FAIL      │ → Reject, flag for review
           └─────────────────┘
                    │
6. Return combined result + store verification record
```

### Key Code Snippets

**Face Service (Python/Flask)**
```python
from deepface import DeepFace

@app.route('/verify', methods=['POST'])
def verify_faces():
    result = DeepFace.verify(
        img1_path=request.files['selfie'],
        img2_path=request.files['id_photo'],
        model_name="ArcFace",
        anti_spoofing=True  # Liveness check included
    )
    return jsonify({
        "verified": result["verified"],
        "distance": result["distance"],
        "threshold": result["threshold"]
    })
```

**MRZ Service (Python)**
```python
from passporteye import read_mrz

@app.route('/parse-mrz', methods=['POST'])
def parse_mrz():
    mrz = read_mrz(request.files['id_image'])
    if mrz is None:
        return jsonify({"error": "No MRZ found"}), 400
    return jsonify(mrz.to_dict())
```

**Bun Orchestration**
```typescript
const verifyUser = async (idPhoto: File, selfie: File) => {
  // 1. Extract MRZ data
  const mrzData = await fetch('http://localhost:5003/parse-mrz', {
    method: 'POST',
    body: formData
  }).then(r => r.json());

  // 2. Verify face + liveness
  const faceResult = await fetch('http://localhost:5001/verify', {
    method: 'POST', 
    body: formData
  }).then(r => r.json());

  return {
    identity: mrzData,
    faceMatch: faceResult.verified,
    confidence: 1 - faceResult.distance
  };
};
```

### Hardware Requirements

- Mac Mini M2 or 4-core Linux server
- 4GB RAM minimum
- No GPU required
- ~3-7 seconds per verification

### Pros/Cons

| Pros | Cons |
|------|------|
| Zero per-verification cost | More dev effort to build |
| Full data control | Lower accuracy than commercial |
| No vendor lock-in | You handle edge cases |
| Works offline | No government database checks |

---

## Option 2: Hybrid with Persona Free Tier

Leverage Persona's **500 free verifications/month for 12 months**, then $1/verification. Persona handles the hard parts (liveness, document verification, fraud detection) while you build the user experience.

### Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| **API Server** | Bun | User management, Persona webhook handler |
| **ID Verification** | Persona (hosted) | Document OCR, liveness, face match, fraud |
| **Fallback** | DeepFace (optional) | Handle edge cases Persona rejects |

### Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Bun API Server (:3000)                   │
│              User auth, verification status                 │
└─────────────────────────────────────────────────────────────┘
           │                                    ▲
           │ Create inquiry                     │ Webhook callback
           ▼                                    │
┌─────────────────────────────────────────────────────────────┐
│                    Persona (Hosted)                         │
│   • Document capture UI                                     │
│   • OCR + MRZ extraction                                    │
│   • Liveness detection                                      │
│   • Face matching                                           │
│   • Fraud signals                                           │
│   • Lithuania ID support ✓                                  │
└─────────────────────────────────────────────────────────────┘
```

### Verification Flow

```
1. User clicks "Verify Identity" in your app
                    │
2. Bun creates Persona inquiry via API
                    │
3. User redirected to Persona hosted flow
   (Persona handles camera, document capture, liveness)
                    │
4. Persona processes and returns result via webhook
                    │
5. Bun receives webhook → updates user verification status
                    │
6. User sees "Verified ✓" badge on profile
```

### What Persona Handles

- **Document verification**: Lithuanian ID cards, passports, driver's licenses
- **Liveness detection**: iBeta Level 2 certified anti-spoofing
- **Face matching**: Compares selfie to ID photo
- **Data extraction**: Name, DOB, address, document number, expiry
- **Fraud detection**: Duplicate submissions, tampered documents
- **UI/UX**: Camera capture, guidance, error handling

### Key Code Snippets

**Create Verification Inquiry (Bun)**
```typescript
const createVerification = async (userId: string) => {
  const response = await fetch('https://api.withpersona.com/api/v1/inquiries', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${PERSONA_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      data: {
        attributes: {
          'inquiry-template-id': 'itmpl_xxx', // Your template
          'reference-id': userId
        }
      }
    })
  });
  
  const inquiry = await response.json();
  return inquiry.data.attributes['hosted-flow-url'];
  // Redirect user to this URL
};
```

**Handle Webhook (Bun)**
```typescript
app.post('/webhooks/persona', async (req) => {
  const event = req.body;
  
  if (event.data.attributes.status === 'completed') {
    const userId = event.data.attributes['reference-id'];
    const passed = event.data.attributes.payload.verification.passed;
    
    await db.users.update(userId, {
      verified: passed,
      verifiedAt: new Date()
    });
  }
});
```

### Pricing

| Period | Cost |
|--------|------|
| Months 1-12 | **FREE** (500/month) |
| After year 1 | $1.00/verification |
| Monthly minimum | $250/month (if using paid) |

### Pros/Cons

| Pros | Cons |
|------|------|
| 500 free/month for a year | Vendor dependency |
| Enterprise-grade accuracy | $1/check after free tier |
| Lithuania support built-in | Data goes to third party |
| Zero infrastructure | Less customization |
| Handles fraud detection | Monthly minimum after Y1 |

---

## Recommendation

| Scenario | Choose |
|----------|--------|
| Testing/MVP phase | **Persona** (free tier) |
| <500 verifications/month | **Persona** (stays free) |
| >500/month, budget conscious | **Open Source** |
| Maximum data control required | **Open Source** |
| Need government database checks | **Persona** (or Veriff/iDenfy) |

**Suggested path**: Start with Persona free tier to validate your platform. Build the open-source stack in parallel as a fallback. Once you exceed 500/month or need more control, you have both options ready.

---

## Quick Reference: Services Comparison

| Capability | Open Source | Persona |
|------------|-------------|---------|
| Face matching | DeepFace (99.4% LFW) | Persona (enterprise) |
| Liveness | DeepFace anti_spoofing | iBeta L2 certified |
| Document OCR | docTR + PassportEye | Built-in |
| Lithuania IDs | ✓ (MRZ parsing) | ✓ (full support) |
| Fraud detection | ✗ | ✓ |
| Gov database checks | ✗ | ✓ |
| Per-check cost | $0 | $0 → $1 |
| Dev effort | High | Low |
