/**
 * Tourist Assist Automated Integration Test Suite
 * Validates all core user journeys, models, APIs, and workflows
 */

async function runTests() {
  const baseUrl = 'http://localhost:3000';
  let passed = 0;
  let failed = 0;

  function assert(condition, testName) {
    if (condition) {
      console.log(`  ✓ PASS: ${testName}`);
      passed++;
    } else {
      console.error(`  ✗ FAIL: ${testName}`);
      failed++;
    }
  }

  console.log('Starting Tourist Assist Integration Tests...\n');

  try {
    // 1. Static Assets
    const htmlRes = await fetch(`${baseUrl}/`);
    assert(htmlRes.status === 200, 'Home Page (index.html) responds 200 OK');

    const cssRes = await fetch(`${baseUrl}/css/styles.css`);
    assert(cssRes.status === 200, 'Stylesheet (styles.css) responds 200 OK');

    const manifestRes = await fetch(`${baseUrl}/manifest.json`);
    assert(manifestRes.status === 200, 'PWA Manifest (manifest.json) responds 200 OK');

    const swRes = await fetch(`${baseUrl}/sw.js`);
    assert(swRes.status === 200, 'Service Worker (sw.js) responds 200 OK');

    // 2. Statistics API
    const statsRes = await fetch(`${baseUrl}/api/stats`);
    const stats = await statsRes.json();
    assert(stats.totalServices >= 16, `Platform Stats has ${stats.totalServices} essential services`);
    assert(stats.totalAttractions >= 11, `Platform Stats has ${stats.totalAttractions} attractions`);
    assert(stats.approvedProviders >= 4, `Platform Stats has ${stats.approvedProviders} approved providers`);

    // 3. Essential Services Filtering
    const medRes = await fetch(`${baseUrl}/api/services?category=medical`);
    const medicals = await medRes.json();
    assert(medicals.length > 0 && medicals.every(s => s.category === 'medical'), 'Medical category filtering returns only medical facilities');

    const searchRes = await fetch(`${baseUrl}/api/services?search=hospital`);
    const searchResults = await searchRes.json();
    assert(searchResults.length > 0, 'Search keyword "hospital" returns matching records');

    // 4. Attractions & Itinerary Builder
    const attrRes = await fetch(`${baseUrl}/api/attractions`);
    const attractions = await attrRes.json();
    assert(attractions.length >= 11, 'Attractions API returns 11+ Nashik heritage locations');

    const itinRes = await fetch(`${baseUrl}/api/attractions/itinerary`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ duration: 'half_day', interests: ['spiritual', 'historical'] })
    });
    const itin = await itinRes.json();
    assert(itin.timeline && itin.timeline.length === 3, 'Smart Itinerary generates 3 structured stops for half_day');
    assert(itin.advisoryNote !== undefined, 'Itinerary includes realistic crowd and advisory disclaimer');

    // 5. Provider Registration Workflow (Visitor -> Pending -> Admin Approval -> Approved)
    const newProviderPayload = {
      name: 'Ganesh Deshmukh',
      business_name: 'Panchavati Sacred Ghat Electric Shuttles',
      category: 'transport',
      area: 'Panchavati & Tapovan',
      phone: '+91 94239 88776',
      whatsapp: '+91 94239 88776',
      services_offered: 'Eco-friendly battery auto rides from Tapovan to Ramkund',
      description: 'Zero emission last mile transit for senior pilgrims.',
      pricing_notes: '₹20 flat per head'
    };

    const regRes = await fetch(`${baseUrl}/api/providers/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newProviderPayload)
    });
    const regData = await regRes.json();
    assert(regData.success === true && regData.status === 'pending', 'New provider registers with status "pending"');
    const newProviderId = regData.id;

    // 6. Admin Authentication & Moderation
    const loginRes = await fetch(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'admin', password: 'admin123' })
    });
    const authData = await loginRes.json();
    assert(authData.token !== undefined, 'Admin login succeeds and issues JWT token');
    const adminToken = authData.token;

    // Admin verifies and approves the pending provider
    const approveRes = await fetch(`${baseUrl}/api/providers/admin/${newProviderId}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${adminToken}`
      },
      body: JSON.stringify({ status: 'approved', admin_notes: 'Verified commercial EV permit' })
    });
    const approveData = await approveRes.json();
    assert(approveData.provider.status === 'approved', 'Admin updates provider status to "approved"');

    // Now provider should appear in public approved directory
    const publicProvidersRes = await fetch(`${baseUrl}/api/providers`);
    const publicProviders = await publicProvidersRes.json();
    assert(publicProviders.some(p => p.id === newProviderId), 'Newly approved provider appears in public directory');

    // 7. Visitor Enquiry Dispatch
    const enquiryRes = await fetch(`${baseUrl}/api/providers/${newProviderId}/enquire`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        visitor_name: 'Sandeep Rathi',
        visitor_phone: '+91 98220 99887',
        message: 'Looking for 3 e-rickshaws for family on 20th Oct morning.'
      })
    });
    const enquiryData = await enquiryRes.json();
    assert(enquiryData.success === true, 'Visitor successfully dispatches direct enquiry to provider');

    // 8. Dynamic QR Codes
    const qrListRes = await fetch(`${baseUrl}/api/qr`, {
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });
    const qrs = await qrListRes.json();
    assert(qrs.length >= 5, `Admin retrieves ${qrs.length} active dynamic QR codes`);

    // Download QR in SVG format
    const svgRes = await fetch(`${baseUrl}/api/qr/ramkund-ghat-hub/download?format=svg`);
    assert(svgRes.status === 200 && svgRes.headers.get('content-type').includes('svg'), 'QR SVG download generates valid SVG vector image');

    // Download QR in PNG format
    const pngRes = await fetch(`${baseUrl}/api/qr/ramkund-ghat-hub/download?format=png`);
    assert(pngRes.status === 200 && pngRes.headers.get('content-type').includes('png'), 'QR PNG download generates valid PNG image');

    // Dynamic destination update without reprinting
    const updateQrRes = await fetch(`${baseUrl}/api/qr/1`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${adminToken}`
      },
      body: JSON.stringify({ target_url: '/services?category=medical' })
    });
    const updatedQr = await updateQrRes.json();
    assert(updatedQr.target_url === '/services?category=medical', 'Dynamic destination target updated without reprinting physical QR code');

    // 9. Crowdsourced Information Report
    const reportRes = await fetch(`${baseUrl}/api/reports`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        entity_type: 'service',
        entity_id: 1,
        entity_name: 'Civil Hospital Nashik',
        issue_type: 'incorrect_contact',
        description: 'Updated ambulance direct dispatch number',
        reporter_name: 'Dr. Patwardhan'
      })
    });
    const reportData = await reportRes.json();
    assert(reportData.success === true, 'Crowdsourced information correction report submitted successfully');

    // Admin reviews report
    const adminReportsRes = await fetch(`${baseUrl}/api/reports`, {
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });
    const reports = await adminReportsRes.json();
    assert(reports.length > 0, 'Admin successfully retrieves submitted information reports');

    console.log(`\n========================================`);
    console.log(`TEST RESULTS: ${passed} PASSED, ${failed} FAILED`);
    console.log(`========================================\n`);

    if (failed > 0) process.exit(1);
    else process.exit(0);

  } catch (err) {
    console.error('Fatal test error:', err);
    process.exit(1);
  }
}

runTests();
